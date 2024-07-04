const bs58 = require('bs58');
const fs = require('fs');
require('dotenv').config(); // Ensure you have dotenv installed

const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    console.error('Private key is not set in environment variables');
    process.exit(1);
}

const privateKeyBytes = bs58.decode(privateKey);
const privateKeyArray = Array.from(privateKeyBytes);
fs.writeFileSync('my_dex_project-keypair.json', JSON.stringify(privateKeyArray, null, 2));

console.log('Keypair file created: my_dex_project-keypair.json');
