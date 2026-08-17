const asyncHandler = require('../utils/asyncHandler');
const adminContentService = require('../services/adminContent.service');
const { sendSuccess, sendError } = require('../utils/response');

const actorFrom = (req) => ({ user_id: req.user.id, email: req.user.email });

const listOverrides = asyncHandler(async (req, res) => {
  const overrides = await adminContentService.listOverrides(req.query.status);
  sendSuccess(res, { data: overrides });
});

const upsertOverride = asyncHandler(async (req, res) => {
  const result = await adminContentService.upsertOverride({
    actor: actorFrom(req),
    tmdbId: req.body.tmdbId,
    mediaType: req.body.mediaType,
    title: req.body.title,
    status: req.body.status,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { status: 201, data: result.override, message: 'Content override saved.' });
});

const removeOverride = asyncHandler(async (req, res) => {
  const result = await adminContentService.removeOverride({
    actor: actorFrom(req),
    id: req.params.id,
  });
  if (!result.ok) return sendError(res, result);
  sendSuccess(res, { message: 'Content override removed.' });
});

module.exports = { listOverrides, upsertOverride, removeOverride };
