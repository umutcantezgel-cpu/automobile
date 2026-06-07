const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAudit() {
  const browser = await puppeteer.launch();
  const pages = ['/', '/fahrzeuge', '/kontakt', '/preise'];
  const baseUrl = 'http://localhost:3006';
  const reportLines = ['# Final Audit Report\n\n'];

  let allOk = true;

  for (const p of pages) {
    const url = `${baseUrl}${p}`;
    console.log(`Auditing ${url}...`);
    reportLines.push(`## Path: ${p}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812 });

    await page.goto(url, { waitUntil: 'networkidle0' });

    // 1. Check for horizontal overflow
    const overflowElements = await page.evaluate(() => {
      const issues = [];
      const documentWidth = document.documentElement.clientWidth;
      
      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > documentWidth) {
          // Check if it's visually hidden or a style tag, etc.
          if (el.tagName.toLowerCase() === 'style' || el.tagName.toLowerCase() === 'script') return;
          // check for 0 width / 0 height or invisible
          if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;

          issues.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            right: rect.right,
            width: rect.width,
            documentWidth
          });
        }
      });
      return issues;
    });

    if (overflowElements.length === 0) {
      reportLines.push('- [x] No horizontal overflow issues found.');
      console.log('  - [x] No horizontal overflow issues found.');
    } else {
      reportLines.push('- [ ] Horizontal overflow issues found:');
      console.log(`  - [ ] Horizontal overflow issues found: ${overflowElements.length}`);
      overflowElements.slice(0, 5).forEach(issue => {
         const msg = `    - Element <${issue.tagName} class="${issue.className}" id="${issue.id}"> rect.right=${issue.right} > viewport=${issue.documentWidth}`;
         reportLines.push(msg);
         console.log(msg);
      });
      if (overflowElements.length > 5) {
        reportLines.push(`    - ... and ${overflowElements.length - 5} more.`);
      }
      allOk = false;
    }

    // 2. Check for SiteHeader overlap
    const overlapElements = await page.evaluate(() => {
      const header = document.querySelector('header');
      if (!header) return [];
      const headerRect = header.getBoundingClientRect();
      const issues = [];

      document.querySelectorAll('*').forEach((el) => {
        if (header.contains(el)) return;
        if (el === header) return;

        const rect = el.getBoundingClientRect();
        // check visibility
        if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;
        
        // Exclude elements that are meant to be visually hidden or skip links
        if (el.classList.contains('sr-only')) return;
        if (window.getComputedStyle(el).position === 'absolute' && parseInt(window.getComputedStyle(el).left) < -1000) return;

        // check intersection with header
        const overlap = !(rect.right <= headerRect.left || 
                          rect.left >= headerRect.right || 
                          rect.bottom <= headerRect.top || 
                          rect.top >= headerRect.bottom);
        
        if (overlap) {
          // To be more precise, only flag if it's visually above or clearly conflicting.
          // In Next.js/Tailwind sites, some background elements might be absolute/fixed behind header.
          // Let's get z-index
          const zIndexEl = parseInt(window.getComputedStyle(el).zIndex) || 0;
          const zIndexHeader = parseInt(window.getComputedStyle(header).zIndex) || 0;
          
          if (zIndexEl >= zIndexHeader) {
            issues.push({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                rectTop: rect.top,
                rectBottom: rect.bottom,
                headerBottom: headerRect.bottom
            });
          }
        }
      });
      return issues;
    });

    if (overlapElements.length === 0) {
      reportLines.push('- [x] No inappropriate SiteHeader overlap issues found.');
      console.log('  - [x] No inappropriate SiteHeader overlap issues found.');
    } else {
      reportLines.push('- [ ] SiteHeader overlap issues found:');
      console.log(`  - [ ] SiteHeader overlap issues found: ${overlapElements.length}`);
      overlapElements.slice(0, 5).forEach(issue => {
         const msg = `    - Element <${issue.tagName} class="${issue.className}" id="${issue.id}"> overlaps with header.`;
         reportLines.push(msg);
         console.log(msg);
      });
      if (overlapElements.length > 5) {
        reportLines.push(`    - ... and ${overlapElements.length - 5} more.`);
      }
      allOk = false;
    }

    reportLines.push('\n');
    await page.close();
  }

  reportLines.push(`\n## Summary`);
  reportLines.push(`Overall Status: ${allOk ? 'PASS' : 'FAIL'}`);

  fs.writeFileSync('./.agents/audit_agent_2/final_audit_report.md', reportLines.join('\n'));
  
  await browser.close();
  console.log('Audit complete.');
}

runAudit().catch(console.error);
