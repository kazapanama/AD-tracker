const { db } = require('../database');

class Unit {
  static getAll(callback) {
    db.all('SELECT * FROM units ORDER BY id DESC', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM units WHERE id = ?', [id], callback);
  }

  static create(unit, callback) {
    const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, sended_to_legend, computer_name } = unit;
    db.run(
      'INSERT INTO units (name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, sended_to_legend, computer_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, sended_to_legend || 0, computer_name],
      function(err) {
        callback(err, this.lastID);
      }
    );
  }

  static update(id, unit, callback) {
    const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, sended_to_legend, computer_name } = unit;
    db.run(
      'UPDATE units SET name_of_unit = ?, brigade_or_higher = ?, mil_unit = ?, description = ?, email = ?, status = ?, date_when_finished = ?, sended_to_legend = ?, computer_name = ? WHERE id = ?',
      [name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished, sended_to_legend || 0, computer_name, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run('DELETE FROM units WHERE id = ?', [id], callback);
  }

  static search(query, callback) {
    const searchTerm = `%${query}%`;
    db.all(
      `SELECT * FROM units 
       WHERE name_of_unit LIKE ? 
       OR brigade_or_higher LIKE ? 
       OR mil_unit LIKE ? 
       OR description LIKE ? 
       OR email LIKE ?
       OR computer_name LIKE ?
       ORDER BY id DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
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