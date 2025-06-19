import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Register for an event
export const registerForEvent = async (req, res) => {
    try {
        // Check if event exists
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Create registration
        const registration = await Registration.create({
            ...req.body,
            eventId: req.params.eventId
        });

        res.status(201).json({
            success: true,
            data: registration,
            message: 'Registration successful'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event'
            });
        }
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get registrations for an event (admin only)
export const getEventRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({ eventId: req.params.eventId })
            .select('-__v')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: registrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
