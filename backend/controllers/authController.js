// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const token = createToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true // Set to false if developing on HTTP
    });

    res.status(201).json({
      user: { username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or error occurred' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = createToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true // Set to false if developing on HTTP
    });

    res.status(200).json({
      user: { username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });
  res.json({ message: 'Logged out' });
};

exports.getUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
