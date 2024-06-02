const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules/@solana/web3.js/lib/index.js');
const fileContent = fs.readFileSync(filePath, 'utf8');
const fixedContent = fileContent.replace(
  "require('rpc-websockets/dist/lib/client/websocket.browser')",
  "require('rpc-websockets')"
);

fs.writeFileSync(filePath, fixedContent, 'utf8');
