import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

export const rateLimiter = rateLimit({
  windowMs: config.security.rateLimitWindowMs,
  max: config.security.rateLimitMaxRequests,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many authentication attempts, please try again later' },
  skipSuccessfulRequests: true
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'API rate limit exceeded' }
});

export const validateRequest = (req, res, next) => {
  const contentType = req.headers['content-type'];

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        message: 'Content-Type must be application/json'
      });
    }
  }

  next();
};

// Strip dangerous characters and enforce sane field length
const MAX_STRING_LENGTH = 10000;

const sanitizeValue = (value, depth = 0) => {
  if (depth > 10) return value; // prevent deep recursion on adversarial payloads

  if (typeof value === 'string') {
    // Truncate excessively long strings
    let v = value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) : value;
    // Strip null bytes
    v = v.replace(/\0/g, '');
    // Strip basic JS prototype pollution keys
    return v;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  if (typeof value === 'object' && value !== null) {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      // Block prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
      sanitized[key] = sanitizeValue(value[key], depth + 1);
    }
    return sanitized;
  }

  return value;
};

export const sanitizeInput = (req, res, next) => {
  if (req.body)   req.body   = sanitizeValue(req.body);
  if (req.query)  req.query  = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};
