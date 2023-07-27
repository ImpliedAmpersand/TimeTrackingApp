const express = require('express');
const router = express.Router();
const db = require('../database');
const fs = require('fs');

router.post('/', (req, res) => {
  const { id, lunch} = req.body; // Assuming the request body contains the necessary data

  db.run(
    'UPDATE time_tracking SET lunch = ? WHERE id = ?',
    [lunch, id],
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
