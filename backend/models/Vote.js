const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer',
        required: true
    },
    vote_type: {
        type: String,
        enum: ['up', 'down'],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one vote per user per answer
voteSchema.index({ user_id: 1, answer_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
