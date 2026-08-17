const asyncHandler = require('../utils/asyncHandler');
const adminUsersService = require('../services/adminUsers.service');
const { sendSuccess, sendError } = require('../utils/response');

const actorFrom = (req) => ({ user_id: req.user.id, email: req.user.email });

const listUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page, pageSize, sortBy, sortDir } = req.query;
  const result = await adminUsersService.listUsersPaged({
    search,
    role,
    status,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    sortBy,
    sortDir,
  });
  sendSuccess(res, { data: result });
});

const getUserDetail = asyncHandler(async (req, res) => {
  const detail = await adminUsersService.getUserDetail(req.params.id);
  if (!detail) {
    return sendError(res, { code: 'NOT_FOUND', message: 'User not found' });
  }
  sendSuccess(res, { data: detail });
});

const changeRole = asyncHandler(async (req, res) => {
  const result = await adminUsersService.changeRole({
    actor: actorFrom(req),
    targetUserId: req.params.id,
    role: req.body.role,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { data: result.user, message: 'Role updated.' });
});

const changeStatus = asyncHandler(async (req, res) => {
  const result = await adminUsersService.changeStatus({
    actor: actorFrom(req),
    targetUserId: req.params.id,
    status: req.body.status,
    reason: req.body.reason,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { data: result.user, message: 'Status updated.' });
});

const forceLogout = asyncHandler(async (req, res) => {
  const result = await adminUsersService.forceLogout({
    actor: actorFrom(req),
    targetUserId: req.params.id,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { message: 'User signed out of all sessions.' });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const result = await adminUsersService.verifyEmail({
    actor: actorFrom(req),
    targetUserId: req.params.id,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { message: 'Email marked as verified.' });
});

const triggerPasswordReset = asyncHandler(async (req, res) => {
  const result = await adminUsersService.triggerPasswordReset({
    actor: actorFrom(req),
    targetUserId: req.params.id,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { message: 'Password reset email sent.' });
});

module.exports = {
  listUsers,
  getUserDetail,
  changeRole,
  changeStatus,
  forceLogout,
  verifyEmail,
  triggerPasswordReset,
};
