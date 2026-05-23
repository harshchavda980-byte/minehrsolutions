const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, bannerController.getBanners);

router.post('/upload', authMiddleware, upload.single('banner'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/banners/${req.file.filename}`;
    res.json({ success: true, url });
});
router.get('/seed', authMiddleware, bannerController.seedBanners);
router.get('/:id', authMiddleware, bannerController.getBanner);
router.post('/', authMiddleware, bannerController.createBanner);
router.put('/:id', authMiddleware, bannerController.updateBanner);
router.delete('/:id', authMiddleware, bannerController.deleteBanner);

module.exports = router;
