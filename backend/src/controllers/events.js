import Event from '../models/Event.js';
import fs from 'fs';
import path from 'path';

// Get all events
export const getEvents = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        
        if (type) {
            query.type = type;
        }        // First try to get events without populate to ensure basic query works
        const events = await Event.find(query).sort({ date: -1 });
        
        // Then try to populate registration counts
        try {
            await Event.populate(events, { path: 'registrationCount' });
        } catch (populateErr) {
            console.error('Error populating registration counts:', populateErr);
            // Continue without registration counts if populate fails
        }

        res.status(200).json({
            success: true,
            data: events
        });    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({
            success: false,
            message: err.name === 'MongooseError' ? 'Database error while fetching events' :
                    err.name === 'ValidationError' ? 'Invalid event data' :
                    err.message || 'Error fetching events',
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// Get single event
export const getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('registrationCount');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Error fetching event'
        });
    }
};

// Create new event
export const createEvent = async (req, res) => {
    try {
        let eventData = { ...req.body };
        
        // Parse JSON strings if they're strings
        if (typeof eventData.agenda === 'string') {
            try {
                eventData.agenda = JSON.parse(eventData.agenda);
            } catch (e) {
                console.error('Error parsing agenda:', e);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid agenda format'
                });
            }
        }

        if (typeof eventData.speaker === 'string') {
            try {
                eventData.speaker = JSON.parse(eventData.speaker);
            } catch (e) {
                console.error('Error parsing speaker:', e);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid speaker format'
                });
            }
        }

        // Handle file upload
        if (req.file) {
            eventData.image = req.file.filename;
        }

        // Validate required fields
        const requiredFields = ['name', 'type', 'date', 'time', 'location', 'description'];
        const missingFields = requiredFields.filter(field => !eventData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate speaker data
        if (!eventData.speaker || !eventData.speaker.name || !eventData.speaker.bio) {
            return res.status(400).json({
                success: false,
                message: 'Speaker name and bio are required'
            });
        }

        // Validate agenda items if present
        if (eventData.agenda) {
            const invalidAgendaItems = eventData.agenda.filter(item => !item.time || !item.description);
            if (invalidAgendaItems.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'All agenda items must have time and description'
                });
            }
        }

        // Create the event
        const event = await Event.create(eventData);

        res.status(201).json({
            success: true,
            data: event,
            message: 'Event created successfully'
        });
    } catch (err) {
        // Delete uploaded file if event creation fails
        if (req.file) {
            fs.unlink(path.join(process.cwd(), 'uploads', req.file.filename), (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        console.error('Error creating event:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Error creating event'
        });
    }
};

// Update event
export const updateEvent = async (req, res) => {
    try {
        let eventData = { ...req.body };

        // Parse JSON strings if they're strings
        if (typeof eventData.agenda === 'string') {
            try {
                eventData.agenda = JSON.parse(eventData.agenda);
            } catch (e) {
                console.error('Error parsing agenda:', e);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid agenda format'
                });
            }
        }

        if (typeof eventData.speaker === 'string') {
            try {
                eventData.speaker = JSON.parse(eventData.speaker);
            } catch (e) {
                console.error('Error parsing speaker:', e);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid speaker format'
                });
            }
        }
        
        // Handle file upload
        if (req.file) {
            // Get the old event to delete its image
            const oldEvent = await Event.findById(req.params.id);
            if (oldEvent && oldEvent.image) {
                const oldImagePath = path.join(process.cwd(), 'uploads', oldEvent.image);
                // Delete old image file if it exists and is not a URL
                if (fs.existsSync(oldImagePath) && !oldEvent.image.startsWith('http')) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            eventData.image = req.file.filename;
        }

        // Validate required fields
        const requiredFields = ['name', 'type', 'date', 'time', 'location', 'description'];
        const missingFields = requiredFields.filter(field => !eventData[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate speaker data
        if (!eventData.speaker || !eventData.speaker.name || !eventData.speaker.bio) {
            return res.status(400).json({
                success: false,
                message: 'Speaker name and bio are required'
            });
        }

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            eventData,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event,
            message: 'Event updated successfully'
        });
    } catch (err) {
        // Delete uploaded file if event update fails
        if (req.file) {
            fs.unlink(path.join(process.cwd(), 'uploads', req.file.filename), (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        console.error('Error updating event:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'Error updating event'
        });
    }
};

// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Delete the associated image file if it exists and is not a URL
        if (event.image && !event.image.startsWith('http')) {
            const imagePath = path.join(process.cwd(), 'uploads', event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Event.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Error deleting event'
        });
    }
};
