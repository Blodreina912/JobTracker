import 'dotenv/config';
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';

const email = `test+${Date.now()}@example.com`;
const password = 'correct-horse-battery';
const agent = request.agent(app);

after(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
  await pool.end();
});

test('signup rejects an invalid email', async () => {
  const res = await request(app).post('/auth/signup').send({ email: 'nope', password });
  assert.equal(res.status, 400);
});

test('signup rejects a short password', async () => {
  const res = await request(app).post('/auth/signup').send({ email, password: 'short' });
  assert.equal(res.status, 400);
});

test('signup creates a user and sets an httpOnly cookie', async () => {
  const res = await agent.post('/auth/signup').send({ email, password });
  assert.equal(res.status, 201);
  assert.equal(res.body.user.email, email);
  assert.equal(res.body.user.password_hash, undefined);
  assert.match(res.headers['set-cookie'][0], /HttpOnly/i);
});

test('duplicate signup returns 409', async () => {
  const res = await request(app).post('/auth/signup').send({ email, password });
  assert.equal(res.status, 409);
});

test('/me returns the user when logged in', async () => {
  const res = await agent.get('/auth/me');
  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, email);
});

test('/me returns 401 without a cookie', async () => {
  const res = await request(app).get('/auth/me');
  assert.equal(res.status, 401);
});

test('login rejects a wrong password', async () => {
  const res = await request(app).post('/auth/login').send({ email, password: 'wrong-password' });
  assert.equal(res.status, 401);
});

test('login succeeds with the right password', async () => {
  const res = await request(app).post('/auth/login').send({ email, password });
  assert.equal(res.status, 200);
  assert.ok(res.headers['set-cookie']);
});

test('logout clears the session', async () => {
  const out = await agent.post('/auth/logout');
  assert.equal(out.status, 204);
  const res = await agent.get('/auth/me');
  assert.equal(res.status, 401);
});
