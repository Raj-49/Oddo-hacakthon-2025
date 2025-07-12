const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

const { authenticateUser } = require('../middlewares/authMiddleware');

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password_hash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.userId);
        
        if (username) user.username = username;
        if (email) user.email = email;
        
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's questions
router.get('/questions', authenticateUser, async (req, res) => {
    try {
        const questions = await Question.find({ user_id: req.user.userId })
            .sort({ created_at: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's answers
router.get('/answers', authenticateUser, async (req, res) => {
    try {
        const answers = await Answer.find({ user_id: req.user.userId })
            .populate('question_id', 'title')
            .sort({ created_at: -1 });
        res.json(answers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
