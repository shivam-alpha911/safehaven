const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: verify Google ID token by calling Google's tokeninfo endpoint
const verifyGoogleToken = (idToken) => {
  return new Promise((resolve, reject) => {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const payload = JSON.parse(data);
          if (payload.error) return reject(new AppError(payload.error, 401));
          resolve(payload);
        } catch (e) {
          reject(new AppError('Failed to parse Google response', 500));
        }
      });
    }).on('error', () => reject(new AppError('Failed to contact Google servers', 500)));
  });
};

// POST /api/auth/signup
router.post('/signup', catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('All fields are required.', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  const token = generateToken(user);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
}));

// POST /api/auth/login
router.post('/login', catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const token = generateToken(user);

  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
}));

// POST /api/auth/google  — Google One Tap / Sign-In button
router.post('/google', catchAsync(async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    return next(new AppError('Google credential is required.', 400));
  }

  // Verify the ID token with Google
  const payload = await verifyGoogleToken(credential);
  const { sub: googleId, email, name, picture: avatar } = payload;

  if (!email) {
    return next(new AppError('Could not retrieve email from Google account.', 400));
  }

  // Find existing user by email or googleId, or create new one
  let user = await User.findOne({ $or: [{ email }, { googleId }] });

  if (user) {
    // Patch missing googleId/avatar if user previously signed up with email
    if (!user.googleId) user.googleId = googleId;
    if (!user.avatar && avatar) user.avatar = avatar;
    await user.save();
  } else {
    user = await User.create({ name, email, googleId, avatar });
  }

  const token = generateToken(user);
  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
}));

module.exports = router;

