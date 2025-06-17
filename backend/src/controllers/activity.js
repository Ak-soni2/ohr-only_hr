import Activity from '../models/Activity.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getAllActivities = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        
        console.log('Fetching activities with query:', query);
        const activities = await Activity.find(query).sort({ date: -1 });
        console.log('Found activities:', activities.length);
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private/Admin
export const createActivity = async (req, res) => {
    try {
        const activity = await Activity.create(req.body);

        res.status(201).json({
            success: true,
            data: activity,
            message: 'Activity created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
export const updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            success: true,
            data: activity,
            message: 'Activity updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: 'Activity not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Activity deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get activities by type
// @route   GET /api/activities/type/:type
// @access  Public
export const getActivitiesByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!['lecture', 'csr'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid activity type'
            });
        }

        const activities = await Activity.find({ type }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
