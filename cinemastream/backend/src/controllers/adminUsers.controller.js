const asyncHandler = require('../utils/asyncHandler');
const adminUsersService = require('../services/adminUsers.service');

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminUsersService.listUsers();
  res.json(users);
});

module.exports = { listUsers };
