require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`[PID ${process.pid}] Server is running on port ${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`[FATAL] Port ${PORT} is already in use. Exiting.`);
    } else {
        console.error('[FATAL] Server error:', error.message, error);
    }
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('[FATAL] Uncaught Exception:', error.message, error.stack);
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
    server.close(() => {
        process.exit(1);
    });
});