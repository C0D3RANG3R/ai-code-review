require('dotenv').config();
const express = require('express');
const aiRoutes = require('./src/routes/ai.routes');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'https://your-frontend-name.vercel.app';

app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use('/ai', aiRoutes);
app.use(errorHandler);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
