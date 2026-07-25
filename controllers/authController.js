const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Helper function to sign JWT tokens
const signToken = (id) => {
  // Validate JWT secret exists
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }

  const payload = { id };
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d' // Default to 90 days if not set
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// User signup
exports.signup = catchAsync(async (req, res, next) => {
  // Check if required fields are provided
  if (!req.body.email || !req.body.password || !req.body.passwordConfirm) {
    return next(new AppError('Email, password, and password confirmation are required', 400));
  }

  // Check if passwords match
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role || 'user'
  });

  // Generate JWT token
  const token = signToken(newUser._id);

  // Remove password from response
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

// User login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1 Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2 Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3 Generate token
  const token = signToken(user._id);

  // 4 Remove password from response
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

// Middleware to protect routes (for future use)
exports.protect = catchAsync(async (req, res, next) => {
  // 1 Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2 Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3 Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4 Grant access to protected route
  req.user = currentUser;
  next();
});

// Restrict to certain roles (for future use)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};