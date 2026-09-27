require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./src/db');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const apiaryRoutes = require('./src/routes/apiary');
const hiveRoutes = require('./src/routes/hive');
const inspectionRoutes = require('./src/routes/inspection');
const harvestRoutes = require('./src/routes/harvest');
const batchRoutes = require('./src/routes/batch');
const consumerRoutes = require('./src/routes/consumer');
const seedRoutes = require('./src/routes/seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint per Rules.md
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'HoneyChain Backend API',
      timestamp: new Date().toISOString()
    },
    error: null
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/apiary', apiaryRoutes);
app.use('/api/hive', hiveRoutes);
app.use('/api/inspection', inspectionRoutes);
app.use('/api/harvest', harvestRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/consumer', consumerRoutes);
app.use('/api/seed', seedRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server after DB init
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 HoneyChain Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start HoneyChain server:', err);
    process.exit(1);
  }
}

startServer();
