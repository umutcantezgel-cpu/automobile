const puppeteer = require('puppeteer');
const fs = require('fs');

async function runAudit() {
  const browser = await puppeteer.launch();
  const pages = ['/', '/fahrzeuge', '/kontakt', '/preise'];
  const baseUrl = 'http://localhost:3006';
  const reportLines = ['# Independent Test Execution Report\n\n'];

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
          if (el.tagName.toLowerCase() === 'style' || el.tagName.toLowerCase() === 'script') return;
          if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;
          if (el.tagName.toLowerCase() === 'noscript') return;

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
        if (rect.width === 0 || rect.height === 0 || window.getComputedStyle(el).display === 'none') return;
        
        if (el.classList.contains('sr-only')) return;
        if (window.getComputedStyle(el).position === 'absolute' && parseInt(window.getComputedStyle(el).left) < -1000) return;

        const overlap = !(rect.right <= headerRect.left || 
                          rect.left >= headerRect.right || 
                          rect.bottom <= headerRect.top || 
                          rect.top >= headerRect.bottom);
        
        if (overlap) {
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

  fs.writeFileSync('./.agents/victory_auditor_2/final_audit_report.md', reportLines.join('\n'));
  
  await browser.close();
  console.log('Audit complete. Check ./.agents/victory_auditor_2/final_audit_report.md for details.');
}

runAudit().catch(console.error);
