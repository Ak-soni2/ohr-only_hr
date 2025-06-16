import mongoose from 'mongoose';

const agendaItemSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['monthly', 'foundation'],
        default: 'monthly'
    },
    speaker: {
        name: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            required: true
        }
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    agenda: [agendaItemSchema],
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
