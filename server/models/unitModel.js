const { db } = require('../database');

class Unit {
  static getAll(callback) {
    db.all('SELECT * FROM units ORDER BY id DESC', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM units WHERE id = ?', [id], callback);
  }

  static create(unit, callback) {
    const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address } = unit;
    db.run(
      'INSERT INTO units (name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address],
      function(err) {
        callback(err, this.lastID);
      }
    );
  }

  static update(id, unit, callback) {
    const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address } = unit;
    db.run(
      'UPDATE units SET name_of_unit = ?, brigade_or_higher = ?, mil_unit = ?, description = ?, email = ?, status = ?, date_when_finished = ?, computer_name = ?, ip_address = ? WHERE id = ?',
      [name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, computer_name, ip_address, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM units WHERE id = ?', [id], callback);
  }

  static search(query, callback) {
    const searchTerm = `%${query.toLowerCase()}%`;
    db.all(
      `SELECT * FROM units
       WHERE LOWER(name_of_unit) LIKE ?
       OR LOWER(brigade_or_higher) LIKE ?
       OR LOWER(mil_unit) LIKE ?
       OR LOWER(description) LIKE ?
       OR LOWER(email) LIKE ?
       OR LOWER(computer_name) LIKE ?
       OR LOWER(ip_address) LIKE ?
       OR LOWER(status) LIKE ?
       ORDER BY id DESC LIMIT 20`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
      callback
    );
  }

  static getStats(callback) {
    db.all(
      `SELECT status, COUNT(*) as count FROM units GROUP BY status`,
      callback
    );
  }
}

module.exports = Unit;