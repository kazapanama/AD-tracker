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
        status TEXT CHECK(status IN ('Створені користувачі', 'Заявка в jira', 'Прикінцева конфігурація', 'finita', 'відхилено')) DEFAULT 'Створені користувачі',
        date_when_finished TEXT,
        computer_name TEXT,
        ip_address TEXT
      )
    `);
    
    // Check if the required columns exist and update constraints if needed
    db.all("PRAGMA table_info(units)", (err, rows) => {
      if (err) {
        console.error('Error checking table structure:', err);
        return;
      }
      
      // If ip_address column doesn't exist, add it
      const hasIpAddressColumn = rows.some(row => row.name === 'ip_address');
      if (!hasIpAddressColumn) {
        db.run(`ALTER TABLE units ADD COLUMN ip_address TEXT`);
        console.log('Added ip_address column to units table');
      }
      
      // If computer_name column doesn't exist, add it
      const hasComputerNameColumn = rows.some(row => row.name === 'computer_name');
      if (!hasComputerNameColumn) {
        db.run(`ALTER TABLE units ADD COLUMN computer_name TEXT`);
        console.log('Added computer_name column to units table');
      }
      
      // Check and update status constraint
      db.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name='units'`, (err, result) => {
        if (err) {
          console.error('Error getting table definition:', err);
          return;
        }
        
        if (result && result.sql && !result.sql.includes("'finita'")) {
          console.log('Status constraint needs update to match new status values');
          
          // Create a temporary table with the correct constraint
          db.run(`
            CREATE TABLE units_new (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name_of_unit TEXT,
              brigade_or_higher TEXT,
              mil_unit TEXT NOT NULL,
              description TEXT,
              email TEXT,
              status TEXT CHECK(status IN ('Створені користувачі', 'Заявка в jira', 'Прикінцева конфігурація', 'finita', 'відхилено')) DEFAULT 'Створені користувачі',
              date_when_finished TEXT,
              computer_name TEXT,
              ip_address TEXT
            )
          `, (createErr) => {
            if (createErr) {
              console.error('Error creating temporary table:', createErr);
              return;
            }
            
            // Copy data and map old status values to new ones
            db.run(`
              INSERT INTO units_new(id, name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address)
              SELECT 
                id, 
                name_of_unit, 
                brigade_or_higher, 
                mil_unit, 
                description, 
                email, 
                CASE status
                  WHEN 'Users Created' THEN 'Створені користувачі'
                  WHEN 'Jira Request Made' THEN 'Заявка в jira'
                  WHEN 'Domain Added' THEN 'Прикінцева конфігурація'
                  WHEN 'Completed' THEN 'finita'
                  WHEN 'Rejected' THEN 'відхилено'
                  ELSE 'Створені користувачі'
                END,
                date_when_finished, 
                computer_name,
                NULL
              FROM units
            `, (copyErr) => {
              if (copyErr) {
                console.error('Error copying data to new table:', copyErr);
                return;
              }
              
              // Drop old table
              db.run(`DROP TABLE units`, (dropErr) => {
                if (dropErr) {
                  console.error('Error dropping old table:', dropErr);
                  return;
                }
                
                // Rename new table
                db.run(`ALTER TABLE units_new RENAME TO units`, (renameErr) => {
                  if (renameErr) {
                    console.error('Error renaming new table:', renameErr);
                    return;
                  }
                  
                  console.log('Successfully updated status constraint and data to match new status values');
                });
              });
            });
          });
        }
      });
    });
    
    // Log database initialization
    console.log('Database initialized');
  });
};

module.exports = {
  db,
  initializeDatabase
};