import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['lecture', 'csr'],
        default: 'lecture'
    },
    description: {
        type: String,
        required: true,
        maxLength: 300 // approximately 50 words
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    speaker: {
        type: String,
        required: function() { return this.type === 'lecture'; }
    },
    position: {
        type: String,
        required: function() { return this.type === 'lecture'; }
    },
    impact: {
        type: String,
        required: function() { return this.type === 'csr'; }
    }
}, {
    timestamps: true
});

export default mongoose.model('Activity', activitySchema);
