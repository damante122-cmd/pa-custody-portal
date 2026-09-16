const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motion search endpoint
app.get('/api/motions', (req, res) => {
  const query = req.query.q ? `%${req.query.q}%` : '%';
  db.all(
    "SELECT * FROM motions WHERE title LIKE ? OR statute LIKE ? OR description LIKE ?",
    [query, query, query],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`PA Custody Portal server listening on port ${PORT}`);
});
