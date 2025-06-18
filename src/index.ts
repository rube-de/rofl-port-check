import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health';
import { portCheckRouter } from './routes/portCheck';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api', portCheckRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'ROFL Port Check API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      portCheck: '/api/check-port'
    }
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };