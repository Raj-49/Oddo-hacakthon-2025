const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('=================================');
        console.log('✨ MongoDB Connected Successfully!');
        console.log(`📦 Database Host: ${conn.connection.host}`);
        console.log('=================================');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
