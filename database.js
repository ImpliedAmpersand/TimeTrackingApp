const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const db = new sqlite3.Database('time_tracking.db');

// Create a table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS time_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    date TEXT,
    hour INTEGER,
    minute INTEGER,
    lunch INTEGER

  )
`);

// Export the database connection
module.exports = db;
