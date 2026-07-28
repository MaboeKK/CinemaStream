const express = require('express');
const router = express.Router();

const watchController = require('../controllers/watch.controller');
const verifyToken = require('../middleware/auth.middleware');
const { csrfProtection } = require('../middleware/csrf.middleware');
const { validate, schemas } = require('../utils/validation');

router.post('/', verifyToken, csrfProtection, validate(schemas.watch), watchController.recordWatch);
router.get('/history', verifyToken, watchController.getHistory);

module.exports = router;
