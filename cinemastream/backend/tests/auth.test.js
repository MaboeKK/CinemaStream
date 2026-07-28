import { describe, test, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

const newUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'auth-test@example.com',
  password: 'password123',
};

// Register/login/verify/reset all sit behind the CSRF middleware, so every
// mutating call needs a fresh token pulled from this endpoint first.
const getCsrfToken = async (agent) => {
  const res = await agent.get('/api/auth/csrf-token');
  return res.body.csrfToken;
};

const registerAndVerify = async (agent, user = newUser) => {
  const registerCsrf = await getCsrfToken(agent);
  await agent.post('/api/auth/register').set('x-csrf-token', registerCsrf).send(user);

  const { rows } = await pool.query('SELECT verification_token FROM users WHERE email = $1', [
    user.email,
  ]);
  const otp = rows[0].verification_token;

  const verifyCsrf = await getCsrfToken(agent);
  await agent
    .post('/api/auth/verify-otp')
    .set('x-csrf-token', verifyCsrf)
    .send({ email: user.email, otp });
};

describe('Auth API', () => {
  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE login_history, users RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    test('creates an unverified user and returns success', async () => {
      const agent = request.agent(app);
      const csrfToken = await getCsrfToken(agent);

      const res = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send(newUser);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ status: 'SUCCESS' });

      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [newUser.email]);
      expect(rows).toHaveLength(1);
      expect(rows[0].is_verified).toBe(false);
    });

    test('rejects a duplicate email', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const csrfToken = await getCsrfToken(agent);
      const res = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send(newUser);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'FAILED', message: 'User already exists' });
    });

    test('rejects invalid input before hitting the service', async () => {
      const agent = request.agent(app);
      const csrfToken = await getCsrfToken(agent);

      const res = await agent
        .post('/api/auth/register')
        .set('x-csrf-token', csrfToken)
        .send({ ...newUser, email: 'not-an-email' });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('FAILED');
    });

    test('rejects a request missing a CSRF token', async () => {
      const agent = request.agent(app);

      const res = await agent.post('/api/auth/register').send(newUser);

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/auth/login', () => {
    test('logs in a verified user and sets session cookies', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const csrfToken = await getCsrfToken(agent);
      const res = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: newUser.email, password: newUser.password });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUCCESS');
      expect(res.body.data.email).toBe(newUser.email);

      const cookies = res.headers['set-cookie'].join(';');
      expect(cookies).toMatch(/access_token=/);
      expect(cookies).toMatch(/refresh_token=/);
    });

    test('rejects an unverified user', async () => {
      const agent = request.agent(app);
      const registerCsrf = await getCsrfToken(agent);
      await agent.post('/api/auth/register').set('x-csrf-token', registerCsrf).send(newUser);

      const loginCsrf = await getCsrfToken(agent);
      const res = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', loginCsrf)
        .send({ email: newUser.email, password: newUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'FAILED',
        message: 'Please verify your email to login',
      });
    });

    test('rejects an incorrect password', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const csrfToken = await getCsrfToken(agent);
      const res = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: newUser.email, password: 'wrong-password' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'FAILED', message: 'Incorrect password' });
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('resets the password with a valid token and allows login with it', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const forgotCsrf = await getCsrfToken(agent);
      await agent
        .post('/api/auth/forgot-password')
        .set('x-csrf-token', forgotCsrf)
        .send({ email: newUser.email });

      const { rows } = await pool.query('SELECT reset_token FROM users WHERE email = $1', [
        newUser.email,
      ]);
      const resetToken = rows[0].reset_token;
      expect(resetToken).toBeTruthy();

      const resetCsrf = await getCsrfToken(agent);
      const resetRes = await agent
        .post('/api/auth/reset-password')
        .set('x-csrf-token', resetCsrf)
        .send({ email: newUser.email, resetToken, newPassword: 'newPassword456' });

      expect(resetRes.status).toBe(200);
      expect(resetRes.body.message).toBe('Password reset successful.');

      const loginCsrf = await getCsrfToken(agent);
      const loginRes = await agent
        .post('/api/auth/login')
        .set('x-csrf-token', loginCsrf)
        .send({ email: newUser.email, password: 'newPassword456' });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.status).toBe('SUCCESS');
    });

    test('rejects an invalid reset token', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const csrfToken = await getCsrfToken(agent);
      const res = await agent
        .post('/api/auth/reset-password')
        .set('x-csrf-token', csrfToken)
        .send({ email: newUser.email, resetToken: 'bogus-token', newPassword: 'newPassword456' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid reset token');
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    test('issues a new access token from a valid refresh cookie', async () => {
      const agent = request.agent(app);
      await registerAndVerify(agent);

      const csrfToken = await getCsrfToken(agent);
      await agent
        .post('/api/auth/login')
        .set('x-csrf-token', csrfToken)
        .send({ email: newUser.email, password: newUser.password });

      const res = await agent.post('/api/auth/refresh-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'SUCCESS', message: 'Token refreshed' });
      expect(res.headers['set-cookie'].join(';')).toMatch(/access_token=/);
    });

    test('rejects a request with no refresh token', async () => {
      const res = await request(app).post('/api/auth/refresh-token');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ status: 'FAILED', message: 'No refresh token' });
    });
  });
});
