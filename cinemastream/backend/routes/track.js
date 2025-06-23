const express = require('express');
const router = express.Router();
const { trackView } = require('../controllers/track');

router.post('/view', trackView);

module.exports = router;
