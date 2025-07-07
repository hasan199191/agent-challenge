const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Health & Wellness Agent is running.');
});

app.listen(port, () => {
  console.log(`Health endpoint listening on port ${port}`);
});
