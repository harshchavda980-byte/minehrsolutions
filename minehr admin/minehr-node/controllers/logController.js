const WhatsAppLog = require('../models/WhatsAppLog');
const ExecutionHistory = require('../models/ExecutionHistory');
const Company = require('../models/Company');

exports.getWhatsAppLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await WhatsAppLog.findAndCountAll({
            include: [{ model: Company, as: 'company', attributes: ['name'] }],
            order: [['sent_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            logs: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getExecutionHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await ExecutionHistory.findAndCountAll({
            order: [['started_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            history: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
