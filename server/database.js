const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS units (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_of_unit TEXT,
        brigade_or_higher TEXT,
        mil_unit TEXT NOT NULL,
        description TEXT,
        email TEXT,
        status TEXT CHECK(status IN ('Accepted Request', 'Users Created', 'Jira Request Made', 'Domain Added', 'Quarantine - 1', 'Quarantine - 2', 'Quarantine - 3', 'Completed')) DEFAULT 'Accepted Request',
        date_when_finished TEXT
      )
    `);
    
    // Log database initialization
    console.log('Database initialized');
  });
};

module.exports = {
  db,
  initializeDatabase
};