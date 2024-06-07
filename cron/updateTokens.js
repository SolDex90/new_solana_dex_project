const cron = require('node-cron');
const { combineAndDeduplicateData } = require('../services/tokenService');

async function updateTokenList() {
  const tokens = await combineAndDeduplicateData();
  // Save tokens to your database or update your token list file
  console.log('Token list updated:', tokens);
}

// Schedule the update task to run at regular intervals
cron.schedule('*/15 * * * *', updateTokenList); // Every 15 minutes
