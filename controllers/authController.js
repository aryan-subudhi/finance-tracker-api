const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
// ...other routes

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
// ...other routes

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({ username, email, passwordHash });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getTheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ theme: user.theme });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateTheme = async (req, res) => {
  const { theme } = req.body;
  if (!['dark', 'light'].includes(theme)) {
    return res.status(400).json({ msg: 'Invalid theme value' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { theme },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ theme: user.theme });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
