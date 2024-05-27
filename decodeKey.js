const bs58 = require('bs58');
const fs = require('fs');

const privateKey = '2zWMLnnJCkVNcesM2W4PZ3RUTnrjrFijJ4gN9cZHNMhNbm4P3mYsF1aEBNL4HuHBNsHom3kExXMHZrkJfGhCRiS9';
const privateKeyBytes = bs58.decode(privateKey);

const privateKeyArray = Array.from(privateKeyBytes);
fs.writeFileSync('my_dex_project-keypair.json', JSON.stringify(privateKeyArray, null, 2));

console.log('Keypair file created: my_dex_project-keypair.json');
