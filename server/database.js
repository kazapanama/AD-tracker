const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use environment variable for database directory or fallback to current directory
const dbDir = process.env.DATABASE_DIR || __dirname;
const dbPath = path.resolve(dbDir, 'database.sqlite');

// Log database path for debugging
console.log(`Using database at: ${dbPath}`);

// Ensure the directory exists
if (!fs.existsSync(path.dirname(dbPath))) {
  console.log(`Creating database directory: ${path.dirname(dbPath)}`);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Initialize database with tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Create table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS units (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_of_unit TEXT,
        brigade_or_higher TEXT,
        mil_unit TEXT NOT NULL,
        description TEXT,
        email TEXT,
        status TEXT CHECK(status IN ('Accepted Request', 'Users Created', 'Jira Request Made', 'Domain Added', 'Quarantine - 1', 'Quarantine - 2', 'Quarantine - 3', 'Completed', 'Rejected')) DEFAULT 'Accepted Request',
        date_when_finished TEXT,
        sended_to_legend INTEGER DEFAULT 0,
        computer_name TEXT
      )
    `);
    
    // Check if the required columns exist
    db.all("PRAGMA table_info(units)", (err, rows) => {
      if (err) {
        console.error('Error checking table structure:', err);
        return;
      }
      
      // If sended_to_legend column doesn't exist, add it
      const hasSendedToLegendColumn = rows.some(row => row.name === 'sended_to_legend');
      if (!hasSendedToLegendColumn) {
        db.run(`ALTER TABLE units ADD COLUMN sended_to_legend INTEGER DEFAULT 0`);
        console.log('Added sended_to_legend column to units table');
      }
      
      // If computer_name column doesn't exist, add it
      const hasComputerNameColumn = rows.some(row => row.name === 'computer_name');
      if (!hasComputerNameColumn) {
        db.run(`ALTER TABLE units ADD COLUMN computer_name TEXT`);
        console.log('Added computer_name column to units table');
      }
    });
    
    // Log database initialization
    console.log('Database initialized');
  });
};

module.exports = {
  db,
  initializeDatabase
};