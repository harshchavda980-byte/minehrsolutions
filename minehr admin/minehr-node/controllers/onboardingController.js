const OnboardingRecord = require('../models/OnboardingRecord');
const Company = require('../models/Company');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function encodeToken(companyId) {
    return Buffer.from(`MHR_OB_${companyId}_${Date.now()}`).toString('base64')
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function ensureRecord(companyId) {
    const [rec] = await OnboardingRecord.findOrCreate({
        where: { company_id: companyId },
        defaults: { company_id: companyId }
    });
    return rec;
}

// ─── GET All (with filters + company join) ────────────────────────────────────
exports.getAll = async (req, res) => {
    try {
        const { country, state, city, product, training_type, account_type, plan, page = 1, limit = 10, search } = req.query;
        const where = { status: 'verified' };
        if (country) where.country = country;
        if (state) where.state = state;
        if (city) where.city = city;
        if (training_type && training_type !== 'All') where.training_type = training_type;
        if (account_type && account_type !== 'All') where.account_type = account_type;
        if (plan && plan !== 'All') where.plan = plan;
        if (search) where.name = { [Op.like]: `%${search}%` };

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Company.findAndCountAll({
            where,
            include: [{ model: OnboardingRecord, as: 'onboarding', required: false }],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.json({ success: true, total: count, page: parseInt(page), limit: parseInt(limit), data: rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── GET One ──────────────────────────────────────────────────────────────────
exports.getOne = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id, {
            include: [{ model: OnboardingRecord, as: 'onboarding', required: false }]
        });
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
        res.json({ success: true, data: company });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Send Welcome Email ───────────────────────────────────────────────────────
exports.sendWelcomeEmail = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        const { receiver, cc, with_invoice, amount, payment_method } = req.body;
        const attachment = req.file; // From multer
        const adminName = req.user?.name || 'Admin';

        // Parse CC if it's a string
        let processedCC = cc;
        if (typeof cc === 'string') {
            processedCC = cc.split(',').map(s => s.trim()).filter(s => s !== '');
        }

        // Configure transporter (Gmail / SMTP from env or fallback to log)
        let emailSent = false;
        if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: parseInt(process.env.MAIL_PORT || '587'),
                secure: false,
                auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
            });

            const mailOptions = {
                from: `"MineHR Solutions" <${process.env.MAIL_USER}>`,
                replyTo: 'hr@minehrsolutions.com',
                to: receiver,
                cc: Array.isArray(processedCC) ? processedCC.join(', ') : processedCC,
                subject: `Welcome to MineHR – ${company.name}`,
                html: `
                    <div style="font-family: 'Poppins', sans-serif; color: #333; line-height: 1.6;">
                        <h2 style="color: #6366f1;">Welcome to MineHR, ${company.name}!</h2>
                        <p>We are delighted to have you on board. Our team is committed to providing you with the best HR management experience.</p>
                        <p>Your implementation team will reach out to you shortly to begin the setup process.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                            <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${with_invoice === 'true' || with_invoice === true ? 'With Invoice' : 'Without Invoice'}</p>
                            <p style="margin: 5px 0;"><strong>Received Amount:</strong> ₹${amount || '0.00'}</p>
                            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${payment_method || 'Online'}</p>
                        </div>
                        <br/>
                        <p>Best Regards,<br/><strong>MineHR Solutions Team</strong><br/>hr@minehrsolutions.com</p>
                    </div>
                `
            };

            if (attachment) {
                mailOptions.attachments = [{
                    filename: attachment.originalname,
                    path: attachment.path
                }];
            }

            await transporter.sendMail(mailOptions);
            emailSent = true;
        } else {
            console.log(`[WELCOME EMAIL LOG] To: ${receiver} | CC: ${processedCC} | Attachment: ${attachment ? attachment.originalname : 'None'}`);
            emailSent = true;
        }

        if (emailSent) {
            const rec = await ensureRecord(company.id);
            await rec.update({
                welcome_email_sent_at: new Date(),
                welcome_email_sent_by: adminName,
                welcome_email_receiver: receiver,
                welcome_email_cc: processedCC,
                welcome_email_with_invoice: with_invoice === 'true' || with_invoice === true,
                welcome_email_amount: amount || 0,
                welcome_email_payment_method: payment_method,
                welcome_email_attachment: attachment ? attachment.filename : null
            });
        }
        res.json({ success: true, sent_at: new Date() });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// ─── Mark WhatsApp Group ──────────────────────────────────────────────────────
exports.markWhatsApp = async (req, res) => {
    try {
        const adminName = req.user?.name || 'Admin';
        const rec = await ensureRecord(req.params.id);
        await rec.update({ whatsapp_created_at: new Date(), whatsapp_created_by: adminName });
        res.json({ success: true, created_at: rec.whatsapp_created_at });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Update Responding Status ─────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const rec = await ensureRecord(req.params.id);
        await rec.update({ responding_status: status });
        res.json({ success: true, data: rec });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Generate Feedback URL ────────────────────────────────────────────────────
exports.generateFeedbackUrl = async (req, res) => {
    try {
        const rec = await ensureRecord(req.params.id);
        const token = encodeToken(req.params.id);
        await rec.update({ feedback_url_token: token, feedback_url_generated_at: new Date() });
        const domain = process.env.APP_DOMAIN || 'app.minehrsolutions.com';
        const url = `https://${domain}/trainingFeedback.php?c=${token}`;
        res.json({ success: true, url });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Update Schedule Setup ────────────────────────────────────────────────────
exports.updateSchedule = async (req, res) => {
    try {
        const rec = await ensureRecord(req.params.id);
        await rec.update({
            setup_status: req.body.setup_status || 'In Progress',
            setup_date: req.body.setup_date,
            setup_training_type: req.body.training_type,
            setup_trainer: req.body.trainer,
            setup_meeting_link: req.body.meeting_link,
            setup_notes: req.body.notes
        });
        res.json({ success: true, data: rec });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Update Training Status ───────────────────────────────────────────────────
exports.updateTraining = async (req, res) => {
    try {
        const rec = await ensureRecord(req.params.id);
        const updates = {};
        ['hr', 'it', 'payroll', 'admin'].forEach(mod => {
            if (req.body[`${mod}_training_status`] !== undefined)
                updates[`${mod}_training_status`] = req.body[`${mod}_training_status`];
            if (req.body[`${mod}_trainer`]) updates[`${mod}_trainer`] = req.body[`${mod}_trainer`];
        });
        if (req.body.product_training_type) updates.product_training_type = req.body.product_training_type;
        if (req.body.product_training_modules) updates.product_training_modules = req.body.product_training_modules;
        if (req.body.product_training_date) updates.product_training_date = req.body.product_training_date;
        if (req.body.product_training_trainer) updates.product_training_trainer = req.body.product_training_trainer;
        if (req.body.product_training_duration) updates.product_training_duration = req.body.product_training_duration;
        if (req.body.product_training_notes) updates.product_training_notes = req.body.product_training_notes;
        await rec.update(updates);
        res.json({ success: true, data: rec });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Update Batch Schedule ────────────────────────────────────────────────────
exports.updateBatch = async (req, res) => {
    try {
        const rec = await ensureRecord(req.params.id);
        await rec.update({ batch_type: req.body.batch_type, batch_schedule: req.body.batch_schedule });
        res.json({ success: true, data: rec });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Get Timeline ─────────────────────────────────────────────────────────────
exports.getTimeline = async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ success: false, message: 'Not found' });
        const rec = await OnboardingRecord.findOne({ where: { company_id: req.params.id } });

        const events = [];
        events.push({ label: 'Company Created', date: company.created_at, status: 'done', icon: 'building' });
        if (rec?.welcome_email_sent_at) events.push({ label: 'Welcome Email Sent', date: rec.welcome_email_sent_at, by: rec.welcome_email_sent_by, status: 'done', icon: 'mail' });
        else events.push({ label: 'Welcome Email', date: null, status: 'pending', icon: 'mail' });
        if (rec?.whatsapp_created_at) events.push({ label: 'WhatsApp Group Created', date: rec.whatsapp_created_at, by: rec.whatsapp_created_by, status: 'done', icon: 'whatsapp' });
        else events.push({ label: 'WhatsApp Group', date: null, status: 'pending', icon: 'whatsapp' });
        if (rec?.setup_date) events.push({ label: 'Setup Scheduled', date: rec.setup_date, trainer: rec.setup_trainer, type: rec.setup_training_type, status: rec.setup_status === 'Done' ? 'done' : 'progress', icon: 'calendar' });
        else events.push({ label: 'Setup Schedule', date: null, status: 'pending', icon: 'calendar' });

        const modules = [
            { key: 'hr', label: 'HR Training' },
            { key: 'it', label: 'IT Training' },
            { key: 'payroll', label: 'Payroll Training' },
            { key: 'admin', label: 'Admin Training' }
        ];
        modules.forEach(m => {
            const val = rec?.[`${m.key}_training_status`] || 0;
            events.push({ label: m.label, value: val, maxValue: 5, status: val >= 5 ? 'done' : val > 0 ? 'progress' : 'pending', icon: 'training' });
        });
        if (rec?.feedback_url_token) events.push({ label: 'Feedback URL Generated', date: rec.feedback_url_generated_at, status: 'done', icon: 'link' });
        else events.push({ label: 'Training Feedback', date: null, status: 'pending', icon: 'link' });

        res.json({ success: true, company: { id: company.id, name: company.name, code: company.company_code, city: company.city }, events });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Get Setup Status Data ─────────────────────────────────────────────────────
exports.getSetupStatus = async (req, res) => {
    try {
        const rec = await OnboardingRecord.findOne({ where: { company_id: req.params.id } });
        res.json({
            success: true,
            data: rec?.setup_status_data || {},
            executive: rec?.setup_status_executive || ''
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Save Setup Status Data ────────────────────────────────────────────────────
exports.saveSetupStatus = async (req, res) => {
    try {
        const { executive, statusData } = req.body;
        const rec = await ensureRecord(req.params.id);
        await rec.update({
            setup_status_data: statusData || {},
            setup_status_executive: executive || ''
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ─── Get Dashboard Stats ───────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const allCompanies = await Company.findAll({
            where: { status: 'verified' },
            include: [{ model: OnboardingRecord, as: 'onboarding', required: false }]
        });

        const stats = {
            overview: {
                total: allCompanies.length,
                total_year: allCompanies.filter(c => c.created_at >= startOfYear).length,
                total_month: allCompanies.filter(c => c.created_at >= startOfMonth).length,
                
                imp_done: allCompanies.filter(c => c.onboarding?.setup_status === 'Done').length,
                imp_done_year: allCompanies.filter(c => c.onboarding?.setup_status === 'Done' && c.created_at >= startOfYear).length,
                imp_done_month: allCompanies.filter(c => c.onboarding?.setup_status === 'Done' && c.created_at >= startOfMonth).length,
                
                pending_imp: allCompanies.filter(c => c.onboarding?.setup_status !== 'Done').length,
                pending_imp_year: allCompanies.filter(c => c.onboarding?.setup_status !== 'Done' && c.created_at >= startOfYear).length,
                pending_imp_month: allCompanies.filter(c => c.onboarding?.setup_status !== 'Done' && c.created_at >= startOfMonth).length,
                
                key_accounts: allCompanies.filter(c => c.account_type === 'Key Account').length,
                key_imp_done: allCompanies.filter(c => c.account_type === 'Key Account' && c.onboarding?.setup_status === 'Done').length,
                key_pending: allCompanies.filter(c => c.account_type === 'Key Account' && c.onboarding?.setup_status !== 'Done').length
            },
            trial: {
                total: allCompanies.filter(c => c.plan === 'Trial').length,
                total_year: allCompanies.filter(c => c.plan === 'Trial' && c.created_at >= startOfYear).length,
                total_month: allCompanies.filter(c => c.plan === 'Trial' && c.created_at >= startOfMonth).length,
                
                imp_done: allCompanies.filter(c => c.plan === 'Trial' && c.onboarding?.setup_status === 'Done').length,
                imp_pending: allCompanies.filter(c => c.plan === 'Trial' && c.onboarding?.setup_status !== 'Done').length,
                
                key_accounts: allCompanies.filter(c => c.plan === 'Trial' && c.account_type === 'Key Account').length,
                key_done: allCompanies.filter(c => c.plan === 'Trial' && c.account_type === 'Key Account' && c.onboarding?.setup_status === 'Done').length,
                
                expired: allCompanies.filter(c => {
                    if (c.plan !== 'Trial') return false;
                    const expiry = new Date(c.created_at);
                    expiry.setDate(expiry.getDate() + (c.trial_days || 0));
                    return expiry < now;
                }).length
            }
        };

        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
