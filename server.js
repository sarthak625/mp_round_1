// Load the env config and enforce .env.example file on .env
// So that no required env variables are missing.
require('dotenv-safe').config();

// Our npm imports
const http = require('http');
const express = require('express');
const log4js = require('log4js');

const logger = log4js.getLogger('app');
const app = express();
log4js.configure('./config/log4js.json');

// App middleware
// Normally i like to break this in separate files
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));

// Routes
app.use('/api', require('./src/routes/index'));

const SERVICE_PORT = process.env.PORT || 8000;

const server = http.createServer(app);

// Clustering can be enabled from the envs as per requirement
if (process.env.ENABLE_CLUSTERING === 'true') {
  const cluster = require('cluster');
  const numCPUs = require('os').cpus().length;
  if (!cluster.isMaster) {
    server.once('listening', () => {
      logger.info(`Service running on port ${SERVICE_PORT}`);
    });

    logger.info(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.info(`Worker ${worker.process.pid} died => Code: ${code} Signal = ${signal}`);
    });
  } else {
    logger.info(`By ${process.pid}`);
    logger.info(`Worker ${process.pid} started`);
  }
} else {
  server.listen(SERVICE_PORT, () => {
    logger.info(`Service running on port ${SERVICE_PORT}`);
  });
}
