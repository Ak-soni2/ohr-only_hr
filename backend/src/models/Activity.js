import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
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
    bio: {
        type: String,
        required: true,
        maxLength: 300 // approximately 50 words
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // Fields specific to guest lectures
    speaker: {
        name: {
            type: String,
            required: function() { return this.type === 'lecture'; }
        },
        position: {
            type: String,
            required: function() { return this.type === 'lecture'; }
        }
    },
    // Fields specific to CSR activities
    impact: {
        type: String,
        required: function() { return this.type === 'csr'; }
    }
}, {
    timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
