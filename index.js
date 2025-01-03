require('dotenv').config();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const connectDB = require('./config/database');

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    console.log(`Number of CPUs: ${numCPUs}`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Replace the dead worker
    });
} else {
    const app = express();

    // Middleware
    app.use(express.json());

    // Connect to MongoDB
    connectDB();

    // Routes
    app.use('/api/items', require('./routes/items'));

    // Basic route
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the API' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started - Server running on port ${PORT}`);
    });
}
