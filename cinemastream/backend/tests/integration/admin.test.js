import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/db.js';

const adminUser = {
  first_name: 'Admin',
  last_name: 'Tester',
  email: 'admin-test@example.com',
  password: 'password123',
};

const guestUser = {
  first_name: 'Guest',
  last_name: 'Tester',
  email: 'guest-test@example.com',
  password: 'password123',
};

const getCsrfToken = async (agent) => {
  const res = await agent.get('/api/auth/csrf-token');
  return res.body.csrfToken;
};

const registerVerifyLogin = async (user, { role, skipVerify = false } = {}) => {
  const agent = request.agent(app);

  const registerCsrf = await getCsrfToken(agent);
  await agent.post('/api/auth/register').set('x-csrf-token', registerCsrf).send(user);

  if (!skipVerify) {
    const { rows } = await pool.query('SELECT verification_token FROM users WHERE email = $1', [
      user.email,
    ]);
    const otp = rows[0].verification_token;

    const verifyCsrf = await getCsrfToken(agent);
    await agent
      .post('/api/auth/verify-otp')
      .set('x-csrf-token', verifyCsrf)
      .send({ email: user.email, otp });
  }

  if (role) {
    // Roles aren't self-assignable through any route -- promote directly so
    // the subsequent login's JWT is signed with the target role.
    await pool.query('UPDATE users SET role = $1 WHERE email = $2', [role, user.email]);
  }

  if (skipVerify) {
    // An unverified user can't log in, so there's no session to return --
    // callers that need an unverified account only want it in the DB.
    return agent;
  }

  const loginCsrf = await getCsrfToken(agent);
  await agent
    .post('/api/auth/login')
    .set('x-csrf-token', loginCsrf)
    .send({ email: user.email, password: user.password });

  return agent;
};

let userCounter = 0;
const makeUser = (label) => {
  userCounter += 1;
  return {
    first_name: label,
    last_name: 'Tester',
    email: `${label.toLowerCase()}-${userCounter}@example.com`,
    password: 'password123',
  };
};

const getUserId = async (email) => {
  const { rows } = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
  return rows[0].user_id;
};

describe('Admin API', () => {
  beforeEach(async () => {
    await pool.query(
      'TRUNCATE TABLE login_history, watched_history, admin_audit_log, content_overrides, users RESTART IDENTITY CASCADE'
    );
  });

  afterAll(async () => {
    await pool.end();
  });

  test('rejects an unauthenticated request', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  test('rejects a non-admin (guest) user', async () => {
    const agent = await registerVerifyLogin(guestUser);

    const res = await agent.get('/api/admin/users');

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ status: 'FAILED', message: 'Admins only. Access denied.' });
  });

  test('lists users for an admin', async () => {
    const agent = await registerVerifyLogin(adminUser, { role: 'admin' });

    const res = await agent.get('/api/admin/users');

    expect(res.status).toBe(200);
    expect(res.body.data.rows).toHaveLength(1);
    expect(res.body.data.rows[0]).toMatchObject({ email: adminUser.email, role: 'admin' });
  });

  test('returns platform overview stats for an admin', async () => {
    const agent = await registerVerifyLogin(adminUser, { role: 'admin' });
    const csrfToken = await getCsrfToken(agent);

    // Same title watched twice by the same user -- one of the two rows
    // should count as a rewatch.
    await agent.post('/api/watch').set('x-csrf-token', csrfToken).send({ movie_id: 1, movie_title: 'Once' });
    await agent.post('/api/watch').set('x-csrf-token', csrfToken).send({ movie_id: 1, movie_title: 'Once' });

    const res = await agent.get('/api/admin/stats/overview');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalWatched: 2,
      rewatches: 1,
      activeUsers: 1,
      totalUsers: 1,
    });
  });

  test('returns top shows for an admin', async () => {
    const agent = await registerVerifyLogin(adminUser, { role: 'admin' });
    const csrfToken = await getCsrfToken(agent);

    await agent
      .post('/api/watch')
      .set('x-csrf-token', csrfToken)
      .send({ movie_id: 1, movie_title: 'Only Show' });

    const res = await agent.get('/api/admin/stats/top-shows');

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ name: 'Only Show', type: 'Movie' });
  });

  describe('PATCH /users/:id/role', () => {
    test('rejects an actor who is admin but not super_admin', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);

      const res = await adminAgent.patch(`/api/admin/users/${targetId}/role`).send({ role: 'admin' });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ status: 'FAILED', message: 'Super admins only. Access denied.' });
    });

    test('promotes a guest to admin and records an audit entry', async () => {
      const superUser = makeUser('Super');
      const superAgent = await registerVerifyLogin(superUser, { role: 'super_admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch(`/api/admin/users/${targetId}/role`)
        .set('x-csrf-token', csrfToken)
        .send({ role: 'admin' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        message: 'Role updated.',
        data: { user_id: targetId, role: 'admin' },
      });
      expect(res.body.data).not.toHaveProperty('password');

      const auditRes = await superAgent.get('/api/admin/audit-log');
      expect(auditRes.body.data.rows[0]).toMatchObject({
        action: 'role_change',
        actor_email: superUser.email,
        target_email: target.email,
        metadata: { fromRole: 'guest', toRole: 'admin' },
      });
    });

    test('rejects an unrecognized role value', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch('/api/admin/users/999999/role')
        .set('x-csrf-token', csrfToken)
        .send({ role: 'wizard' });

      expect(res.status).toBe(400);
    });

    test("rejects the actor changing their own role", async () => {
      const superUser = makeUser('Super');
      const superAgent = await registerVerifyLogin(superUser, { role: 'super_admin' });
      const superId = await getUserId(superUser.email);
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch(`/api/admin/users/${superId}/role`)
        .set('x-csrf-token', csrfToken)
        .send({ role: 'admin' });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({
        success: false,
        error: { code: 'FORBIDDEN', message: "You can't change your own role." },
      });
    });

    test('rejects a role change for an unknown user', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch('/api/admin/users/999999/role')
        .set('x-csrf-token', csrfToken)
        .send({ role: 'admin' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    });
  });

  describe('PATCH /users/:id/status', () => {
    test('suspends a user and immediately invalidates their existing session', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const target = makeUser('Target');
      const targetAgent = await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(superAgent);

      // The target's session is valid before the suspension.
      expect((await targetAgent.get('/api/auth/check-auth')).status).toBe(200);

      const res = await superAgent
        .patch(`/api/admin/users/${targetId}/status`)
        .set('x-csrf-token', csrfToken)
        .send({ status: 'suspended', reason: 'Reported for spam' });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        message: 'Status updated.',
        data: { status: 'suspended', status_reason: 'Reported for spam' },
      });

      // Its previously-valid access token cookie is now rejected -- proof
      // the status flip forces a re-check, not just a flag flip on paper.
      const checkRes = await targetAgent.get('/api/auth/check-auth');
      expect(checkRes.status).toBe(401);
      expect(checkRes.body).toEqual({ status: 'FAILED', message: 'Session no longer valid.' });
    });

    test('rejects the actor changing their own status', async () => {
      const superUser = makeUser('Super');
      const superAgent = await registerVerifyLogin(superUser, { role: 'super_admin' });
      const superId = await getUserId(superUser.email);
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch(`/api/admin/users/${superId}/status`)
        .set('x-csrf-token', csrfToken)
        .send({ status: 'suspended' });

      expect(res.status).toBe(403);
      expect(res.body.error.message).toBe("You can't change your own account status.");
    });

    test('rejects a status change for an unknown user', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .patch('/api/admin/users/999999/status')
        .set('x-csrf-token', csrfToken)
        .send({ status: 'banned' });

      expect(res.status).toBe(404);
    });

    test('rejects an actor who is admin but not super_admin', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);

      const res = await adminAgent
        .patch(`/api/admin/users/${targetId}/status`)
        .send({ status: 'suspended' });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /users/:id/force-logout', () => {
    test("invalidates the target's existing session without changing their status", async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const target = makeUser('Target');
      const targetAgent = await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .post(`/api/admin/users/${targetId}/force-logout`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, data: null, message: 'User signed out of all sessions.' });

      const checkRes = await targetAgent.get('/api/auth/check-auth');
      expect(checkRes.status).toBe(401);

      // A fresh login still works -- this is a session revoke, not a ban.
      const loginCsrf = await getCsrfToken(targetAgent);
      const loginRes = await targetAgent
        .post('/api/auth/login')
        .set('x-csrf-token', loginCsrf)
        .send({ email: target.email, password: target.password });
      expect(loginRes.status).toBe(200);
    });

    test("rejects the actor force-logging-out their own session", async () => {
      const superUser = makeUser('Super');
      const superAgent = await registerVerifyLogin(superUser, { role: 'super_admin' });
      const superId = await getUserId(superUser.email);
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .post(`/api/admin/users/${superId}/force-logout`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(403);
    });

    test('rejects an actor who is admin but not super_admin', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);

      const res = await adminAgent.post(`/api/admin/users/${targetId}/force-logout`);

      expect(res.status).toBe(403);
    });

    test('rejects force-logout for an unknown user', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .post('/api/admin/users/999999/force-logout')
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /users/:id/verify-email', () => {
    test('verifies an unverified user as a plain admin (no super_admin required)', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target, { skipVerify: true });
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(adminAgent);

      const res = await adminAgent
        .post(`/api/admin/users/${targetId}/verify-email`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, data: null, message: 'Email marked as verified.' });

      // The target can now log in, which was blocked while unverified.
      const freshAgent = request.agent(app);
      const freshCsrf = await getCsrfToken(freshAgent);
      const loginRes = await freshAgent
        .post('/api/auth/login')
        .set('x-csrf-token', freshCsrf)
        .send({ email: target.email, password: target.password });
      expect(loginRes.status).toBe(200);
    });

    test('rejects verifying a user who is already verified', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(adminAgent);

      const res = await adminAgent
        .post(`/api/admin/users/${targetId}/verify-email`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        success: false,
        error: { code: 'CONFLICT', message: 'User is already verified' },
      });
    });

    test('rejects verify-email for an unknown user', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const csrfToken = await getCsrfToken(adminAgent);

      const res = await adminAgent
        .post('/api/admin/users/999999/verify-email')
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /users/:id/trigger-password-reset', () => {
    test('sends a reset token and records an audit entry', async () => {
      const adminUser2 = makeUser('Admin');
      const adminAgent = await registerVerifyLogin(adminUser2, { role: 'admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      const csrfToken = await getCsrfToken(adminAgent);

      const res = await adminAgent
        .post(`/api/admin/users/${targetId}/trigger-password-reset`)
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, data: null, message: 'Password reset email sent.' });

      const { rows } = await pool.query('SELECT reset_token FROM users WHERE user_id = $1', [targetId]);
      expect(rows[0].reset_token).toBeTruthy();

      const auditRes = await adminAgent.get('/api/admin/audit-log?action=trigger_password_reset');
      expect(auditRes.body.data.rows[0]).toMatchObject({
        action: 'trigger_password_reset',
        actor_email: adminUser2.email,
        target_email: target.email,
      });
    });

    test('rejects triggering a reset for an unknown user', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });
      const csrfToken = await getCsrfToken(adminAgent);

      const res = await adminAgent
        .post('/api/admin/users/999999/trigger-password-reset')
        .set('x-csrf-token', csrfToken);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /audit-log', () => {
    test('filters by action', async () => {
      const superUser = makeUser('Super');
      const superAgent = await registerVerifyLogin(superUser, { role: 'super_admin' });
      const target = makeUser('Target');
      await registerVerifyLogin(target);
      const targetId = await getUserId(target.email);
      let csrfToken = await getCsrfToken(superAgent);

      await superAgent
        .patch(`/api/admin/users/${targetId}/role`)
        .set('x-csrf-token', csrfToken)
        .send({ role: 'admin' });

      csrfToken = await getCsrfToken(superAgent);
      await superAgent
        .post(`/api/admin/users/${targetId}/force-logout`)
        .set('x-csrf-token', csrfToken);

      const res = await superAgent.get('/api/admin/audit-log?action=force_logout');

      expect(res.status).toBe(200);
      expect(res.body.data.rows).toHaveLength(1);
      expect(res.body.data.rows[0]).toMatchObject({ action: 'force_logout', target_email: target.email });
    });
  });

  describe('Content overrides (/api/admin/content)', () => {
    const override = { tmdbId: 550, mediaType: 'movie', title: 'Fight Club', status: 'featured' };

    test('rejects a non-super_admin actor creating an override', async () => {
      const adminAgent = await registerVerifyLogin(makeUser('Admin'), { role: 'admin' });

      const res = await adminAgent.post('/api/admin/content').send(override);

      expect(res.status).toBe(403);
    });

    test('creates, lists, and removes an override as super_admin', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      let csrfToken = await getCsrfToken(superAgent);

      const createRes = await superAgent
        .post('/api/admin/content')
        .set('x-csrf-token', csrfToken)
        .send(override);

      expect(createRes.status).toBe(201);
      expect(createRes.body).toMatchObject({
        success: true,
        message: 'Content override saved.',
        data: { tmdb_id: 550, media_type: 'movie', title: 'Fight Club', status: 'featured' },
      });

      const listRes = await superAgent.get('/api/admin/content');
      expect(listRes.body.data).toHaveLength(1);

      const overrideId = createRes.body.data.id;
      csrfToken = await getCsrfToken(superAgent);
      const deleteRes = await superAgent
        .delete(`/api/admin/content/${overrideId}`)
        .set('x-csrf-token', csrfToken);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({ success: true, data: null, message: 'Content override removed.' });

      const listAfterRes = await superAgent.get('/api/admin/content');
      expect(listAfterRes.body.data).toHaveLength(0);
    });

    test('upserts on the same tmdbId/mediaType instead of creating a duplicate row', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      let csrfToken = await getCsrfToken(superAgent);

      await superAgent.post('/api/admin/content').set('x-csrf-token', csrfToken).send(override);

      csrfToken = await getCsrfToken(superAgent);
      const secondRes = await superAgent
        .post('/api/admin/content')
        .set('x-csrf-token', csrfToken)
        .send({ ...override, status: 'blocked' });

      expect(secondRes.status).toBe(201);

      const listRes = await superAgent.get('/api/admin/content');
      expect(listRes.body.data).toHaveLength(1);
      expect(listRes.body.data[0].status).toBe('blocked');
    });

    test('filters the list by status', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      let csrfToken = await getCsrfToken(superAgent);
      await superAgent.post('/api/admin/content').set('x-csrf-token', csrfToken).send(override);

      csrfToken = await getCsrfToken(superAgent);
      await superAgent
        .post('/api/admin/content')
        .set('x-csrf-token', csrfToken)
        .send({ tmdbId: 680, mediaType: 'movie', title: 'Pulp Fiction', status: 'blocked' });

      const featuredRes = await superAgent.get('/api/admin/content?status=featured');
      expect(featuredRes.body.data).toHaveLength(1);
      expect(featuredRes.body.data[0].title).toBe('Fight Club');
    });

    test('rejects an invalid mediaType', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent
        .post('/api/admin/content')
        .set('x-csrf-token', csrfToken)
        .send({ ...override, mediaType: 'podcast' });

      expect(res.status).toBe(400);
    });

    test('rejects removing an unknown override', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);

      const res = await superAgent.delete('/api/admin/content/999999').set('x-csrf-token', csrfToken);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Content override not found' },
      });
    });

    test('a logged-in guest can read overrides (platform-wide blocklist, not admin-only)', async () => {
      const superAgent = await registerVerifyLogin(makeUser('Super'), { role: 'super_admin' });
      const csrfToken = await getCsrfToken(superAgent);
      await superAgent.post('/api/admin/content').set('x-csrf-token', csrfToken).send(override);

      const guestAgent = await registerVerifyLogin(makeUser('Guest'));
      const res = await guestAgent.get('/api/content/overrides');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });
});
