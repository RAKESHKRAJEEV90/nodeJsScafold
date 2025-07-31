const { query, getClient } = require('../utils/db');
const mongoose = require('mongoose');
const config = require('../config');
const bcrypt = require('bcrypt');

// MongoDB Schema
let UserSchema;
if (config.get('useMongo')) {
  UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true, required: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: 'user' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model('User', UserSchema);
} else {
  // PostgreSQL functions
  async function createUser(first_name, last_name, email, password) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const res = await query(
      'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, password_hash]
    );
    return res.rows[0];
  }

  async function findUserByEmail(email) {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }

  async function findUserById(id) {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0];
  }

  module.exports = { createUser, findUserByEmail, findUserById };
}