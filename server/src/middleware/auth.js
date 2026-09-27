const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'honeychain_hackathon_super_secret_key_2026';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Fallback to demo beekeeper user if unauthenticated for instant hackathon demo access
    try {
      const userRes = await db.query('SELECT * FROM users WHERE email = $1', ['beekeeper@honeychain.io']);
      if (userRes.rows.length > 0) {
        const u = userRes.rows[0];
        req.user = { id: u.id, email: u.email, name: u.name, role: u.role };
        return next();
      }
    } catch {
      // Continue to default fallback
    }

    req.user = {
      id: 'demo-beekeeper-id',
      email: 'beekeeper@honeychain.io',
      name: 'Ramesh Patel (Master Beekeeper)',
      role: 'beekeeper'
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = {
        id: 'demo-beekeeper-id',
        email: 'beekeeper@honeychain.io',
        name: 'Ramesh Patel (Master Beekeeper)',
        role: 'beekeeper'
      };
      return next();
    }

    req.user = user;
    next();
  });
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Authentication required'
      });
    }

    const userRole = req.user.role || 'beekeeper';
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        data: null,
        error: `Role '${userRole}' is not authorized to perform this action`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
  JWT_SECRET
};
