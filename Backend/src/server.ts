import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index';
import { db } from './services/database.service';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint with DB status
app.get('/health', async (req, res) => {
  const dbStatus = await db.testConnection();
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error details:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ 
    error: 'Server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    
    // Test database connection
    try {
      const isConnected = await db.testConnection();
      if (isConnected) {
        console.log('Successfully connected to the database');
      } else {
        console.error('Failed to connect to the database');
      }
    } catch (error) {
      console.error('Error testing database connection:', error);
    }
  });
}

// Export the app for serverless environments
export default app;
