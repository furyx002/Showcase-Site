const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'snooker_club_furyisop56_secret_key_2026';

// Pre-seeded Admin Credentials as requested:
// Email: admin@sanitary.com
// Password: furyisop56
const ADMIN_EMAIL = 'admin@sanitary.com';
const ADMIN_RAW_PASS = 'furyisop56';

let memoryAdminUser = null;

async function seedAdminUser() {
  const hashedPassword = await bcrypt.hash(ADMIN_RAW_PASS, 10);
  
  memoryAdminUser = {
    _id: 'admin_user_001',
    name: 'Sanitary Store Admin',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'ADMIN'
  };

  if (getIsConnected()) {
    try {
      const existing = await User.findOne({ email: ADMIN_EMAIL });
      if (!existing) {
        await User.create({
          name: 'Sanitary Store Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'ADMIN'
        });
        console.log(`[Auth Init] Admin account seeded: ${ADMIN_EMAIL}`);
      } else {
        // Ensure password matches requested furyisop56
        existing.password = hashedPassword;
        await existing.save();
        console.log(`[Auth Init] Admin password updated for: ${ADMIN_EMAIL}`);
      }
    } catch (err) {
      console.warn('[Auth Init Warning] Could not seed admin in MongoDB:', err.message);
    }
  } else {
    console.log(`[Auth Init Memory] Admin account ready: ${ADMIN_EMAIL}`);
  }
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cleanEmail = email.toLowerCase().trim();
  let userObj = null;

  if (getIsConnected()) {
    try {
      userObj = await User.findOne({ email: cleanEmail });
    } catch (e) {}
  }

  if (!userObj && memoryAdminUser && memoryAdminUser.email === cleanEmail) {
    userObj = memoryAdminUser;
  }

  if (!userObj) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, userObj.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  // Generate JWT Token (valid 7 days)
  const token = jwt.sign(
    { userId: userObj._id, email: userObj.email, role: userObj.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      role: userObj.role
    }
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  seedAdminUser,
  loginUser,
  verifyToken
};
