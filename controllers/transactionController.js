const { validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

// Get all or filtered transactions
exports.getTransactions = async (req, res) => {
  const { startDate, endDate, category, description, page = 1, limit = 10 } = req.query;
  const filter = { userId: req.user.userId };
  if (startDate) filter.date = { ...filter.date, $gte: new Date(startDate) };
  if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
  if (category) filter.category = category;
  if (description) filter.description = { $regex: description, $options: 'i' };
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(filter)
    ]);
    res.json({
      transactions,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { date, description, amount, category, type } = req.body;
    const transaction = new Transaction({
      userId: req.user.userId,
      date,
      description,
      amount,
      category,
      type
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    res.json({ msg: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const update = req.body;
    update.updatedAt = new Date();
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      update,
      { new: true }
    );
    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Analytics: category summary
exports.categorySummary = async (req, res) => {
  const { month, year } = req.query;
  const match = { userId: req.user.userId };
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    match.date = { $gte: start, $lte: end };
  }
  try {
    const summary = await Transaction.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $project: { _id: 0, category: '$_id', total: 1 } }
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export filtered transactions as CSV
exports.exportTransactions = async (req, res) => {
  const { startDate, endDate, category, description } = req.query;
  const filter = { userId: req.user.userId };
  if (startDate) filter.date = { ...filter.date, $gte: new Date(startDate) };
  if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };
  if (category) filter.category = category;
  if (description) filter.description = { $regex: description, $options: 'i' };
  try {
    const transactions = await Transaction.find(filter).sort({ date: -1 });
    const fields = ['date', 'description', 'amount', 'category', 'type', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
