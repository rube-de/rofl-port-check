# ROFL Health Check

A simple TypeScript backend service for health monitoring. Built with Express.js and designed to run in Docker containers for deployment verification.

## Features

- **Health Check Endpoints**: Built-in health, readiness, and liveness endpoints
- **Docker Support**: Containerized deployment with Docker and Docker Compose
- **TypeScript**: Full TypeScript support with strict type checking
- **Comprehensive Testing**: Integration tests with Jest
- **Lightweight**: Minimal dependencies for fast deployment

## API Endpoints

### Health Checks
- `GET /health` - General health status with system information
- `GET /health/ready` - Readiness probe (for container orchestration)
- `GET /health/live` - Liveness probe (for container orchestration)
- `GET /` - API information and available endpoints

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd rofl-port-check

# Build and run with Docker Compose
docker compose up --build

# The service will be available at http://localhost:3000
```

### Local Development (Optional)

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Run tests
pnpm test
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

These endpoints are perfect for verifying that your deployment is reachable and healthy.

## Configuration

Environment variables can be configured in `.env` file:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

## Docker Deployment

```bash
docker compose up -d
```

## API Response Format

### Health Check Response
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

## Project Structure
```
src/
├── __tests__/          # Test files
├── routes/             # Express route handlers
└── index.ts           # Application entry point
```

## License

MIT