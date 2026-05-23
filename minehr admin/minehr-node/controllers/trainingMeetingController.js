const TrainingMeeting = require('../models/TrainingMeeting');
const TrainingMeetingCompany = require('../models/TrainingMeetingCompany');
const Company = require('../models/Company');
const TrainingBatch = require('../models/TrainingBatch');
const { Op } = require('sequelize');

// GET All Meetings
exports.getAll = async (req, res) => {
    try {
        const { type, search } = req.query; // today, upcoming, previous
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        let where = {};
        if (type === 'today') {
            where.meeting_date = todayStr;
        } else if (type === 'upcoming') {
            where.meeting_date = { [Op.gt]: todayStr };
        } else if (type === 'previous') {
            where.meeting_date = { [Op.lt]: todayStr };
        }

        if (search) {
            where.slot_name = { [Op.like]: `%${search}%` };
        }

        const meetings = await TrainingMeeting.findAll({
            where,
            include: [
                { model: Company, as: 'companies', through: { attributes: [] } },
                { model: Company, as: 'reference_company' }
            ],
            order: [['meeting_date', 'ASC'], ['start_time', 'ASC']]
        });

        res.json({ success: true, data: meetings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE Meeting
exports.create = async (req, res) => {
    try {
        const { 
            slot_name, batch_id, trainer_name, city, 
            meeting_day, meeting_date, start_time, end_time, 
            batch_start_date, reference_company_id, holidays, 
            company_ids 
        } = req.body;

        const meeting = await TrainingMeeting.create({
            slot_name, batch_id, trainer_name, city,
            meeting_day, meeting_date, start_time, end_time,
            batch_start_date, reference_company_id, holidays,
            status: 'Pending'
        });

        if (company_ids && Array.isArray(company_ids)) {
            const associations = company_ids.map(cid => ({
                meeting_id: meeting.id,
                company_id: cid
            }));
            await TrainingMeetingCompany.bulkCreate(associations);
        }

        res.json({ success: true, data: meeting });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE Meeting
exports.update = async (req, res) => {
    try {
        const meeting = await TrainingMeeting.findByPk(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

        await meeting.update(req.body);

        if (req.body.company_ids && Array.isArray(req.body.company_ids)) {
            await TrainingMeetingCompany.destroy({ where: { meeting_id: meeting.id } });
            const associations = req.body.company_ids.map(cid => ({
                meeting_id: meeting.id,
                company_id: cid
            }));
            await TrainingMeetingCompany.bulkCreate(associations);
        }

        res.json({ success: true, data: meeting });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE Meeting
exports.delete = async (req, res) => {
    try {
        const meeting = await TrainingMeeting.findByPk(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

        await TrainingMeetingCompany.destroy({ where: { meeting_id: meeting.id } });
        await meeting.destroy();

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// START Meeting
exports.startMeeting = async (req, res) => {
    try {
        const meeting = await TrainingMeeting.findByPk(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

        await meeting.update({ status: 'In Progress' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
