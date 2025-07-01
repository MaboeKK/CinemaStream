// const express = require('express');
// const router = express.Router();
// const { getStats } = require('../controllers/stats');

// router.get('/', getStats);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getStats,
  getTopPerformingShows,
  getMonthlyUserGrowth,
  getHeatmapData
} = require("../controllers/stats");

// All these routes are prefixed with /api/stats
router.get("/summary", getStats);
router.get("/top-shows", getTopPerformingShows);
router.get("/monthly-growth", getMonthlyUserGrowth);
router.get("/heatmap", getHeatmapData);

module.exports = router;
