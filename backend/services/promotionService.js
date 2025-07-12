const cron = require('node-cron');
const User = require('../models/User');
const Answer = require('../models/Answer');

const startPromotionCronJob = () => {
    // Run every day at midnight
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running promotion check...');
            
            // Example promotion logic:
            // Promote users with more than 10 accepted answers to admin
            const usersToPromote = await User.find({ role: 'user' });
            
            for (const user of usersToPromote) {
                const acceptedAnswers = await Answer.countDocuments({
                    user_id: user._id,
                    is_accepted: true
                });
                
                if (acceptedAnswers >= 10) {
                    await User.findByIdAndUpdate(user._id, { role: 'admin' });
                    console.log(`Promoted user ${user._id} to admin`);
                }
            }
        } catch (error) {
            console.error('Error in promotion cron job:', error);
        }
    });
};

module.exports = {
    startPromotionCronJob
};
