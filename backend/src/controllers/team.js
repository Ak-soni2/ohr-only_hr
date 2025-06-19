import TeamMember from '../models/TeamMember.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getAllTeamMembers = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        
        const teamMembers = await TeamMember.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: teamMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
export const getTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        res.status(200).json({
            success: true,
            data: teamMember
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res) => {
    try {
        const { name, position, type, linkedIn, bio } = req.body;

        // Validate required fields
        if (!name || !position || !type) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, position and type'
            });
        }

        const teamMember = await TeamMember.create({
            name,
            position,
            type,
            linkedIn: linkedIn || '',
            bio: bio || '',
            image: req.file ? req.file.filename : ''
        });

        res.status(201).json({
            success: true,
            data: teamMember,
            message: 'Team member created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res) => {
    try {
        const { name, position, type, linkedIn, bio } = req.body;

        let teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }        const updateData = {
            name,
            position,
            type,
            linkedIn: linkedIn || '',
            bio: bio || '',
        };

        // Only update image if a new one is uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        teamMember = await TeamMember.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: teamMember,
            message: 'Team member updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        await teamMember.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get team members by type (trustees or executives)
// @route   GET /api/team/type/:type
// @access  Public
export const getTeamMembersByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        if (!['trustee', 'executive'].includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid team member type'
            });
        }

        const teamMembers = await TeamMember.find({ type }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: teamMembers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};