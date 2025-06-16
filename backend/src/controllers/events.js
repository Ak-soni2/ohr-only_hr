import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        
        if (type) {
            query.type = type;
        }

        const events = await Event.find(query).sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single event
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new event
export const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
