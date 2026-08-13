const asyncHandler = require('../utils/asyncHandler');
const adminUsersService = require('../services/adminUsers.service');
const { sendSuccess } = require('../utils/response');

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminUsersService.listUsers();
  sendSuccess(res, { data: users, message: 'Users retrieved' });
});

module.exports = { listUsers };
