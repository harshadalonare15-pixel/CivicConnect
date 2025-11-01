const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Department = require('../models/Department');

// @route   POST api/departments
// @desc    Add a new department
// @access  Private (admin only)
router.post('/', auth, async (req, res) => {
  const { name, head, email, phone } = req.body;

  try {
    let department = await Department.findOne({ name });
    if (department) {
      return res.status(400).json({ msg: 'Department already exists' });
    }

    department = new Department({
      name,
      head,
      email,
      phone,
    });

    await department.save();
    res.status(201).json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/departments
// @desc    Get all departments
// @access  Private (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;