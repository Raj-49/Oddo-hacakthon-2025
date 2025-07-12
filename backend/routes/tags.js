const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const QuestionTag = require('../models/QuestionTag');

// Get all tags with counts
router.get('/', async (req, res) => {
    try {
        // Get all tags
        const tags = await Tag.find().lean();

        // Get question counts for each tag
        const tagsWithCounts = await Promise.all(tags.map(async (tag) => {
            // Find questions for this tag
            const questionTags = await QuestionTag.find({ tag_id: tag._id });
            const questionIds = questionTags.map(qt => qt.question_id);

            // Count active questions
            const questionCount = await Question.countDocuments({
                _id: { $in: questionIds },
                status: 'active'
            });

            // Count active answers for these questions
            const answerCount = await Answer.countDocuments({
                question_id: { $in: questionIds },
                status: 'active'
            });

            return {
                ...tag,
                questionCount,
                answerCount
            };
        }));

        res.json(tagsWithCounts);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get questions by tag
router.get('/:tagName/questions', async (req, res) => {
    try {
        // Find the tag
        const tag = await Tag.findOne({ 
            name: req.params.tagName.toLowerCase() 
        });

        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        // Find questions with this tag
        const questionTags = await QuestionTag.find({ tag_id: tag._id });
        const questionIds = questionTags.map(qt => qt.question_id);

        // Get the questions with their details
        const questions = await Question.find({
            _id: { $in: questionIds },
            status: 'active'
        })
        .populate('user_id', 'username')
        .lean();

        // Get answer counts for each question
        const questionsWithCounts = await Promise.all(questions.map(async (question) => {
            const answerCount = await Answer.countDocuments({
                question_id: question._id,
                status: 'active'
            });

            // Get all tags for this question
            const questionTagList = await QuestionTag.find({ 
                question_id: question._id 
            }).populate('tag_id', 'name');

            return {
                ...question,
                answerCount,
                tags: questionTagList.map(qt => ({
                    id: qt.tag_id._id,
                    name: qt.tag_id.name
                }))
            };
        }));

        res.json({
            tag: {
                id: tag._id,
                name: tag.name,
                questionCount: questionsWithCounts.length
            },
            questions: questionsWithCounts
        });
    } catch (error) {
        console.error('Error fetching questions by tag:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Search tags
router.get('/search/:query', async (req, res) => {
    try {
        const searchQuery = req.params.query.toLowerCase();
        
        // Search tags that match the query
        const tags = await Tag.find({
            name: { $regex: searchQuery, $options: 'i' }
        }).lean();

        // Get counts for each tag
        const tagsWithCounts = await Promise.all(tags.map(async (tag) => {
            const questionTags = await QuestionTag.find({ tag_id: tag._id });
            const questionIds = questionTags.map(qt => qt.question_id);

            const questionCount = await Question.countDocuments({
                _id: { $in: questionIds },
                status: 'active'
            });

            const answerCount = await Answer.countDocuments({
                question_id: { $in: questionIds },
                status: 'active'
            });

            return {
                ...tag,
                questionCount,
                answerCount
            };
        }));

        res.json(tagsWithCounts);
    } catch (error) {
        console.error('Error searching tags:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

// Get trending tags (most used in last 7 days)
router.get('/trending', async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get recent questions
        const recentQuestions = await Question.find({
            createdAt: { $gte: sevenDaysAgo },
            status: 'active'
        });

        const recentQuestionIds = recentQuestions.map(q => q._id);

        // Get tags for these questions
        const questionTags = await QuestionTag.find({
            question_id: { $in: recentQuestionIds }
        });

        // Count occurrences of each tag
        const tagCounts = {};
        questionTags.forEach(qt => {
            tagCounts[qt.tag_id] = (tagCounts[qt.tag_id] || 0) + 1;
        });

        // Get tag details and sort by usage
        const tagIds = Object.keys(tagCounts);
        const tags = await Tag.find({ _id: { $in: tagIds } }).lean();

        const trendingTags = tags.map(tag => ({
            ...tag,
            useCount: tagCounts[tag._id]
        })).sort((a, b) => b.useCount - a.useCount);

        res.json(trendingTags);
    } catch (error) {
        console.error('Error fetching trending tags:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
});

module.exports = router;
