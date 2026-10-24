import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import health from './routes/health.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/health', health);

export default app;
