const contentOverridesRepository = require('../repositories/contentOverrides.repository');
const { recordAudit } = require('./adminAudit.service');

const listOverrides = (status) => contentOverridesRepository.list(status);

const upsertOverride = async ({ actor, tmdbId, mediaType, title, status }) => {
  const override = await contentOverridesRepository.upsert({ tmdbId, mediaType, title, status, createdBy: actor.user_id });
  await recordAudit({
    actor,
    action: status === 'blocked' ? 'content_block' : 'content_feature',
    metadata: { tmdbId, mediaType, title },
  });
  return { ok: true, override };
};

const removeOverride = async ({ actor, id }) => {
  const override = await contentOverridesRepository.remove(id);
  if (!override) {
    return { ok: false, code: 'NOT_FOUND', message: 'Content override not found' };
  }
  await recordAudit({
    actor,
    action: 'content_override_removed',
    metadata: { tmdbId: override.tmdb_id, mediaType: override.media_type, title: override.title },
  });
  return { ok: true };
};

module.exports = { listOverrides, upsertOverride, removeOverride };
