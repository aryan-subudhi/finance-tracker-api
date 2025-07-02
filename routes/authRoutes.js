const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

// Register route
router.post(
  '/register',
  [
    body('username').notEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.register
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  authController.login
);

router.get('/theme', auth, authController.getTheme);
router.put('/theme', auth, authController.updateTheme);

module.exports = router;
