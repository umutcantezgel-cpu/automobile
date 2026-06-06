const fs = require('fs');
const path = require('path');

const motionFiles = [
  'src/app/admin/anfragen/page.tsx',
  'src/app/admin/fahrzeuge/[id]/page.tsx',
  'src/app/admin/fahrzeuge/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/angebote/page.tsx',
  'src/app/calculator/page.tsx',
  'src/app/finanzierung/page.tsx',
  'src/app/service/page.tsx',
  'src/app/template.tsx',
  'src/app/ueber-uns/page.tsx',
  'src/app/vergleich/page.tsx'
];

for (const file of motionFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // add import if missing
    if (!content.includes('useMotionTokens')) {
      if (content.includes('framer-motion')) {
        content = content.replace(/(import .* from ['"]framer-motion['"];)/, "$1\nimport { useMotionTokens } from '@/lib/motion';");
      } else {
        content = "import { useMotionTokens } from '@/lib/motion';\n" + content;
      }
    }
    
    // insert hook call inside component if missing
    // we need to find the main component and insert it
    // this is tricky with regex, let's just do simple replace for duration/delay first
    // Actually, using getDuration/getDelay means we must have the hook initialized.
    
    // Instead of parsing, we can just replace duration: 0.x with duration: getDuration(0.x)
    content = content.replace(/duration:\s*([0-9.]+)/g, "duration: getDuration($1)");
    content = content.replace(/delay:\s*([0-9.]+)/g, "delay: getDelay($1)");
    
    // deduplicate
    content = content.replace(/getDuration\(getDuration\((.*?)\)\)/g, "getDuration($1)");
    content = content.replace(/getDelay\(getDelay\((.*?)\)\)/g, "getDelay($1)");

    fs.writeFileSync(filePath, content);
  }
}

const springFiles = [
  'src/app/inzahlungnahme/page.tsx',
  'src/app/probefahrt/page.tsx',
  'src/components/sections/hero.tsx',
  'src/components/sections/site-header.tsx',
  'src/components/sections/quick-search.tsx'
];

for (const file of springFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/type:\s*['"]spring['"]/g, "type: getTransitionType('spring')");
    
    fs.writeFileSync(filePath, content);
  }
}
