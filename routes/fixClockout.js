const express = require('express');
const router = express.Router();
const db = require('../database');
const fs = require('fs');

router.post('/', (req, res) => {
  const { id, hour, minute } = req.body; // Assuming the request body contains the necessary data

  db.run(
    'UPDATE time_tracking SET hour = ?, minute = ?, lunch = ? WHERE id = ?',
    [hour, minute, 0, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while updating the clock out time.');
      }

      return res.sendStatus(200);
    }
  );
});

module.exports = router;
