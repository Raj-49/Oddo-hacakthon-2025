const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const authorize = require('../middlewares/authorize');

// Get answers for a question (public)
router.get('/question/:questionId', async (req, res) => {
    try {
        const answers = await Answer.find({ question_id: req.params.questionId })
            .populate('user_id', 'username')
            .sort({ created_at: -1 });
        res.json(answers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Post an answer (authenticated users only)
router.post('/', authorize('user', 'admin'), async (req, res) => {
    try {
        const { question_id, description } = req.body;
        const answer = new Answer({
            question_id,
            description,
            user_id: req.user.userId
        });
        await answer.save();
        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update answer (owner or admin only)
router.put('/:id', authorize('user', 'admin'), async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is owner or admin
        if (answer.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        answer.description = req.body.description;
        await answer.save();
        
        res.json(answer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Accept answer (question owner or admin only)
router.patch('/:id/accept', authorize('user', 'admin'), async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Check if user is question owner or admin
        if (answer.user_id.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        answer.is_accepted = !answer.is_accepted;
        await answer.save();
        
        res.json(answer);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
