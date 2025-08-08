const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//singup route for registration
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //hashed the password
    const hashed = await bcrypt.hash(password, 10);
    //create user with hashed password
    const user = await User.create({ username, email, password: hashed });

    //create token useing user-id
    const token = createToken(user._id);
    //send cookie
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });
    res.status(201).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or error occurred' });
  }
};

//login route
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// logout route
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

//get the user after login or singup
exports.getUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
