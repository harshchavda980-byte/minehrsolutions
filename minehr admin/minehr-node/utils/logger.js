const ActivityLog = require('../models/ActivityLog');

/**
 * Log a system activity
 * @param {Object} req - Express request object
 * @param {Object} data - Log data
 * @param {number} [data.company_id] - ID of the company
 * @param {string} data.action - Action performed (e.g., 'Login', 'Update Company')
 * @param {string} data.module - Module name (e.g., 'Auth', 'Plans')
 * @param {Object} [data.details] - JSON detail of the action
 */
const logActivity = async (req, { company_id, action, module, details }) => {
    try {
        const userId = req.user ? req.user.id : null;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        await ActivityLog.create({
            user_id: userId,
            company_id: company_id || (req.body ? req.body.company_id : null),
            action,
            module,
            details,
            ip_address: ip
        });
    } catch (err) {
        console.error('Logging Error:', err);
    }
};

module.exports = { logActivity };
