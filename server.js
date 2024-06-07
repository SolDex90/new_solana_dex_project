const express = require('express');
const cors = require('cors');
const { combineAndDeduplicateData } = require('./services/tokenService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/tokens', async (req, res) => {
  try {
    const tokens = await combineAndDeduplicateData();
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error); // Detailed logging
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
