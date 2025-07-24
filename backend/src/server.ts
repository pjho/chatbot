import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import createChatRoutes from './routes/chat.js';
import createHealthRoutes from './routes/health.js';

import OllamaService from './services/ollama.js';

dotenv.config();
const ollamaService = new OllamaService(process.env.OLLAMA_BASE_URL!);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_SERVER,
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});


app.use('/api/chat', createChatRoutes(ollamaService));
app.use('/health', createHealthRoutes(ollamaService));



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});