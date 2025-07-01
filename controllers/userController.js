const User = require('../models/User');

exports.updateTheme = async (req, res) => {
  const { theme } = req.body;
  if (!['dark', 'light'].includes(theme)) {
    return res.status(400).json({ error: 'Invalid theme' });
  }
  try {
    await User.findByIdAndUpdate(req.user.userId, { theme });
    res.json({ message: 'Theme updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 