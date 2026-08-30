import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/index.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.security.bcryptRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload, secret = config.jwt.secret, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret = config.jwt.secret) => {
  return jwt.verify(token, secret);
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
};

export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateNumericCode = (length = 6) => {
  const code = crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length));
  return code.toString();
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }
  
  return d.toISOString();
};

export const parseValue = (value, type) => {
  switch (type) {
    case 'number':
      return parseFloat(value) || 0;
    case 'boolean':
      return value === 'true' || value === true;
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    case 'date':
      return new Date(value);
    default:
      return value;
  }
};

export const sanitizeObject = (obj, allowedFields) => {
  return Object.keys(obj)
    .filter(key => allowedFields.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};
