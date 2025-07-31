const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.get('jwtSecret'), (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

function authenticateRefreshToken(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  jwt.verify(refreshToken, config.get('jwtRefreshSecret'), (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    req.user = user;
    next();
  });
}

function authorizeRole(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

module.exports = { authenticateToken, authenticateRefreshToken, authorizeRole }