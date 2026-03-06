import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import bandsRoutes from './routes/bands';
import eventsRoutes from './routes/events';
import postsRoutes from './routes/posts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bands', bandsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/posts', postsRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('BandLords API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
