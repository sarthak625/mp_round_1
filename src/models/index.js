'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const logger = require('log4js').getLogger('console');

// SQL Connection String
let SQL_URI;

const sqlUsername = process.env.SQL_USERNAME || 'root';
const sqlPassword = process.env.SQL_PASSWORD || 'password';
const sqlHost = process.env.SQL_HOST || '127.0.0.1';
const sqlPort = process.env.SQL_PORT || '3306';
const sqlDatabaseName = process.env.SQL_DATABASE_NAME || 'test';

if (process.env.SQL_AUTH_ENABLED === 'true') {
  // eslint-disable-next-line max-len
  SQL_URI = `mysql://${sqlUsername}:${encodeURIComponent(sqlPassword)}@${sqlHost}:${sqlPort}/${sqlDatabaseName}`;
} else {
  // eslint-disable-next-line max-len
  SQL_URI = `mysql://${sqlHost}:${sqlPort}/${sqlDatabaseName}`;
}

logger.debug(`Trying to connect MySQL at ${SQL_URI}`);

// Sequelizer configuration
const config = {
  logging: (message) => {
    logger.debug(message);
  },
};

if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'prod') {
  config.logging = false;
}

const sequelize = new Sequelize(SQL_URI, config);

sequelize.authenticate()
    .then(() => {
      logger.info(`Successfully connected to MYSQL at ${sqlHost}:${sqlPort}`);
    })
    .catch((err) => {
      logger.error({ err });
      logger.error(`Error occurred while connecting to DB`);
    });

fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
      const model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
