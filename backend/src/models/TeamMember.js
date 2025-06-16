import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['trustee', 'executive'],
        default: 'trustee'
    },
    image: {
        type: String,
        default: ''
    },
    linkedIn: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
