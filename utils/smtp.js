const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('./logger');

let transporter;

if (config.get('enableSmtp')) {
  transporter = nodemailer.createTransport({
    host: config.get('smtpHost'),
    port: config.get('smtpPort'),
    secure: config.get('smtpPort') === 465,
    auth: {
      user: config.get('smtpUser'),
      pass: config.get('smtpPass')
    }
  });
}

async function sendEmail(to, subject, text, html) {
  if (!config.get('enableSmtp') || !transporter) {
    logger.warn('SMTP not enabled');
    return;
  }

  try {
    await transporter.sendMail({
      from: config.get('smtpUser'),
      to,
      subject,
      text,
      html
    });
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error('Error sending email:', err);
    throw err;
  }
}

async function testEmail() {
  if (!config.get('enableSmtp') || !transporter) {
    logger.warn('SMTP not enabled');
    return;
  }

  try {
    await sendEmail('test@example.com', 'Test Email', 'This is a test email.', '<p>This is a test email.</p>');
    logger.info('Test email sent');
  } catch (err) {
    logger.error('Test email failed:', err);
  }
}

module.exports = { sendEmail, testEmail };