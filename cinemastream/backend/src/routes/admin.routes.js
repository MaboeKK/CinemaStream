const express = require('express');
const router = express.Router();

const adminUsersController = require('../controllers/adminUsers.controller');
const adminStatsController = require('../controllers/adminStats.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.use(verifyToken, checkRole('admin'));

router.get('/users', adminUsersController.listUsers);
router.get('/stats/top-shows', adminStatsController.topShows);
router.get('/stats/monthly-growth', adminStatsController.monthlyGrowth);
router.get('/stats/heatmap', adminStatsController.heatmap);

module.exports = router;
