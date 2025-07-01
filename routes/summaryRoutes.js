const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const auth = require('../middleware/auth');
const summaryController = require('../controllers/summaryController');

router.get(
  '/',
  auth,
  [query('month').optional().isInt({ min: 1, max: 12 }), query('year').optional().isInt()],
  summaryController.getSummary
);

router.get('/category-summary', auth, summaryController.categorySummary);

module.exports = router;
