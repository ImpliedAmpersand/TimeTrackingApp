const express = require('express');
const router = express.Router();
const db = require('../database');
const fs = require('fs');

// Handle button press
router.post('/', (req, res) => {
  const name = req.body.button;
  const lunch = req.body.lunch;
  const time = req.body.time;
  const timestamp = new Date();
  const date = timestamp.toString().slice(0,15);
  var edited = 0;
  var hour = timestamp.getHours();
  var minute = timestamp.getMinutes();
  if (time !== '-1') {
    edited = 1;
    hour = parseInt(time.slice(0, time.indexOf(':')));
    if (time.includes('p') && hour < 12) {
        hour += 12;
    }
    minute = parseInt(time.slice(time.indexOf(':') + 1, time.indexOf('m') - 1));
  }

  fs.readFile("usersIN.json", "utf8", (err, data) => {
    if (err) {
    console.log(err);
    return res.status(500).json({ error: "Error reading JSON file" });
    }

    const uIN = JSON.parse(data);
    if (uIN.includes(name)) {
      uIN.splice(uIN.indexOf(name), 1);
    } else {
      uIN.push(name);
    }

    // Write the updated items array to the JSON file
    fs.writeFile("usersIN.json", JSON.stringify(uIN), "utf8", (err) => {
    if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error writing JSON file" });
    }

      //res.json({ success: true });
    });
});
  // Insert the button press record into the database
  db.run(
    'INSERT INTO time_tracking (name, date, hour, minute, lunch, edited, erase) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, date, hour, minute, lunch, edited, 0],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while recording the button press.');
      }

      return res.sendStatus(200);
    }
  );
});

module.exports = router;
