import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';
import pool from '../../src/config/db.js';

const user = {
  first_name: 'Watch',
  last_name: 'Tester',
  email: 'watch-test@example.com',
  password: 'password123',
};

const getCsrfToken = async (agent) => {
  const res = await agent.get('/api/auth/csrf-token');
  return res.body.csrfToken;
};

const registerVerifyLogin = async () => {
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

  const loginCsrf = await getCsrfToken(agent);
  await agent
    .post('/api/auth/login')
    .set('x-csrf-token', loginCsrf)
    .send({ email: user.email, password: user.password });

  return agent;
};

describe('Watch API', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE login_history, watched_history, users RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  test('rejects an unauthenticated watch event', async () => {
    const res = await request(app).post('/api/watch').send({ movie_id: 1, movie_title: 'Nope' });
    expect(res.status).toBe(401);
  });

  test('records a movie watch event and returns it in history', async () => {
    const agent = await registerVerifyLogin();
    const csrfToken = await getCsrfToken(agent);

    const res = await agent
      .post('/api/watch')
      .set('x-csrf-token', csrfToken)
      .send({ movie_id: 550, movie_title: 'Fight Club' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ status: 'SUCCESS', message: 'Watch event saved' });

    const historyRes = await agent.get('/api/watch/history');
    expect(historyRes.status).toBe(200);
    expect(historyRes.body).toHaveLength(1);
    expect(historyRes.body[0]).toMatchObject({ movie_id: 550, movie_title: 'Fight Club' });
  });

  test('rejects a watch event with neither movie_id nor series_id', async () => {
    const agent = await registerVerifyLogin();
    const csrfToken = await getCsrfToken(agent);

    const res = await agent
      .post('/api/watch')
      .set('x-csrf-token', csrfToken)
      .send({ movie_title: 'No id at all' });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('FAILED');
  });

  test('rejects a watch event missing its CSRF token', async () => {
    const agent = await registerVerifyLogin();

    const res = await agent.post('/api/watch').send({ movie_id: 550, movie_title: 'Fight Club' });

    expect(res.status).toBe(403);
  });
});
