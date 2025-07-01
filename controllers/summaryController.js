const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user.userId;
  const match = { userId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    match.date = { $gte: start, $lte: end };
  }
  try {
    const transactions = await Transaction.find(match).sort({ date: -1 });
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((a, b) => a + b.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((a, b) => a + b.amount, 0);
    const balance = totalIncome - totalExpense;
    res.json({
      balance,
      totalIncome,
      totalExpense,
      recentTransactions: transactions.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.categorySummary = async (req, res) => {
  const { month, year } = req.query;
  const match = { userId: req.user.userId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    match.date = { $gte: start, $lte: end };
  }
  try {
    const summary = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { category: '$_id', total: 1, _id: 0 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
