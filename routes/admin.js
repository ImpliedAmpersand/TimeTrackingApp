const express = require('express');
const router = express.Router();
const db = require('../database');
const fs = require('fs');

// Define the admin route
router.get('/', (req, res) => {
  // Retrieve button press data from the database
  db.all('SELECT * FROM time_tracking', (err, rows) => { // ORDER BY id DESC
    if (err) {
      console.error('Error retrieving button presses:', err);
      return res.status(500).send('Error retrieving button presses.');
    }
    users = JSON.parse(fs.readFileSync("users.json", "utf8", (err, data) => {
      if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error reading JSON file" });
      }
    })
    );

    // Render the admin page and pass the button press data
    res.render('admin', { buttonPresses: rows, allUsers: users });
  });
});

module.exports = router;
