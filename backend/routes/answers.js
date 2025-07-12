const express = require('express');
const router = express.Router({ mergeParams: true }); // Add mergeParams to access params from parent router
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const authorize = require('../middlewares/authorize');

// Get answers for a question (public)
router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find({ 
            question_id: req.params.questionId,
            status: 'active'
        })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 });
        res.json(answers);
    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get single answer
router.get('/:answerId', async (req, res) => {
    try {
        const answer = await Answer.findOne({
            _id: req.params.answerId,
            question_id: req.params.questionId,
            status: { $ne: 'deleted' }
        }).populate('user_id', 'username');
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.json(answer);
    } catch (error) {
        console.error('Error fetching answer:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Post an answer (authenticated users only)
router.post('/', authorize('user', 'admin'), async (req, res) => {
    try {
        // First verify if the question exists and is active
        const question = await Question.findOne({
            _id: req.params.questionId,
            status: 'active'
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found or is not active' });
        }

        const { body } = req.body;
        const answer = new Answer({
            question_id: req.params.questionId,
            body,
            user_id: req.user.userId,
            status: 'active'
        });
        
        await answer.save();
        
        const populatedAnswer = await Answer.findById(answer._id)
            .populate('user_id', 'username');
            
        res.status(201).json(populatedAnswer);
    } catch (error) {
        console.error('Error creating answer:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Update answer (owner or admin only)
router.put('/:answerId', authorize('user', 'admin'), async (req, res) => {
    try {
        const answer = await Answer.findOne({
            _id: req.params.answerId,
            question_id: req.params.questionId,
            status: { $ne: 'deleted' }
        });

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is owner or admin
        if (answer.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { body } = req.body;
        answer.body = body;
        await answer.save();
        
        const populatedAnswer = await Answer.findById(answer._id)
            .populate('user_id', 'username');
            
        res.json(populatedAnswer);
    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Update answer status (owner or admin only)
router.patch('/:answerId/status', authorize('user', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'deleted', 'flagged'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const answer = await Answer.findOne({
            _id: req.params.answerId,
            question_id: req.params.questionId
        });

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Only admin can unflag or restore deleted answers
        if ((answer.status === 'flagged' || answer.status === 'deleted') && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if user is owner or admin
        if (answer.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        answer.status = status;
        await answer.save();
        
        const populatedAnswer = await Answer.findById(answer._id)
            .populate('user_id', 'username');
            
        res.json(populatedAnswer);
    } catch (error) {
        console.error('Error updating answer status:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Delete answer (soft delete - owner or admin only)
router.delete('/:answerId', authorize('user', 'admin'), async (req, res) => {
    try {
        const answer = await Answer.findOne({
            _id: req.params.answerId,
            question_id: req.params.questionId,
            status: { $ne: 'deleted' }
        });
        
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is owner or admin
        if (answer.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        answer.status = 'deleted';
        await answer.save();
        
        res.json({ message: 'Answer deleted successfully' });
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
