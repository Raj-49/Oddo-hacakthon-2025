const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'deleted', 'flagged'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);
