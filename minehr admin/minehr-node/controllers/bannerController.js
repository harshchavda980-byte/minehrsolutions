const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll({ order: [['order', 'ASC']] });
        res.json(banners);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBanner = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        res.json(banner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        await banner.update(req.body);
        res.json(banner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        await banner.destroy();
        res.json({ message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.seedBanners = async (req, res) => {
    try {
        const count = await Banner.count();
        if (count === 0) {
            await Banner.bulkCreate([
                { title: 'Premium HR Solutions', image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', order: 1 },
                { title: 'Global Talent Management', image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', order: 2 },
                { title: 'Enterprise Analytics', image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', order: 3 }
            ]);
            return res.json({ message: 'Banners seeded successfully' });
        }
        res.json({ message: 'Banners already exist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
