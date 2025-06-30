const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// Get all or filtered transactions
router.get('/', auth, transactionController.getTransactions);

// Add a new transaction
router.post(
  '/',
  auth,
  [
    body('date').isISO8601(),
    body('description').isString().notEmpty(),
    body('amount').isNumeric(),
    body('category').isString().notEmpty(),
    body('type').isIn(['Income', 'Expense'])
  ],
  transactionController.addTransaction
);

// Delete a transaction
router.delete('/:id', auth, transactionController.deleteTransaction);

// Update a transaction
router.put(
  '/:id',
  auth,
  [
    body('date').optional().isISO8601(),
    body('description').optional().isString().notEmpty(),
    body('amount').optional().isNumeric(),
    body('category').optional().isString().notEmpty(),
    body('type').optional().isIn(['Income', 'Expense'])
  ],
  transactionController.updateTransaction
);

// Analytics: category summary
router.get(
  '/analytics/category-summary',
  auth,
  [query('month').optional().isInt({ min: 1, max: 12 }), query('year').optional().isInt()],
  transactionController.categorySummary
);

// Export transactions as CSV
router.get('/export/csv', auth, transactionController.exportTransactions);

module.exports = router;
