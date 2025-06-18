import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'ROFL Health Check API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ready: '/health/ready',
      live: '/health/live'
    }
  });
});

let server: any;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export { app, server };