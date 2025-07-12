const mongoose = require('mongoose');

const questionTagSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    tag_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        required: true
    }
});

// Compound index to ensure unique question-tag combinations
questionTagSchema.index({ question_id: 1, tag_id: 1 }, { unique: true });

module.exports = mongoose.model('QuestionTag', questionTagSchema);
