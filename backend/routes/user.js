const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { authenticateUser } = require('../middlewares/authMiddleware');

// IMPORTANT: To make this route available at /api/auth/profile, ensure in your main app.js/server.js you have:
// app.use('/api/auth', require('./routes/user'));
// This will make /profile accessible at /api/auth/profile for the frontend.

// Get user profile with questions and answers
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        console.log('User ID from token:', req.user._id);
        
        // Get user data
        const user = await User.findById(req.user._id)
            .select('-password_hash')
            .lean();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's questions with their answers count
        const questions = await Question.find({ 
            user_id: req.user._id,
            status: { $ne: 'deleted' }
        })
        .select('title body createdAt status')
        .lean();

        // Get questions counts for stats
        const questionCount = questions.length;

        // Get user's answers with their associated questions
        const answers = await Answer.find({ 
            user_id: req.user._id,
            status: { $ne: 'deleted' }
        })
        .populate('question_id', 'title')
        .select('body createdAt status question_id')
        .lean();

        // Get answers count for stats
        const answerCount = answers.length;

        // For each question, get its answers count
        const questionsWithCounts = await Promise.all(questions.map(async (question) => {
            const answersCount = await Answer.countDocuments({
                question_id: question._id,
                status: 'active'
            });
            return {
                ...question,
                answersCount
            };
        }));

        const userResponse = {
            ...user,
            stats: {
                questionCount,
                answerCount
            },
            activity: {
                questions: questionsWithCounts.map(q => ({
                    _id: q._id,
                    title: q.title,
                    body: q.body,
                    createdAt: q.createdAt,
                    status: q.status,
                    answersCount: q.answersCount
                })),
                answers: answers.map(a => ({
                    _id: a._id,
                    body: a.body,
                    createdAt: a.createdAt,
                    status: a.status,
                    question: a.question_id ? {
                        _id: a.question_id._id,
                        title: a.question_id.title
                    } : null
                }))
            }
        };

        res.json(userResponse);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Update user profile
router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Find user and ensure they exist
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If changing username or email, check for duplicates
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

        await user.save();
        
        // Return user without password
        const updatedUser = await User.findById(user._id)
            .select('-password_hash')
            .lean();
            
        res.json(updatedUser);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get user's questions
router.get('/questions', authenticateUser, async (req, res) => {
    try {
        const questions = await Question.find({ 
            user_id: req.user._id,
            status: { $ne: 'deleted' }
        })
        .sort({ createdAt: -1 });
        
        res.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get user's answers
router.get('/answers', authenticateUser, async (req, res) => {
    try {
        const answers = await Answer.find({ 
            user_id: req.user._id,
            status: { $ne: 'deleted' }
        })
        .populate('question_id', 'title')
        .sort({ createdAt: -1 });
        
        res.json(answers);
    } catch (error) {
        console.error('Get answers error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

module.exports = router;
