require('dotenv').config();
const express = require('express');
const aiRoutes = require('./src/routes/ai.routes');
const cors = require('cors');
const path = require('node:path');
const { errorHandler } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use('/ai', aiRoutes);

const FE_DIST_PATH = path.join(__dirname, "../../frontend/dist");

app.use(express.static(FE_DIST_PATH));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(FE_DIST_PATH, "index.html"));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));