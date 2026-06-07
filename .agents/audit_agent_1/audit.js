const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Starting browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 812, isMobile: true });

    const urls = ['/', '/fahrzeuge', '/kontakt', '/preise'];
    const baseUrl = 'http://localhost:3006';
    let report = '# Mobile UI Audit Report\n\n';
    
    // Wait for the dev server to be ready
    console.log("Waiting for dev server to boot...");
    let retries = 20;
    while (retries > 0) {
        try {
            await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
            console.log("Dev server is reachable.");
            break;
        } catch (e) {
            retries--;
            console.log(`Server not reachable yet, retrying... (${retries} left)`);
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    if (retries === 0) {
        console.error("Server not ready.");
        process.exit(1);
    }

    for (const p of urls) {
        console.log(`Auditing ${p}...`);
        report += `## Page: \`${p}\`\n\n`;
        
        try {
            // Use a long timeout because Next.js dev server compiles pages on first request
            await page.goto(baseUrl + p, { waitUntil: 'networkidle2', timeout: 90000 });
        } catch (e) {
            console.error(`Error loading ${p}: ${e.message}`);
            report += `❌ **Error loading page**: ${e.message}\n\n`;
            continue;
        }
        
        // Wait an extra second for any hydration or animations
        await new Promise(r => setTimeout(r, 1000));

        const auditResult = await page.evaluate(() => {
            let overlaps = [];
            let overflows = [];
            
            const header = document.querySelector('header') || 
                           document.querySelector('[id*="header" i]') || 
                           document.querySelector('[class*="header" i]');
            
            let headerRect = null;
            if (header) {
                headerRect = header.getBoundingClientRect();
            }

            const docWidth = window.innerWidth;

            const allElements = document.querySelectorAll('div, section, p, h1, h2, h3, h4, h5, h6, img, a, button, span, main, ul, li, nav, article');
            
            for (const el of allElements) {
                const rect = el.getBoundingClientRect();
                
                if (rect.width === 0 || rect.height === 0) continue;
                
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

                if (rect.right > docWidth + 1) {
                    const identifier = el.id ? `#${el.id}` : (el.className ? `.${el.className.split(' ').join('.')}` : el.tagName.toLowerCase());
                    overflows.push({
                        element: identifier,
                        textSnippet: el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : '',
                        rightEdge: rect.right,
                        viewportWidth: docWidth
                    });
                }

                if (headerRect && headerRect.height > 0) {
                    if (el !== header && !header.contains(el)) {
                        const intersects = !(rect.right < headerRect.left || 
                                             rect.left > headerRect.right || 
                                             rect.bottom < headerRect.top || 
                                             rect.top > headerRect.bottom);
                        
                        if (intersects && ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'IMG', 'A', 'BUTTON', 'SPAN', 'LI'].includes(el.tagName)) {
                            if (el.tagName !== 'IMG' && (!el.innerText || !el.innerText.trim())) continue;

                            const identifier = el.id ? `#${el.id}` : (el.className ? `.${el.className.split(' ').join('.')}` : el.tagName.toLowerCase());
                            overlaps.push({
                                element: identifier,
                                textSnippet: el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : (el.alt || 'image'),
                                rectTop: rect.top,
                                headerBottom: headerRect.bottom
                            });
                        }
                    }
                }
            }
            
            const uniqueOverflows = [];
            const overflowIds = new Set();
            for (const o of overflows) {
                if (!overflowIds.has(o.element)) {
                    overflowIds.add(o.element);
                    uniqueOverflows.push(o);
                }
            }

            const uniqueOverlaps = [];
            const overlapIds = new Set();
            for (const o of overlaps) {
                if (!overlapIds.has(o.element)) {
                    overlapIds.add(o.element);
                    uniqueOverlaps.push(o);
                }
            }

            return { overlaps: uniqueOverlaps, overflows: uniqueOverflows };
        });

        report += `### SiteHeader Overlap Check\n`;
        if (auditResult.overlaps.length === 0) {
            report += `✅ No content elements found overlapping the SiteHeader.\n\n`;
        } else {
            report += `❌ Found elements overlapping the SiteHeader:\n`;
            for (const o of auditResult.overlaps.slice(0, 10)) {
                report += `- **${o.element}** (Text/Alt: \`${o.textSnippet}\`) | Top: ${o.rectTop}px, Header Bottom: ${o.headerBottom}px\n`;
            }
            if (auditResult.overlaps.length > 10) report += `- ...and ${auditResult.overlaps.length - 10} more.\n`;
            report += `\n`;
        }
        
        report += `### Horizontal Overflow Check\n`;
        if (auditResult.overflows.length === 0) {
            report += `✅ No horizontal overflows detected (max width: 375px).\n\n`;
        } else {
            report += `❌ Found horizontal overflows causing scroll:\n`;
            for (const o of auditResult.overflows.slice(0, 10)) {
                report += `- **${o.element}** (Text: \`${o.textSnippet}\`) | Right edge: ${Math.round(o.rightEdge)}px > Viewport: ${o.viewportWidth}px\n`;
            }
            if (auditResult.overflows.length > 10) report += `- ...and ${auditResult.overflows.length - 10} more.\n`;
            report += `\n`;
        }
    }

    fs.writeFileSync('/Users/umurey/Downloads/apex 3/apex-motors/.agents/audit_agent_1/audit_report.md', report);
    console.log("Audit complete. Report written to audit_report.md.");
    await browser.close();
    process.exit(0);
})();
