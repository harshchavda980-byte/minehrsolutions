const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

/**
 * Global Tracking Middleware
 * Logs all state-changing operations (POST, PUT, DELETE, PATCH) 
 * and sensitive read operations if needed.
 */
module.exports = async (req, res, next) => {
    try {
        const originalSend = res.send;
        const start = Date.now();

        res.send = function (data) {
            try {
                // Only log successful modifications or specific modules
                const isModification = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
                const isAuth = req.path.includes('/api/auth');
                
                if (isModification || isAuth) {
                    const duration = Date.now() - start;
                    
                    // Decrypt token if req.user is not yet populated
                    let userId = req.user ? req.user.id : null;
                    if (!userId && req.cookies && req.cookies.token) {
                        try {
                            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET || 'secret');
                            userId = decoded.id;
                        } catch (err) {}
                    }
                    
                    // Background log creation to avoid blocking the response
                    ActivityLog.create({
                        user_id: userId,
                        action: `${req.method} ${req.path}`,
                        module: req.path.split('/')[2] || 'system',
                        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        details: {
                            query: req.query,
                            status: res.statusCode,
                            duration: `${duration}ms`
                        }
                    }).catch(err => console.error('[TRACKING ERROR]:', err.message));
                }
            } catch (err) {
                console.error('[TRACKING INTERCEPT ERROR]:', err.message);
            }

            return originalSend.apply(res, arguments);
        };
    } catch (err) {
        console.error('[TRACKING MIDDLEWARE ERROR]:', err.message);
    }

    next();
};
