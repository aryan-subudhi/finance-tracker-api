const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');
const userController = require('../controllers/userController');

// Get all or filtered transactions
router.get('/', auth, transactionController.getAll);

// Add a new transaction
router.post(
  '/',
  auth,
  [
    body('date').isISO8601(),
    body('description').notEmpty().trim().escape(),
    body('amount').isNumeric(),
    body('category').notEmpty().trim().escape(),
    body('type').isIn(['Income', 'Expense'])
  ],
  transactionController.create
);

// Delete a transaction
router.delete('/:id', auth, transactionController.delete);

// Update a transaction
router.put(
  '/:id',
  auth,
  [
    body('date').optional().isISO8601(),
    body('description').optional().trim().escape(),
    body('amount').optional().isNumeric(),
    body('category').optional().trim().escape(),
    body('type').optional().isIn(['Income', 'Expense'])
  ],
  transactionController.update
);

// Analytics: category summary
router.get(
  '/analytics/category-summary',
  auth,
  query('month').optional().isInt({ min: 1, max: 12 }),
  query('year').optional().isInt(),
  transactionController.categorySummary
);

// Export transactions as CSV
router.get('/export/csv', auth, transactionController.exportTransactions);

router.get('/theme', auth, userController.getTheme);
router.put('/theme', auth, userController.updateTheme);

module.exports = router;
