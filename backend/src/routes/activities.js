const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Get all activities (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const activities = await Activity.find(query).sort({ date: -1 });
    res.json({
      success: true,
      data: activities
    });
  } catch (err) {
    console.error('Error in GET /activities:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Create new activity (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const newActivity = await activity.save();
    res.status(201).json({
      success: true,
      data: newActivity,
      message: 'Activity created successfully'
    });
  } catch (err) {
    console.error('Error in POST /activities:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Update activity (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    res.json({
      success: true,
      data: activity,
      message: 'Activity updated successfully'
    });
  } catch (err) {
    console.error('Error in PUT /activities/:id:', err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// Delete activity (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }
    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (err) {
    console.error('Error in DELETE /activities/:id:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Get activities by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    if (!['lecture', 'csr'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity type'
      });
    }

    const activities = await Activity.find({ type }).sort({ date: -1 });
    res.json({
      success: true,
      data: activities
    });
  } catch (err) {
    console.error('Error in GET /activities/type/:type:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
