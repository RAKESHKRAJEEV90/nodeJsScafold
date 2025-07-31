const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../config');

const enableLogger = config.get('enableLogger');
const logRotationDays = config.get('logRotationDays');

let transports = [];

if (enableLogger) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  );

  transports.push(
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: `${logRotationDays}d`
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
  silent: !enableLogger
});

module.exports = logger;