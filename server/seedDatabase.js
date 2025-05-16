const { db } = require('./database');

// Sample data
const brigades = [
  '10-та бригада', '12-та бригада', '17-та бригада', '24-та бригада', '28-ма бригада',
  '30-та бригада', '35-та бригада', '43-тя бригада', '53-тя бригада', '59-та бригада',
  '60-та бригада', '65-та бригада', '72-га бригада', '79-та бригада', '93-тя бригада',
  '128-ма бригада', '201-й батальйон', '225-й батальйон', '112-та бригада', '115-та бригада'
];

const milUnits = [
  'А0998', 'А1015', 'А1126', 'А1302', 'А1356',
  'А1405', 'А1671', 'А1769', 'А2235', 'А2802',
  'А3091', 'А3283', 'А3369', 'А3445', 'А4104',
  'А4234', 'А7683', 'А8810', 'А9250', 'А9999'
];

const statusOptions = [
  'Створені користувачі', 'Створені ПК', 'Налаштовано GPO', 
  'Налаштовано політики', 'Налаштовано LAPS', 'Налаштовано MFA', 'Завершено'
];

const descriptions = [
  'Підрозділ ППО', 'Артилерійський підрозділ', 'Механізований підрозділ', 
  'Інженерний підрозділ', 'Підрозділ зв\'язку', 'Підрозділ РЕБ',
  'Медичний підрозділ', 'Логістичний підрозділ', 'Розвідувальний підрозділ',
  'Штабний підрозділ', 'Аеророзвідка', 'Танковий підрозділ'
];

// Helper functions
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function getRandomIp() {
  return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function getRandomComputerName() {
  const prefixes = ['PC', 'LT', 'WS', 'SRV'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${number}`;
}

function getRandomEmail(unitName) {
  const domains = ['mil.gov.ua', 'army.ua', 'forces.ua'];
  const sanitizedName = unitName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  return `${sanitizedName}${Math.floor(Math.random() * 100)}@${getRandomElement(domains)}`;
}

// Create table if it doesn't exist
db.serialize(() => {
  db.run('DROP TABLE IF EXISTS units');
  
  db.run(`CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_of_unit TEXT,
    brigade_or_higher TEXT,
    mil_unit TEXT NOT NULL,
    description TEXT,
    email TEXT,
    status TEXT DEFAULT 'Створені користувачі',
    date_when_finished TEXT,
    computer_name TEXT,
    ip_address TEXT
  )`);

  // Insert 100 random records
  const stmt = db.prepare(`INSERT INTO units (
    name_of_unit, brigade_or_higher, mil_unit, description, 
    email, status, date_when_finished, computer_name, ip_address
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (let i = 0; i < 100; i++) {
    const unitNumber = Math.floor(Math.random() * 900) + 100;
    const nameOfUnit = `Підрозділ ${unitNumber}`;
    const brigadeOrHigher = getRandomElement(brigades);
    const milUnit = getRandomElement(milUnits);
    const description = getRandomElement(descriptions);
    const email = getRandomEmail(nameOfUnit);
    const status = getRandomElement(statusOptions);
    
    // Only add completion date if status is "Завершено"
    const dateWhenFinished = status === 'Завершено' 
      ? getRandomDate(new Date(2023, 0, 1), new Date()) 
      : null;
    
    // Add computer details based on status progression
    const computerName = ['Створені ПК', 'Налаштовано GPO', 'Налаштовано політики', 'Налаштовано LAPS', 'Налаштовано MFA', 'Завершено'].includes(status)
      ? getRandomComputerName()
      : null;
    
    const ipAddress = ['Створені ПК', 'Налаштовано GPO', 'Налаштовано політики', 'Налаштовано LAPS', 'Налаштовано MFA', 'Завершено'].includes(status)
      ? getRandomIp()
      : null;

    stmt.run(
      nameOfUnit,
      brigadeOrHigher,
      milUnit,
      description,
      email,
      status,
      dateWhenFinished,
      computerName,
      ipAddress
    );
  }

  stmt.finalize();
  
  console.log('Added 100 random units to the database!');
  
  // Count items by status
  db.all('SELECT status, COUNT(*) as count FROM units GROUP BY status', (err, rows) => {
    if (err) {
      console.error('Error counting status:', err);
      return;
    }
    
    console.log('\nStatus distribution:');
    rows.forEach(row => {
      console.log(`${row.status}: ${row.count} units`);
    });
    
    db.close(() => {
      console.log('\nDatabase connection closed.');
    });
  });
});