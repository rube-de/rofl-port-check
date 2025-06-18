import request from 'supertest';
import { app, server } from '../index';

describe('API Endpoints', () => {
  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'ROFL Port Check API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    it('should return ready status', async () => {
      const response = await request(app).get('/health/ready');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ready');
    });

    it('should return alive status', async () => {
      const response = await request(app).get('/health/live');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'alive');
    });
  });

  describe('Port Check Endpoints', () => {
    describe('POST /api/check-port', () => {
      it('should check a reachable port', async () => {
        const response = await request(app)
          .post('/api/check-port')
          .send({ host: 'google.com', port: 80, timeout: 5000 });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('host', 'google.com');
        expect(response.body).toHaveProperty('port', 80);
        expect(response.body).toHaveProperty('isReachable');
        expect(response.body).toHaveProperty('responseTime');
        expect(response.body).toHaveProperty('timestamp');
      });

      it('should return error for missing host', async () => {
        const response = await request(app)
          .post('/api/check-port')
          .send({ port: 80 });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should return error for invalid port', async () => {
        const response = await request(app)
          .post('/api/check-port')
          .send({ host: 'google.com', port: 70000 });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/check-ports', () => {
      it('should check multiple ports', async () => {
        const response = await request(app)
          .post('/api/check-ports')
          .send({ host: 'google.com', ports: [80, 443], timeout: 5000 });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('host', 'google.com');
        expect(response.body).toHaveProperty('total', 2);
        expect(response.body).toHaveProperty('reachable');
        expect(response.body).toHaveProperty('results');
        expect(response.body.results).toHaveLength(2);
      });

      it('should return error for too many ports', async () => {
        const ports = Array.from({ length: 51 }, (_, i) => i + 1);
        const response = await request(app)
          .post('/api/check-ports')
          .send({ host: 'google.com', ports });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('POST /api/check-port-range', () => {
      it('should check port range', async () => {
        const response = await request(app)
          .post('/api/check-port-range')
          .send({ host: 'google.com', startPort: 80, endPort: 82, timeout: 5000 });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('host', 'google.com');
        expect(response.body).toHaveProperty('range', '80-82');
        expect(response.body).toHaveProperty('total', 3);
        expect(response.body).toHaveProperty('results');
        expect(response.body.results).toHaveLength(3);
      });

      it('should return error for large port range', async () => {
        const response = await request(app)
          .post('/api/check-port-range')
          .send({ host: 'google.com', startPort: 1, endPort: 200 });
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });
  });
});