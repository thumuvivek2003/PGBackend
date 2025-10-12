const User = require('../models/User');
const { asyncHandler } = require('../middlewares/errorHandler');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role
  });

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Set token in HttpOnly cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "Strict", // CSRF protection
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      // token removed from response for security
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Set token in HttpOnly cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
      // token removed from response
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
