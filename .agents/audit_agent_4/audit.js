const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });

  const urls = ['/', '/fahrzeuge', '/kontakt', '/preise'];
  let allClean = true;
  let report = '# Layout Audit Report\n\n';

  for (const path of urls) {
    report += `## Path: ${path}\n`;
    console.log(`Auditing ${path}...`);
    await page.goto(`http://localhost:3006${path}`, { waitUntil: 'networkidle0' });

    // Wait a brief moment to ensure JS effects are applied
    await new Promise(resolve => setTimeout(resolve, 500));

    const issues = await page.evaluate(() => {
      const badElements = [];
      const header = document.querySelector('header');
      let headerRect = header ? header.getBoundingClientRect() : null;

      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        if (['SCRIPT', 'STYLE', 'HTML', 'BODY', 'HEAD', 'META', 'TITLE', 'LINK', 'NOSCRIPT'].includes(el.tagName)) continue;

        const rect = el.getBoundingClientRect();
        
        // Overflow check
        if (rect.right > 375) {
          // Allow fractional pixels like 375.1, but strictly greater than say 375.5 is bad
          if (rect.right > 375.5) {
            badElements.push({
              tag: el.tagName,
              className: el.className,
              issue: 'overflow',
              right: rect.right
            });
          }
        }

        // Overlap with header check
        if (header && el !== header && !header.contains(el)) {
          if (el.classList && el.classList.contains('sr-only')) continue;

          // Check for intersection
          // An element overlaps the header if its rect intersects the header's rect
          // Header is usually fixed at top: 0, left: 0, right: 375, height: ~80
          const intersects = (
            rect.left < headerRect.right &&
            rect.right > headerRect.left &&
            rect.top < headerRect.bottom &&
            rect.bottom > headerRect.top
          );

          if (intersects && rect.width > 0 && rect.height > 0) {
            // Ignore the main wrapper itself as it spans the page, and the footer if it somehow triggers.
            // Wait, main starts at pt-20, so its top is 80 (or exactly at header bottom).
            // rect.top < headerRect.bottom would be false if rect.top == headerRect.bottom
            // But if it's a fixed element on the page (like another header or toast) overlapping...
            // Let's filter out full-height containers if they are supposed to be underneath?
            // Actually, if `main` has `pt-20`, its `top` is 80, so it doesn't intersect.
            // If it DOES intersect, it's a bug!
            if (el.tagName !== 'MAIN' && el.id !== 'main') {
              badElements.push({
                tag: el.tagName,
                className: el.className,
                issue: 'overlap',
                rect: { top: rect.top, bottom: rect.bottom, height: rect.height }
              });
            }
          }
        }
      }
      return badElements;
    });

    if (issues.length === 0) {
      report += `- ✅ No overflow or header overlap issues found.\n\n`;
    } else {
      allClean = false;
      report += `- ❌ Issues found:\n`;
      issues.forEach(iss => {
        report += `  - \`<${iss.tag} class="${iss.className}">\`: ${iss.issue} (Details: ${JSON.stringify(iss)})\n`;
      });
      report += '\n';
    }
  }

  fs.writeFileSync('/Users/umurey/Downloads/apex 3/apex-motors/.agents/audit_agent_4/final_audit_report.md', report);
  await browser.close();
  
  if (allClean) {
    console.log("ALL CLEAN");
    process.exit(0);
  } else {
    console.log("ISSUES FOUND");
    process.exit(1);
  }
})();
