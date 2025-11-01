const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Department = require('../models/Department'); // Import Department model
const auth = require('../middleware/auth'); // Import auth middleware

// @route   POST api/issues
// @desc    Create a new issue
// @access  Private (or Public for initial submission)
router.post('/', auth, async (req, res) => {
  const { description, category, location, truthfulnessDeclaration } = req.body;

  // Basic validation
  if (!description || !category || !location || !truthfulnessDeclaration) {
    return res.status(400).json({ msg: 'Please enter all required fields' });
  }

  try {
    const newIssue = new Issue({
      description,
      category,
      location,
      truthfulnessDeclaration,
      user: req.user.id, // Use authenticated user's ID
    });

    const issue = await newIssue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues
// @desc    Get all issues (for admin dashboard)
// @access  Private (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status, department, search } = req.query;
    let query = {};

    if (status && status !== 'All Status') {
      query.status = status;
    }

    if (department && department !== 'All Departments') {
      const dept = await Department.findOne({ name: department });
      if (dept) {
        query.department = dept._id;
      } else {
        // If department name doesn't exist, return empty array or handle error
        return res.json([]);
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      // Search by description, issue ID, user name, or user email
      query.$or = [
        { description: searchRegex },
        { _id: searchRegex },
        { 'user.name': searchRegex }, // Requires populate to work effectively
        { 'user.email': searchRegex }, // Requires populate to work effectively
      ];
    }

    const issues = await Issue.find(query).populate('user', ['name', 'email']).populate('department', 'name').sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues/category-counts
// @desc    Get issue counts by category
// @access  Private (admin only)
router.get('/category-counts', auth, async (req, res) => {
  try {
    const categoryCounts = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(categoryCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues/status-counts
// @desc    Get issue counts by status
// @access  Private (admin only)
router.get('/status-counts', auth, async (req, res) => {
  try {
    const statusCounts = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(statusCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues/issues-over-time
// @desc    Get issue creation counts over time (e.g., daily)
// @access  Private (admin only)
router.get('/issues-over-time', auth, async (req, res) => {
  try {
    const issuesOverTime = await Issue.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(issuesOverTime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/issues/:id
// @desc    Update an issue (for admin dashboard)
// @access  Private (admin only)
router.put('/:id', async (req, res) => {
  const { status, department } = req.body;

  try {
    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ msg: 'Issue not found' });
    }

    if (status) issue.status = status;
    if (department) issue.department = department;

    await issue.save();
    res.json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/issues/me
// @desc    Get issues for the logged-in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id }).populate('user', ['name', 'email']).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;