const express = require('express');
const Unit = require('../models/unitModel');
const router = express.Router();

// Get all units
router.get('/units', (req, res) => {
  Unit.getAll((err, units) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(units);
  });
});

// Get unit by ID
router.get('/units/:id', (req, res) => {
  const id = req.params.id;
  Unit.getById(id, (err, unit) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    res.json(unit);
  });
});

// Create new unit
router.post('/units', (req, res) => {
  const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished } = req.body;
  
  if (!mil_unit) {
    return res.status(400).json({ error: 'Military unit is required' });
  }
  
  const newUnit = {
    name_of_unit,
    brigade_or_higher,
    mil_unit,
    description: description || null,
    email: email || null,
    status: status || 'Accepted Request',
    date_when_finished: date_when_finished || null
  };
  
  Unit.create(newUnit, (err, id) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, ...newUnit });
  });
});

// Update unit
router.put('/units/:id', (req, res) => {
  const id = req.params.id;
  const { name_of_unit, brigade_or_higher, mil_unit, description, email, status, date_when_finished } = req.body;
  
  if (!mil_unit) {
    return res.status(400).json({ error: 'Military unit is required' });
  }
  
  const updatedUnit = {
    name_of_unit,
    brigade_or_higher,
    mil_unit,
    description: description || null,
    email: email || null,
    status: status || 'Accepted Request',
    date_when_finished: date_when_finished || null
  };
  
  Unit.update(id, updatedUnit, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, ...updatedUnit });
  });
});

// Delete unit
router.delete('/units/:id', (req, res) => {
  const id = req.params.id;
  Unit.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Unit deleted successfully' });
  });
});

// Search units
router.get('/units/search/:query', (req, res) => {
  const query = req.params.query;
  Unit.search(query, (err, units) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(units);
  });
});

// Get statistics
router.get('/stats', (req, res) => {
  Unit.getStats((err, stats) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(stats);
  });
});

module.exports = router;