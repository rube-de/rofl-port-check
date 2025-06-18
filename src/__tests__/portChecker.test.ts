import { PortChecker } from '../services/portChecker';

describe('PortChecker', () => {
  let portChecker: PortChecker;

  beforeEach(() => {
    portChecker = new PortChecker();
  });

  describe('checkPort', () => {
    it('should return true for reachable port', async () => {
      const result = await portChecker.checkPort('google.com', 80, { timeout: 5000 });
      
      expect(result.host).toBe('google.com');
      expect(result.port).toBe(80);
      expect(result.isReachable).toBe(true);
      expect(result.responseTime).toBeGreaterThan(0);
      expect(result.timestamp).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return false for unreachable port', async () => {
      const result = await portChecker.checkPort('localhost', 9999, { timeout: 1000 });
      
      expect(result.host).toBe('localhost');
      expect(result.port).toBe(9999);
      expect(result.isReachable).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should respect timeout setting', async () => {
      const startTime = Date.now();
      const result = await portChecker.checkPort('192.0.2.1', 80, { timeout: 500 });
      const endTime = Date.now();
      
      expect(result.isReachable).toBe(false);
      expect(result.error).toBeDefined();
      expect(endTime - startTime).toBeLessThan(600); // Should finish within timeout + small buffer
    });

    it('should handle invalid hostnames', async () => {
      const result = await portChecker.checkPort('invalid-hostname-12345', 80, { timeout: 1000 });
      
      expect(result.isReachable).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('checkMultiplePorts', () => {
    it('should check multiple ports', async () => {
      const results = await portChecker.checkMultiplePorts('google.com', [80, 443], { timeout: 5000 });
      
      expect(results).toHaveLength(2);
      expect(results[0]?.port).toBe(80);
      expect(results[1]?.port).toBe(443);
      expect(results.every(r => r.host === 'google.com')).toBe(true);
    });

    it('should handle empty ports array', async () => {
      const results = await portChecker.checkMultiplePorts('google.com', []);
      
      expect(results).toHaveLength(0);
    });
  });

  describe('checkPortRange', () => {
    it('should check port range', async () => {
      const results = await portChecker.checkPortRange('google.com', 80, 82, { timeout: 5000 });
      
      expect(results).toHaveLength(3);
      expect(results[0]?.port).toBe(80);
      expect(results[1]?.port).toBe(81);
      expect(results[2]?.port).toBe(82);
    });

    it('should handle single port range', async () => {
      const results = await portChecker.checkPortRange('google.com', 80, 80);
      
      expect(results).toHaveLength(1);
      expect(results[0]?.port).toBe(80);
    });
  });
});