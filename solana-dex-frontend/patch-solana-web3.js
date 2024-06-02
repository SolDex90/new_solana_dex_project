const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules/@solana/web3.js/lib/index.js');

console.log(`Checking for file: ${filePath}`);

if (fs.existsSync(filePath)) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const patchedContent = fileContent.replace(
    "import { WebSocket } from 'rpc-websockets/dist/lib/client/websocket.browser';",
    "import { WebSocket } from 'rpc-websockets';"
  );

  fs.writeFileSync(filePath, patchedContent, 'utf8');
  console.log('Patch applied successfully.');
} else {
  console.error(`File not found: ${filePath}`);
  process.exit(1); // Exit with an error code
}
