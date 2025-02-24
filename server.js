const express = require('express');
const connectDB = require('./config/db');
const uploadRoutes = require('./routes/upload');
const statusRoutes = require('./routes/status');
const downloadRoutes = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/upload', uploadRoutes);
app.use('/status', statusRoutes);
app.use('/download', downloadRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

