const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const authorize = require('../middlewares/authorize');

// Get all questions (public)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('user_id', 'username')
            .sort({ created_at: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single question (public)
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('user_id', 'username');
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
        const { title, description } = req.body;
        const question = new Question({
            title,
            description,
            user_id: req.user.userId
        });
        await question.save();
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update question (owner or admin only)
router.put('/:id', authorize('user', 'admin'), async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is owner or admin
        if (question.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description } = req.body;
        question.title = title;
        question.description = description;
        await question.save();
        
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete question (owner or admin only)
router.delete('/:id', authorize('user', 'admin'), async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is owner or admin
        if (question.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await question.remove();
        res.json({ message: 'Question removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
