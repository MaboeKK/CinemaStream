const asyncHandler = require('../utils/asyncHandler');
const adminAuditService = require('../services/adminAudit.service');
const { sendSuccess } = require('../utils/response');

const listAuditLog = asyncHandler(async (req, res) => {
  const { page, pageSize, actorId, action } = req.query;
  const result = await adminAuditService.listAuditLog({
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    actorId: actorId ? Number(actorId) : undefined,
    action,
  });
  sendSuccess(res, { data: result });
});

module.exports = { listAuditLog };
