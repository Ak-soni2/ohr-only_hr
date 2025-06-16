import TeamMember from '../models/TeamMember.js';

// Only for admin
export const addTeamMember = async (req, res) => {
    try {
        const { name, position, type, linkedIn, email, bio, image } = req.body;
        
        const teamMember = new TeamMember({
            name,
            position,
            type, // 'trustee' or 'executive'
            linkedIn,
            email,
            bio,
            image
        });

        await teamMember.save();

        res.status(201).json({
            success: true,
            data: teamMember,
            message: 'Team member added successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all team members
export const getAllTeamMembers = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const teamMembers = await TeamMember.find(filter);
        
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

// Get a single team member
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

// Update team member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const teamMember = await TeamMember.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

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

// Delete team member
export const deleteTeamMember = async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        
        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        res.status(200).json({
            success: true,
            data: teamMember,
            message: 'Team member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
