# ROFL Port Check

A simple TypeScript backend service for checking port connectivity and providing health monitoring capabilities. Built with Express.js and designed to run in Docker containers.

## Features

- **Port Connectivity Checking**: Test if specific ports are reachable on target hosts
- **Multiple Port Checking**: Check multiple ports simultaneously
- **Port Range Scanning**: Scan a range of ports on a target host
- **Health Check Endpoints**: Built-in health, readiness, and liveness endpoints
- **Docker Support**: Containerized deployment with Docker and Docker Compose
- **TypeScript**: Full TypeScript support with strict type checking
- **Comprehensive Testing**: Unit and integration tests with Jest

## API Endpoints

### Health Checks
- `GET /health` - General health status with system information
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Port Checking
- `POST /api/check-port` - Check a single port
- `POST /api/check-ports` - Check multiple ports
- `POST /api/check-port-range` - Check a range of ports

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd rofl-port-check

# Build and run with Docker Compose
docker-compose up --build

# The service will be available at http://localhost:3000
```

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
pnpm start
```

## Usage Examples

### Health Check Endpoints
```bash
# General health status
curl http://localhost:3000/health

# Readiness probe
curl http://localhost:3000/health/ready

# Liveness probe
curl http://localhost:3000/health/live

# API info
curl http://localhost:3000/
```

### Port Checking

#### Check Single Port
```bash
curl -X POST http://localhost:3000/api/check-port \
  -H "Content-Type: application/json" \
  -d '{"host": "google.com", "port": 80, "timeout": 5000}'
```

#### Check Multiple Ports
```bash
curl -X POST http://localhost:3000/api/check-ports \
  -H "Content-Type: application/json" \
  -d '{"host": "google.com", "ports": [80, 443, 8080], "timeout": 5000}'
```

#### Check Port Range
```bash
curl -X POST http://localhost:3000/api/check-port-range \
  -H "Content-Type: application/json" \
  -d '{"host": "localhost", "startPort": 3000, "endPort": 3010, "timeout": 2000}'
```

## Configuration

Environment variables can be configured in `.env` file:

```env
PORT=3000
NODE_ENV=development
DEFAULT_TIMEOUT=5000
MAX_PORTS_PER_REQUEST=50
MAX_PORT_RANGE=100
CORS_ORIGIN=*
LOG_LEVEL=info
```

## Docker Deployment

### Production
```bash
docker-compose up -d
```

### Development
```bash
docker-compose --profile dev up
```

The development profile includes volume mounting for hot reloading.

## API Response Format

### Single Port Check Response
```json
{
  "host": "google.com",
  "port": 80,
  "isReachable": true,
  "responseTime": 45,
  "timestamp": "2023-12-07T10:30:00.000Z"
}
```

### Multiple Ports Check Response
```json
{
  "host": "google.com",
  "total": 3,
  "reachable": 2,
  "results": [
    {
      "host": "google.com",
      "port": 80,
      "isReachable": true,
      "responseTime": 45,
      "timestamp": "2023-12-07T10:30:00.000Z"
    }
  ]
}
```

## Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "uptime": 1234.567,
  "memory": {
    "rss": 45678,
    "heapTotal": 12345,
    "heapUsed": 6789
  },
  "version": "v18.17.0"
}
```

## Development

### Scripts
- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

### Project Structure
```
src/
├── __tests__/          # Test files
├── routes/             # Express route handlers
├── services/           # Business logic services
└── index.ts           # Application entry point
```

## License

MIT