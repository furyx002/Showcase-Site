require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const posService = require('./services/posService');
const authService = require('./services/authService');

const authRouter = require('./routes/auth');
const tablesRouter = require('./routes/tables');
const customersRouter = require('./routes/customers');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const reportsRouter = require('./routes/reports');
const settingsRouter = require('./routes/settings');
const categoriesRouter = require('./routes/categories');
const uploadRouter = require('./routes/upload');

// Models
require('./models/Setting');
require('./models/Category');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount API Routes
app.use('/api/auth', authRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'SANITARY STORE BACKEND',
    timestamp: new Date().toISOString()
  });
});

// Start Server
async function start() {
  await connectDB();
  await posService.initDatabase();
  await authService.seedAdminUser();

  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` 📦 SANITARY STORE BACKEND SERVER RUNNING       `);
    console.log(` 🔑 Admin Account: admin@sanitary.com / furyisop56`);
    console.log(` 🚀 Listening on: http://localhost:${PORT}        `);
    console.log(` 📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================================`);
  });
}

start();
