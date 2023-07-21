const express = require('express');
const router = express.Router();
const fs = require('fs');

// Define the index route
router.get('/', (req, res) => {
  users = JSON.parse(fs.readFileSync("users.json", "utf8", (err, data) => {
    if (err) {
    console.log(err);
    return res.status(500).json({ error: "Error reading JSON file" });
    }
  })
  );
  uIN = JSON.parse(fs.readFileSync("usersIN.json", "utf8", (err, data) => {
    if (err) {
    console.log(err);
    return res.status(500).json({ error: "Error reading JSON file" });
    }
  }));
  res.render('index', { allUsers: users , usersIn: uIN });
});

module.exports = router;
