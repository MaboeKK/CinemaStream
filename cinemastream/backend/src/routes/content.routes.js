const express = require('express');
const router = express.Router();

const adminContentController = require('../controllers/adminContent.controller');
const verifyToken = require('../middleware/auth.middleware');

// Read-only, any authenticated user (not admin-gated) -- the homepage needs
// this to know which titles to hide/feature for every visitor, not just
// admins. Reuses adminContentController.listOverrides since it has no
// role-specific logic itself (the admin-only mutations live under
// /api/admin/content instead).
router.get('/overrides', verifyToken, adminContentController.listOverrides);

module.exports = router;
