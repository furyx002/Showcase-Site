const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'snooker_club_furyisop56_secret_key_2026';

// Pre-seeded Admin Credentials:
// ID / Email: huzaifashah
// Password: huzaifashah01
const ADMIN_EMAIL = 'huzaifashah';
const ADMIN_RAW_PASS = 'huzaifashah01';

let memoryAdminUser = null;

async function seedAdminUser() {
  const hashedPassword = await bcrypt.hash(ADMIN_RAW_PASS, 10);
  
  memoryAdminUser = {
    _id: 'admin_user_001',
    name: 'Huzaifa Shah',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'ADMIN'
  };

  if (getIsConnected()) {
    try {
      // Remove any old legacy admin accounts
      await User.deleteMany({ email: 'admin@sanitary.com' });

      const existing = await User.findOne({ 
        $or: [
          { email: ADMIN_EMAIL },
          { email: 'huzaifashah@gmail.com' }
        ] 
      });

      if (!existing) {
        await User.create({
          name: 'Huzaifa Shah',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'ADMIN'
        });
        console.log(`[Auth Init] Admin account seeded: ${ADMIN_EMAIL}`);
      } else {
        existing.name = 'Huzaifa Shah';
        existing.email = ADMIN_EMAIL;
        existing.password = hashedPassword;
        await existing.save();
        console.log(`[Auth Init] Admin credentials updated for: ${ADMIN_EMAIL}`);
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
    throw new Error('ID/Email and password are required.');
  }

  const cleanEmail = email.toLowerCase().trim();
  let userObj = null;

  if (getIsConnected()) {
    try {
      userObj = await User.findOne({ 
        $or: [
          { email: cleanEmail },
          { email: ADMIN_EMAIL }
        ]
      });
    } catch (e) {}
  }

  if (!userObj && memoryAdminUser && (cleanEmail === ADMIN_EMAIL || cleanEmail === 'huzaifashah@gmail.com' || cleanEmail === 'admin@sanitary.com')) {
    userObj = memoryAdminUser;
  }

  if (!userObj) {
    throw new Error('Invalid ID or password.');
  }

  const isMatch = await bcrypt.compare(password, userObj.password);
  if (!isMatch) {
    throw new Error('Invalid ID or password.');
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
