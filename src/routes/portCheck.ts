import { Router, Request, Response } from 'express';
import { PortChecker } from '../services/portChecker';

const router: Router = Router();
const portChecker = new PortChecker();

interface CheckPortRequest {
  host: string;
  port: number;
  timeout?: number;
}

interface CheckMultiplePortsRequest {
  host: string;
  ports: number[];
  timeout?: number;
}

interface CheckPortRangeRequest {
  host: string;
  startPort: number;
  endPort: number;
  timeout?: number;
}

router.post('/check-port', async (req: Request<{}, {}, CheckPortRequest>, res: Response): Promise<void> => {
  try {
    const { host, port, timeout } = req.body;

    if (!host || !port) {
      res.status(400).json({
        error: 'Host and port are required',
        example: { host: 'google.com', port: 80 }
      });
      return;
    }

    if (typeof port !== 'number' || port < 1 || port > 65535) {
      res.status(400).json({
        error: 'Port must be a number between 1 and 65535'
      });
      return;
    }

    const options: { timeout?: number } = {};
    if (timeout !== undefined) {
      options.timeout = timeout;
    }

    const result = await portChecker.checkPort(host, port, options);
    res.json(result);

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/check-ports', async (req: Request<{}, {}, CheckMultiplePortsRequest>, res: Response): Promise<void> => {
  try {
    const { host, ports, timeout } = req.body;

    if (!host || !ports || !Array.isArray(ports)) {
      res.status(400).json({
        error: 'Host and ports array are required',
        example: { host: 'google.com', ports: [80, 443, 8080] }
      });
      return;
    }

    if (ports.length > 50) {
      res.status(400).json({
        error: 'Maximum 50 ports allowed per request'
      });
      return;
    }

    const options: { timeout?: number } = {};
    if (timeout !== undefined) {
      options.timeout = timeout;
    }

    const results = await portChecker.checkMultiplePorts(host, ports, options);
    res.json({
      host,
      total: results.length,
      reachable: results.filter(r => r.isReachable).length,
      results
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/check-port-range', async (req: Request<{}, {}, CheckPortRangeRequest>, res: Response): Promise<void> => {
  try {
    const { host, startPort, endPort, timeout } = req.body;

    if (!host || !startPort || !endPort) {
      res.status(400).json({
        error: 'Host, startPort, and endPort are required',
        example: { host: 'google.com', startPort: 80, endPort: 85 }
      });
      return;
    }

    if (endPort - startPort > 100) {
      res.status(400).json({
        error: 'Port range cannot exceed 100 ports'
      });
      return;
    }

    const options: { timeout?: number } = {};
    if (timeout !== undefined) {
      options.timeout = timeout;
    }

    const results = await portChecker.checkPortRange(host, startPort, endPort, options);
    res.json({
      host,
      range: `${startPort}-${endPort}`,
      total: results.length,
      reachable: results.filter(r => r.isReachable).length,
      results
    });

  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as portCheckRouter };