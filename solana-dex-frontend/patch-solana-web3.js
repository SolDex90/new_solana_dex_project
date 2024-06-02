const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules/@solana/web3.js/lib/index.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

const patchedContent = fileContent.replace(
  "import { WebSocket } from 'rpc-websockets/dist/lib/client/websocket.browser';",
  "import { WebSocket } from 'rpc-websockets';"
);

fs.writeFileSync(filePath, patchedContent, 'utf8');
