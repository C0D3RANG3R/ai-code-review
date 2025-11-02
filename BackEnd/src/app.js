const express = require('express');
const aiRoutes = require('./routes/ai.routes');
const cors = require('cors');

const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/ai', aiRoutes);

module.exports = app;