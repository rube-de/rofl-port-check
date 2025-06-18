import { Socket } from 'net';

export interface PortCheckResult {
  host: string;
  port: number;
  isReachable: boolean;
  responseTime: number;
  error?: string;
  timestamp: string;
}

export interface PortCheckOptions {
  timeout?: number | undefined;
}

export class PortChecker {
  private defaultTimeout = 5000;

  async checkPort(host: string, port: number, options: PortCheckOptions = {}): Promise<PortCheckResult> {
    const timeout = options.timeout || this.defaultTimeout;
    const startTime = Date.now();
    
    return new Promise((resolve) => {
      const socket = new Socket();
      
      const cleanup = () => {
        socket.destroy();
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        resolve({
          host,
          port,
          isReachable: false,
          responseTime: timeout,
          error: 'Connection timeout',
          timestamp: new Date().toISOString()
        });
      }, timeout);

      socket.on('connect', () => {
        const responseTime = Date.now() - startTime;
        clearTimeout(timeoutId);
        cleanup();
        resolve({
          host,
          port,
          isReachable: true,
          responseTime,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('error', (err) => {
        const responseTime = Date.now() - startTime;
        clearTimeout(timeoutId);
        cleanup();
        resolve({
          host,
          port,
          isReachable: false,
          responseTime,
          error: err.message,
          timestamp: new Date().toISOString()
        });
      });

      socket.connect(port, host);
    });
  }

  async checkMultiplePorts(host: string, ports: number[], options: PortCheckOptions = {}): Promise<PortCheckResult[]> {
    const promises = ports.map(port => this.checkPort(host, port, options));
    return Promise.all(promises);
  }

  async checkPortRange(host: string, startPort: number, endPort: number, options: PortCheckOptions = {}): Promise<PortCheckResult[]> {
    const ports = [];
    for (let port = startPort; port <= endPort; port++) {
      ports.push(port);
    }
    return this.checkMultiplePorts(host, ports, options);
  }
}