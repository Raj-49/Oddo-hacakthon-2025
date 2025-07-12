const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user and select fields we want to include
        const user = await User.findById(decoded.userId)
            .select('-password_hash')
            .lean();

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.is_banned) {
            return res.status(403).json({ message: 'User is banned' });
        }

        // Set complete user object and also maintain decoded token data
        req.user = {
            ...user,
            _id: user._id, // Ensure _id is available
            userId: user._id, // Keep userId for backward compatibility
            role: user.role,
            iat: decoded.iat,
            exp: decoded.exp
        };

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { authenticateUser, adminMiddleware };
