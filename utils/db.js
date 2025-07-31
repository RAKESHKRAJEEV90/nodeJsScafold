const { Pool } = require('pg');
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

let dbClient;

async function connect() {
  const usePostgres = config.get('usePostgres');
  const useMongo = config.get('useMongo');

  if (usePostgres) {
    const pgConfig = config.get('postgres');
    dbClient = new Pool({
      user: pgConfig.user,
      host: pgConfig.host,
      database: pgConfig.database,
      password: pgConfig.password,
      port: pgConfig.port,
    });

    dbClient.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    try {
      await dbClient.query('SELECT NOW()');
      logger.info('PostgreSQL connected');
    } catch (err) {
      logger.error('PostgreSQL connection error:', err);
      throw err;
    }
  } else if (useMongo) {
    const mongoUri = config.get('mongo.uri');
    try {
      await mongoose.connect(mongoUri);
      logger.info('MongoDB connected');
      dbClient = mongoose.connection;
    } catch (err) {
      logger.error('MongoDB connection error:', err);
      throw err;
    }
  } else {
    throw new Error('No database selected');
  }
}

async function query(text, params) {
  if (config.get('usePostgres')) {
    return dbClient.query(text, params);
  } else if (config.get('useMongo')) {
    // For Mongo, this would need model-specific implementations
    throw new Error('Query not implemented for MongoDB');
  }
}

module.exports = { connect, query, getClient: () => dbClient }