const Transaction = require('../models/Transaction');
const { Parser } = require('json2csv');

exports.exportCSV = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    const fields = ['date', 'description', 'amount', 'category', 'type', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 