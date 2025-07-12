const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authorize = require('../middlewares/authorize');
const answersRouter = require('./answers');

// Mount the answers router for the /questions/:questionId/answers route
router.use('/:questionId/answers', answersRouter);

// Get all questions (public)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find({ status: 'active' })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Get single question (public)
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findOne({ 
            _id: req.params.id,
            status: { $ne: 'deleted' }
        }).populate('user_id', 'username');
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create question (authenticated users only)
router.post('/', authorize('user', 'admin'), async (req, res) => {
    try {
        const { title, body } = req.body;
        const question = new Question({
            title,
            body,
            user_id: req.user.userId,
            status: 'active'
        });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Update question (owner or admin only)
router.put('/:id', authorize('user', 'admin'), async (req, res) => {
    try {
        const question = await Question.findOne({
            _id: req.params.id,
            status: { $ne: 'deleted' }
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is owner or admin
        if (question.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, body } = req.body;
        question.title = title;
        question.body = body;
        await question.save();
        
        res.json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Update question status (owner or admin only)
router.patch('/:id/status', authorize('user', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['active', 'deleted', 'flagged'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Only admin can unflag or restore deleted questions
        if ((question.status === 'flagged' || question.status === 'deleted') && 
            req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if user is owner or admin
        if (question.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        question.status = status;
        await question.save();
        
        res.json(question);
    } catch (error) {
        console.error('Error updating question status:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Delete question (soft delete - owner or admin only)
router.delete('/:id', authorize('user', 'admin'), async (req, res) => {
    try {
        const question = await Question.findOne({
            _id: req.params.id,
            status: { $ne: 'deleted' }
        });
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is owner or admin
        if (question.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        question.status = 'deleted';
        await question.save();
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

module.exports = router;
