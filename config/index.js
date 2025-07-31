const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  enableLogger: {
    doc: 'Enable logging',
    format: Boolean,
    default: true,
    env: 'ENABLE_LOGGER'
  },
  logRotationDays: {
    doc: 'Number of days for log rotation',
    format: 'int',
    default: 7,
    env: 'LOG_ROTATION_DAYS'
  },
  enableRateLimiting: {
    doc: 'Enable rate limiting',
    format: Boolean,
    default: true,
    env: 'ENABLE_RATE_LIMITING'
  },
  rateLimit: {
    doc: 'Rate limit requests per minute',
    format: 'int',
    default: 100,
    env: 'RATE_LIMIT'
  },
  enableCors: {
    doc: 'Enable CORS',
    format: Boolean,
    default: true,
    env: 'ENABLE_CORS'
  },
  enableSanitization: {
    doc: 'Enable input sanitization',
    format: Boolean,
    default: true,
    env: 'ENABLE_SANITIZATION'
  },
  jwtSecret: {
    doc: 'JWT secret key',
    format: String,
    default: 'secret',
    env: 'JWT_SECRET'
  },
  jwtRefreshSecret: {
    doc: 'JWT refresh secret key',
    format: String,
    default: 'refresh_secret',
    env: 'JWT_REFRESH_SECRET'
  },
  enableSmtp: {
    doc: 'Enable SMTP',
    format: Boolean,
    default: false,
    env: 'ENABLE_SMTP'
  },
  smtpHost: {
    doc: 'SMTP host',
    format: String,
    default: '',
    env: 'SMTP_HOST'
  },
  smtpPort: {
    doc: 'SMTP port',
    format: 'port',
    default: 587,
    env: 'SMTP_PORT'
  },
  smtpUser: {
    doc: 'SMTP user',
    format: String,
    default: '',
    env: 'SMTP_USER'
  },
  smtpPass: {
    doc: 'SMTP password',
    format: String,
    default: '',
    env: 'SMTP_PASS',
    sensitive: true
  },
  useMongo: {
    doc: 'Use MongoDB',
    format: Boolean,
    default: false,
    env: 'USE_MONGO'
  },
  usePostgres: {
    doc: 'Use PostgreSQL',
    format: Boolean,
    default: true,
    env: 'USE_POSTGRES'
  },
  postgres: {
    host: {
      default: 'localhost',
      env: 'PG_HOST'
    },
    port: {
      default: 5432,
      env: 'PG_PORT'
    },
    user: {
      default: 'postgres',
      env: 'PG_USER'
    },
    password: {
      default: 'postgres',
      env: 'PG_PASSWORD',
      sensitive: true
    },
    database: {
      default: 'freelancer_db',
      env: 'PG_DATABASE'
    }
  },
  mongo: {
    uri: {
      default: 'mongodb://localhost:27017/freelancer_db',
      env: 'MONGO_URI'
    }
  },
  useS3: {
    doc: 'Use AWS S3',
    format: Boolean,
    default: false,
    env: 'USE_S3'
  },
  awsAccessKeyId: {
    doc: 'AWS access key ID',
    format: String,
    default: '',
    env: 'AWS_ACCESS_KEY_ID'
  },
  awsSecretAccessKey: {
    doc: 'AWS secret access key',
    format: String,
    default: '',
    env: 'AWS_SECRET_ACCESS_KEY',
    sensitive: true
  },
  s3Bucket: {
    doc: 'S3 bucket name',
    format: String,
    default: '',
    env: 'S3_BUCKET'
  }
});

// Load environment dependent configuration
let env = config.get('env');
config.loadFile('./config/' + env + '.json');

// Perform validation
config.validate({allowed: 'strict'});

module.exports = config;