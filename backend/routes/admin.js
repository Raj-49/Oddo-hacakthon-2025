const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// Get all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password_hash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Ban/unban user (admin only)
router.patch('/users/:id/ban', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.is_banned = !user.is_banned;
        await user.save();

        res.json({ message: `User ${user.is_banned ? 'banned' : 'unbanned'} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete question (admin only)
router.delete('/questions/:id', async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get system statistics (admin only)
router.get('/stats', async (req, res) => {
    try {
        const stats = {
            users: await User.countDocuments(),
            questions: await Question.countDocuments(),
            answers: await Answer.countDocuments(),
            bannedUsers: await User.countDocuments({ is_banned: true })
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
