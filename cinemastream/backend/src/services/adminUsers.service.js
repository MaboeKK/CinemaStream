const userRepository = require('../repositories/user.repository');
const watchedHistoryRepository = require('../repositories/watchedHistory.repository');
const loginHistoryRepository = require('../repositories/loginHistory.repository');
const authService = require('./auth.service');
const { recordAudit } = require('./adminAudit.service');

const listUsersPaged = (query) => userRepository.listPaged(query);

const getUserDetail = async (userId) => {
  const user = await userRepository.getById(userId);
  if (!user) return null;
  const [watchHistory, loginHistory] = await Promise.all([
    watchedHistoryRepository.getRecentByUser(userId, 10),
    loginHistoryRepository.getRecentByUser(userId, 10),
  ]);
  return { ...user, watchHistory, loginHistory };
};

// Every mutation below follows the same shape: { ok:false, code, message }
// for an expected business outcome, or { ok:true, ...data } on success,
// with an audit-log write on every success path -- matching auth.service's
// existing convention.

const assertNotSelf = (actor, targetUserId, message) => {
  if (actor.user_id === Number(targetUserId)) {
    return { ok: false, code: 'FORBIDDEN', message };
  }
  return null;
};

const changeRole = async ({ actor, targetUserId, role }) => {
  const selfCheck = assertNotSelf(actor, targetUserId, "You can't change your own role.");
  if (selfCheck) return selfCheck;

  const target = await userRepository.getById(targetUserId);
  if (!target) return { ok: false, code: 'NOT_FOUND', message: 'User not found' };

  if (target.role === 'super_admin' && role !== 'super_admin') {
    const superAdminCount = await userRepository.countByRole('super_admin');
    if (superAdminCount <= 1) {
      return {
        ok: false,
        code: 'CONFLICT',
        message: "Can't demote the last super_admin -- promote another account first.",
      };
    }
  }

  const updated = await userRepository.updateRole(targetUserId, role);
  await recordAudit({
    actor,
    action: 'role_change',
    target,
    metadata: { fromRole: target.role, toRole: role },
  });
  return { ok: true, user: updated };
};

const changeStatus = async ({ actor, targetUserId, status, reason }) => {
  const selfCheck = assertNotSelf(actor, targetUserId, "You can't change your own account status.");
  if (selfCheck) return selfCheck;

  const target = await userRepository.getById(targetUserId);
  if (!target) return { ok: false, code: 'NOT_FOUND', message: 'User not found' };

  const updated = await userRepository.updateStatus(targetUserId, status, reason);
  // Suspending/banning also forces existing sessions out immediately --
  // otherwise a still-valid access token (up to 15m) or refresh token
  // would keep working until it naturally expired.
  if (status !== 'active') {
    await userRepository.bumpTokenVersion(targetUserId);
  }
  await recordAudit({
    actor,
    action: 'status_change',
    target,
    metadata: { fromStatus: target.status, toStatus: status, reason: reason || null },
  });
  return { ok: true, user: updated };
};

const forceLogout = async ({ actor, targetUserId }) => {
  const selfCheck = assertNotSelf(actor, targetUserId, "You can't force-logout your own session this way -- use Logout.");
  if (selfCheck) return selfCheck;

  const target = await userRepository.getById(targetUserId);
  if (!target) return { ok: false, code: 'NOT_FOUND', message: 'User not found' };

  await userRepository.bumpTokenVersion(targetUserId);
  await recordAudit({ actor, action: 'force_logout', target, metadata: null });
  return { ok: true };
};

const verifyEmail = async ({ actor, targetUserId }) => {
  const target = await userRepository.getById(targetUserId);
  if (!target) return { ok: false, code: 'NOT_FOUND', message: 'User not found' };
  if (target.is_verified) return { ok: false, code: 'CONFLICT', message: 'User is already verified' };

  await userRepository.markAsVerified(targetUserId);
  await recordAudit({ actor, action: 'verify_email', target, metadata: null });
  return { ok: true };
};

const triggerPasswordReset = async ({ actor, targetUserId }) => {
  const target = await userRepository.getById(targetUserId);
  if (!target) return { ok: false, code: 'NOT_FOUND', message: 'User not found' };

  const result = await authService.forgotPassword({ email: target.email });
  if (!result.ok) return result;

  await recordAudit({ actor, action: 'trigger_password_reset', target, metadata: null });
  return { ok: true };
};

module.exports = {
  listUsersPaged,
  getUserDetail,
  changeRole,
  changeStatus,
  forceLogout,
  verifyEmail,
  triggerPasswordReset,
};
