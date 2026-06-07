const puppeteer = require('puppeteer');

async function checkPage(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // wait a moment for any client side rendering
  await new Promise(resolve => setTimeout(resolve, 2000));

  const issues = await page.evaluate(() => {
    const horizontalOverflows = [];
    const overlaps = [];

    // viewport width
    const vw = window.innerWidth;

    const allElements = document.querySelectorAll('*');
    const header = document.querySelector('header');
    let headerRect = { top: 0, left: 0, bottom: 80, right: 375 };
    if (header) {
      headerRect = header.getBoundingClientRect();
    }

    // Let's find elements causing scroll
    const realScrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth
    );
    const hasHorizontalScroll = realScrollWidth > vw;

    allElements.forEach(el => {
      // 1. Horizontal overflow
      const rect = el.getBoundingClientRect();
      
      // If the page has horizontal scroll, identify elements wider than viewport or sticking out
      if (hasHorizontalScroll) {
        if (rect.right > vw && rect.width > 0 && rect.height > 0) {
          // exclude elements that are overflow:hidden and their right just matches scrollWidth
          const style = window.getComputedStyle(el);
          if (style.overflow !== 'hidden' && style.overflowX !== 'hidden') {
            horizontalOverflows.push({
              tag: el.tagName,
              className: el.className,
              right: rect.right,
              width: rect.width,
              text: el.innerText ? el.innerText.substring(0, 30) : ''
            });
          }
        }
      }

      // 2. Overlap with Header
      if (header && (el === header || header.contains(el))) return;
      if (el.classList && el.classList.contains('sr-only')) return; // allowed skip link
      if (el.id === 'skip-to-content') return; // sometimes ids are used

      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return;
      if (rect.width === 0 || rect.height === 0) return;

      const isMeaningful = (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.innerText.trim() !== '') || 
                           el.tagName === 'IMG' || el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'P';
                           
      if (isMeaningful) {
        const intersectX = rect.left < headerRect.right && rect.right > headerRect.left;
        const intersectY = rect.top < headerRect.bottom && rect.bottom > headerRect.top;
        if (intersectX && intersectY) {
          const style = window.getComputedStyle(el);
          if (style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none') {
             overlaps.push({
               tag: el.tagName,
               className: el.className,
               text: el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : '',
               top: rect.top,
               bottom: rect.bottom,
               headerBottom: headerRect.bottom
             });
          }
        }
      }
    });

    // filter overlaps: only keep ones that are genuinely under the header, meaning top is less than headerBottom
    // actually our intersection check already does that.
    // let's remove duplicates
    const uniqueOverlaps = [];
    const overlapKeys = new Set();
    for (const o of overlaps) {
      const key = `${o.tag}-${o.text}-${o.top}`;
      if (!overlapKeys.has(key)) {
        overlapKeys.add(key);
        uniqueOverlaps.push(o);
      }
    }

    return {
      hasHorizontalScroll,
      scrollWidth: realScrollWidth,
      viewportWidth: vw,
      horizontalOverflows: horizontalOverflows.length > 0 ? horizontalOverflows.slice(0, 10) : null,
      overlaps: uniqueOverlaps.length > 0 ? uniqueOverlaps : null
    };
  });

  await page.close();
  return issues;
}

(async () => {
  const browser = await puppeteer.launch();
  
  const pages = ['/', '/fahrzeuge', '/kontakt', '/preise'];
  const baseUrl = 'http://localhost:3007';
  const results = {};

  for (const p of pages) {
    console.log('Testing', p);
    results[p] = await checkPage(browser, baseUrl + p);
  }

  await browser.close();
  console.log('===RESULTS===');
  console.log(JSON.stringify(results, null, 2));
})();
