const express = require('express');
const router = express.Router();
const db = require('../database');

// Define the route
router.get('/', (req, res) => {
  // Retrieve button press data from the database
  var employee = req.query.employee;
  if (employee == "") {
    db.all('SELECT * FROM time_tracking', (err, rows) => { //ORDER BY id DESC
        if (err) {
          console.error('Error retrieving button presses:', err);
          return res.status(500).send('Error retrieving button presses.');
        }
        return res.send(rows);
        });
  }
  else {
  db.all('SELECT * FROM time_tracking WHERE name = ?', [employee], (err, rows) => { // ORDER BY id DESC
    if (err) {
      console.error('Error retrieving button presses:', err);
      return res.status(500).send('Error retrieving button presses.');
    }
    return res.send(rows);
    });
  }
});

module.exports = router;
