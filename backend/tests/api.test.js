const request = require('supertest');
const app = require('../src/server');

describe('SpendSmart API Test Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 and healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('healthy');
      expect(res.body.service).toEqual('SpendSmart API');
    });
  });

  describe('Authentication & Protected Route Guards', () => {
    it('should deny access to /api/transactions without JWT token', async () => {
      const res = await request(app).get('/api/transactions');
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token/i);
    });

    it('should deny access to /api/analytics/summary without JWT token', async () => {
      const res = await request(app).get('/api/analytics/summary');
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail registration when missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
