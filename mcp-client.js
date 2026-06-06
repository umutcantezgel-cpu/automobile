const { spawn } = require('child_process');

async function runMcp() {
  const mcp = spawn('npx', ['-y', 'chrome-devtools-mcp@latest'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  let requestId = 1;
  let resolvers = {};

  mcp.stdout.on('data', (data) => {
    const messages = data.toString().trim().split('\n');
    for (const msg of messages) {
      if (!msg) continue;
      try {
        const parsed = JSON.parse(msg);
        if (parsed.id && resolvers[parsed.id]) {
          resolvers[parsed.id](parsed);
          delete resolvers[parsed.id];
        } else {
          // console.log('Notification or other:', parsed);
        }
      } catch (err) {
        console.error('Failed to parse:', msg);
      }
    }
  });

  function send(method, params) {
    return new Promise((resolve) => {
      const id = requestId++;
      resolvers[id] = resolve;
      const req = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };
      mcp.stdin.write(JSON.stringify(req) + '\n');
    });
  }

  console.log('Initializing...');
  const initRes = await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0' }
  });
  console.log('Initialized:', initRes);

  await send('notifications/initialized', {});

  console.log('Navigating to http://localhost:3000...');
  const navRes = await send('tools/call', {
    name: 'navigate_page',
    arguments: { type: 'url', url: 'http://localhost:3000' }
  });
  console.log('Navigate response:', JSON.stringify(navRes, null, 2));

  console.log('Waiting a bit for page to load...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('Evaluating script...');
  const evalRes = await send('tools/call', {
    name: 'evaluate_script',
    arguments: {
      script: `
        (function() {
          const els = document.querySelectorAll('*');
          const styles = new Set();
          els.forEach(el => {
            const cs = window.getComputedStyle(el);
            styles.add(cs.backgroundColor);
            styles.add(cs.color);
            styles.add(cs.fontSize);
            styles.add(cs.fontFamily);
            styles.add(cs.lineHeight);
          });
          return Array.from(styles);
        })()
      `
    }
  });
  console.log('Eval response:', JSON.stringify(evalRes, null, 2));

  mcp.kill();
}

runMcp().catch(console.error);
