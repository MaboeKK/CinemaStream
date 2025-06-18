const express = require('express');
const router = express.Router();
const { generateCsrfToken } = require('../middleware/csrfProtection');

router.get('/csrf-token', generateCsrfToken, (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken.split('|')[0] });
});

module.exports = router;