const adminAuditRepository = require('../repositories/adminAudit.repository');

// Called from every mutating admin service function so no action can ship
// without leaving a trail -- built once here, imported everywhere else.
const recordAudit = ({ actor, action, target, metadata }) =>
  adminAuditRepository.record({
    actorUserId: actor.user_id,
    actorEmail: actor.email,
    action,
    targetUserId: target?.user_id,
    targetEmail: target?.email,
    metadata,
  });

const listAuditLog = (query) => adminAuditRepository.list(query);

module.exports = { recordAudit, listAuditLog };
