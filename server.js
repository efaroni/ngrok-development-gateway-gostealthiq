const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const appTargets = {
  'stealth-iq-location': 3001
};

Object.entries(appTargets).forEach(([appKey, targetPort]) => {
  app.use(`/oauth/callback/${appKey}`, createProxyMiddleware({
    target: `http://localhost:${targetPort}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/oauth/callback/${appKey}`]: '/oauth/callback/ghl'
    }
  }));
});

app.listen(PORT, () => {
  console.log(`Gateway server running on port ${PORT}`);
  console.log('Configured routes:');
  Object.entries(appTargets).forEach(([appKey, targetPort]) => {
    console.log(`  /oauth/callback/${appKey} -> http://localhost:${targetPort}/oauth/callback/ghl`);
  });
});