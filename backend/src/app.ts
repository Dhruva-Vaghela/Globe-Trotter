import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

// Allow all origins without CORS restrictions
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API v1 router
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);
