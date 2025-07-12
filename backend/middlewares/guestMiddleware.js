const jwt = require('jsonwebtoken');

const guestMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            // No token, treat as guest
            req.user = { role: 'guest' };
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // Invalid token, treat as guest
        req.user = { role: 'guest' };
        next();
    }
};

module.exports = guestMiddleware;
