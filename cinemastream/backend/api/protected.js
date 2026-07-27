const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const csrfProtection = require('../middleware/csrfProtection');

router.get('/protected-data', verifyToken, csrfProtection, (req, res) => {
  res.json({
    status: 'SUCCESS',
    message: 'You have accessed protected data!',
    userId: req.user.id
  });
});

module.exports = router;
