const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Tag = require('../models/Tag');
const QuestionTag = require('../models/QuestionTag');
const authorize = require('../middlewares/authorize');
const answersRouter = require('./answers');

// Mount the answers router for the /questions/:questionId/answers route
router.use('/:questionId/answers', answersRouter);

// Get all questions with tags (public)
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find({ status: 'active' })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 })
            .lean();

        // Get tags for each question
        const questionsWithTags = await Promise.all(questions.map(async (question) => {
            const questionTags = await QuestionTag.find({ question_id: question._id })
                .populate('tag_id', 'name')
                .lean();
            
            return {
                ...question,
                tags: questionTags.map(qt => ({
                    id: qt.tag_id._id,
                    name: qt.tag_id.name
                }))
            };
        }));

        res.json(questionsWithTags);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// Get single question with tags (public)
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findOne({ 
            _id: req.params.id,
            status: { $ne: 'deleted' }
        })
        .populate('user_id', 'username')
        .lean();
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Get tags for the question
        const questionTags = await QuestionTag.find({ question_id: question._id })
            .populate('tag_id', 'name')
            .lean();

        const questionWithTags = {
            ...question,
            tags: questionTags.map(qt => ({
                id: qt.tag_id._id,
                name: qt.tag_id.name
            }))
        };

        res.json(questionWithTags);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Create question with tags (authenticated users only)
router.post('/', authorize('user', 'admin'), async (req, res) => {
    try {
        console.log('User object:', req.user); // Debug log
        const { title, body, tags } = req.body;
        // Create question
        const question = new Question({
            title,
            body,
            user_id: req.user.userId,
            status: 'active'
        });
        await question.save();

        // Handle tags
        const savedTags = [];
        if (tags && Array.isArray(tags)) {
            for (const tagName of tags) {
                // Normalize tag name
                const normalizedTag = tagName.toLowerCase().trim();
                try {
                    // Find or create tag
                    let tag = await Tag.findOne({ name: normalizedTag });
                    if (!tag) {
                        tag = new Tag({ name: normalizedTag });
                        await tag.save();
                    }
                    // Create question-tag relationship
                    const questionTag = new QuestionTag({
                        question_id: question._id,
                        tag_id: tag._id
                    });
                    await questionTag.save();
                    savedTags.push({
                        id: tag._id,
                        name: tag.name
                    });
                } catch (tagError) {
                    console.error('Error processing tag:', tagError);
                    // Continue with other tags if one fails
                }
            }
        }

        // Get the populated question
        const populatedQuestion = await Question.findById(question._id)
            .populate('user_id', 'username')
            .lean();

        res.status(201).json({
            ...populatedQuestion,
            tags: savedTags
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
