const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/theme', auth, userController.updateTheme);

module.exports = router; 