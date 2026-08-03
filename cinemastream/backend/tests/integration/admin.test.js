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

const registerVerifyLogin = async (user, { asAdmin = false } = {}) => {
  const agent = request.agent(app);

  const registerCsrf = await getCsrfToken(agent);
  await agent.post('/api/auth/register').set('x-csrf-token', registerCsrf).send(user);

  const { rows } = await pool.query('SELECT verification_token FROM users WHERE email = $1', [user.email]);
  const otp = rows[0].verification_token;

  const verifyCsrf = await getCsrfToken(agent);
  await agent
    .post('/api/auth/verify-otp')
    .set('x-csrf-token', verifyCsrf)
    .send({ email: user.email, otp });

  if (asAdmin) {
    // Roles aren't self-assignable through any route -- promote directly so
    // the subsequent login's JWT is signed with role: 'admin'.
    await pool.query("UPDATE users SET role = 'admin' WHERE email = $1", [user.email]);
  }

  const loginCsrf = await getCsrfToken(agent);
  await agent
    .post('/api/auth/login')
    .set('x-csrf-token', loginCsrf)
    .send({ email: user.email, password: user.password });

  return agent;
};

describe('Admin API', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE login_history, watched_history, users RESTART IDENTITY CASCADE');
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
    const agent = await registerVerifyLogin(adminUser, { asAdmin: true });

    const res = await agent.get('/api/admin/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ email: adminUser.email, role: 'admin' });
  });

  test('returns platform overview stats for an admin', async () => {
    const agent = await registerVerifyLogin(adminUser, { asAdmin: true });
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
    const agent = await registerVerifyLogin(adminUser, { asAdmin: true });
    const csrfToken = await getCsrfToken(agent);

    await agent
      .post('/api/watch')
      .set('x-csrf-token', csrfToken)
      .send({ movie_id: 1, movie_title: 'Only Show' });

    const res = await agent.get('/api/admin/stats/top-shows');

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ name: 'Only Show', type: 'Movie' });
  });
});
