const express = require('express');
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/transactions/csv', auth, exportController.exportCSV);

module.exports = router; 