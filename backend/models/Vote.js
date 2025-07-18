const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    target_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    target_type: {
        type: String,
        enum: ['question', 'answer'],
        required: true
    },
    vote_value: {
        type: Number,
        enum: [-1, 1],
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one vote per user per target
voteSchema.index({ user_id: 1, target_id: 1, target_type: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
