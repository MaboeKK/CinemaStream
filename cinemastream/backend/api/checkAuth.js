const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
//const csrfProtection = require('../middleware/csrfProtection');
const { getBasicUserInfoById } = require('../models/User');

router.get('/check-auth', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getBasicUserInfoById(userId);

    res.json({ status: 'SUCCESS', user });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ status: 'FAILED', message: 'Could not verify authentication' });
  }
});

module.exports = router;
