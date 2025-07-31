const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const config = require('./config');
const logger = require('./utils/logger');

async function setupDatabase() {
  const pgConfig = config.get('postgres');
  const pool = new Pool({
    user: pgConfig.user,
    host: pgConfig.host,
    database: pgConfig.database,
    password: pgConfig.password,
    port: pgConfig.port,
  });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        user_id INTEGER REFERENCES users(id),
        refresh_token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);

    // Create user_activity_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(255),
        ip VARCHAR(45),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        key VARCHAR(255) NOT NULL,
        value TEXT,
        UNIQUE(user_id, key)
      );
    `);

    // Add indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);');

    // Seed initial admin
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    const res = await client.query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (res.rows.length === 0) {
      await client.query(
        'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
        ['Admin', 'User', adminEmail, passwordHash, 'admin']
      );
      logger.info('Admin user created');
    } else {
      logger.info('Admin user already exists');
    }

    await client.query('COMMIT');
    logger.info('Database setup completed');
  } catch (e) {
    await client.query('ROLLBACK');
    logger.error('Error setting up database:', e);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

// Retry logic
async function runWithRetry() {
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      await setupDatabase();
      return;
    } catch (err) {
      attempts++;
      logger.warn(`Attempt ${attempts} failed. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  logger.error('Max retry attempts reached. Database setup failed.');
  process.exit(1);
}

runWithRetry();