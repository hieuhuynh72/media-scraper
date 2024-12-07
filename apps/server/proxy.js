// eslint-disable-next-line @typescript-eslint/no-require-imports
const http = require('http');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const httpProxy = require('http-proxy');

// List of targets (ports your applications are running on)
const targets = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

// Create a proxy server
const proxy = httpProxy.createProxyServer({});
let i = 0;

const server = http.createServer((req, res) => {
  const target = targets[i]; // Round-robin load balancing
  i = (i + 1) % targets.length; // Move to the next target
  console.log(`Proxying request to: ${target}`);
  proxy.web(req, res, { target }, (err) => {
    console.error(`Failed to proxy request to ${target}:`, err);
    res.writeHead(500);
    res.end('Internal server error');
  });
});

// Start the load balancer on port 80
server.listen(4000, () => {
  console.log('Load balancer is running on http://localhost:4000');
});
