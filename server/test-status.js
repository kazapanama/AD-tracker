const { db, initializeDatabase } = require('./database');

// Initialize the database
initializeDatabase();

// Check the status field definition
db.all("PRAGMA table_info(units)", (err, rows) => {
  if (err) {
    console.error('Error checking table structure:', err);
    return;
  }
  
  console.log("Table structure:");
  const statusColumn = rows.find(row => row.name === 'status');
  if (statusColumn) {
    console.log("Status column definition:", statusColumn);
  } else {
    console.log("Status column not found");
  }
});

// Test inserting an item with 'Rejected' status
const testUnit = {
  name_of_unit: 'Test Unit',
  brigade_or_higher: 'Test Brigade',
  mil_unit: 'Test-123',
  description: 'Test description',
  email: 'test@example.com',
  status: 'Rejected',
  computer_name: 'TEST-PC'
};

db.run(
  'INSERT INTO units (name_of_unit, brigade_or_higher, mil_unit, description, email, status, computer_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [testUnit.name_of_unit, testUnit.brigade_or_higher, testUnit.mil_unit, testUnit.description, testUnit.email, testUnit.status, testUnit.computer_name],
  function(err) {
    if (err) {
      console.error('Error inserting with Rejected status:', err);
    } else {
      console.log('Successfully inserted unit with Rejected status, ID:', this.lastID);
      
      // Try updating an existing record to 'Rejected'
      db.run('UPDATE units SET status = ? WHERE id = ?', ['Rejected', this.lastID], function(updateErr) {
        if (updateErr) {
          console.error('Error updating to Rejected status:', updateErr);
        } else {
          console.log('Successfully updated unit to Rejected status');
        }
        
        // Clean up test data
        db.run('DELETE FROM units WHERE id = ?', [this.lastID], function(deleteErr) {
          if (deleteErr) {
            console.error('Error cleaning up test data:', deleteErr);
          } else {
            console.log('Test data cleaned up');
          }
          
          // Close database connection
          setTimeout(() => {
            db.close();
          }, 1000);
        });
      });
    }
  }
);