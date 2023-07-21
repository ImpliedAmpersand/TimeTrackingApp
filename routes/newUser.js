const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
    const newUser = req.body.newUser;

    // Read the items from the JSON file
    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error reading JSON file" });
        }

        const users = JSON.parse(data);
        users.push(newUser);

        // Write the updated items array to the JSON file
        fs.writeFile("users.json", JSON.stringify(users), "utf8", (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error writing JSON file" });
        }

        return res.json({ success: true });
        });
    });

  });
  
  module.exports = router;