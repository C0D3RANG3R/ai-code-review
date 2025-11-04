require('dotenv').config();
const express = require('express');
const aiRoutes = require('./src/routes/ai.routes');
const cors = require('cors');
const { errorHandler } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 8000;

// Frontend URLs (from .env + localhost)
const CLIENT_URL = process.env.CLIENT_URL;
const allowedOrigins = new Set(
  ['http://localhost:5173', CLIENT_URL].filter(Boolean)
);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow tools like Postman
      if (allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use('/ai', aiRoutes);
app.use(errorHandler);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
