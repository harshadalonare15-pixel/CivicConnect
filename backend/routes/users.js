const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');

// @route   GET api/users/top-citizens
// @desc    Get top citizens by issue reports
// @access  Public
router.get('/top-citizens', async (req, res) => {
  try {
    const topCitizens = await Issue.aggregate([
      {
        $group: {
          _id: '$user',
          issueCount: { $sum: 1 },
        },
      },
      {
        $sort: { issueCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          fullName: '$user.fullName',
          issueCount: '$issueCount',
        },
      },
    ]);
    res.json(topCitizens);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
