const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const VOTE_FILE = './votes.json';
const PORT = process.env.PORT || 3000;

// Load or initialize vote data
let votes = [0, 0, 0];
if (fs.existsSync(VOTE_FILE)) {
  try {
    votes = JSON.parse(fs.readFileSync(VOTE_FILE));
  } catch (e) {
    console.error("Failed to load votes.json:", e);
  }
}

app.use(express.static('public'));
app.use(express.json());

app.get('/votes', (req, res) => {
  res.json(votes);
});

app.post('/vote', (req, res) => {
  const { id } = req.body;
  if (typeof id === 'number' && id >= 0 && id < votes.length) {
    votes[id]++;
    fs.writeFileSync(VOTE_FILE, JSON.stringify(votes));
    res.json({ success: true, votes });
  } else {
    res.status(400).json({ error: 'Invalid vote ID' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
