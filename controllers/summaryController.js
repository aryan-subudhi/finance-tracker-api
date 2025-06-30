const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { month, year } = req.query;
  const match = { userId: req.user.userId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    match.date = { $gte: start, $lte: end };
  }
  try {
    const [income, expense, recentTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { ...match, type: 'Income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { ...match, type: 'Expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.find(match).sort({ date: -1 }).limit(5)
    ]);
    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;
    const balance = totalIncome - totalExpense;
    res.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
