import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[\d\s-]{8,}$/, 'Please provide a valid phone number']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure one user can't register multiple times for the same event
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
