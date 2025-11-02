require('dotenv').config();
const express = require('express');
const aiRoutes = require('./src/routes/ai.routes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;
const API_URL = process.env.CLIENT_URL || 'http://localhost:5173'; // Changed URL env key for clarity

// Middlewares
app.use(express.json());
app.use(cors({ origin: API_URL, credentials: true }));

// Routes
app.use('/ai', aiRoutes);

// Serve Frontend
const FE_DIST_PATH = path.join(__dirname, "../frontend/dist");
app.use(express.static(FE_DIST_PATH));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(FE_DIST_PATH, "index.html"));
});

// Global Error Handler (Good practice, kept minimal)
app.use((err, req, res, next) => {
    console.error(`Global Error Handler: ${err.stack}`);
    res.status(err.status || 500).json({
        error: "Internal Server Error"
    });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));