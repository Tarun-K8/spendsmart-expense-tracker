const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// @desc    Get financial analytics summary (Totals, Category Breakdown, Monthly Trends)
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Overall Balance, Income, Expense Aggregation
    const totalsAgg = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;

    totalsAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
    });

    const netBalance = totalIncome - totalExpense;

    // 2. Category Breakdown for Expenses (Aggregation Pipeline)
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          totalAmount: { $round: ['$totalAmount', 2] },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    // 3. Recent Monthly Trend Aggregation
    const monthlyTrend = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': -1,
          '_id.month': -1,
        },
      },
      { $limit: 12 },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: Number(totalIncome.toFixed(2)),
          totalExpense: Number(totalExpense.toFixed(2)),
          netBalance: Number(netBalance.toFixed(2)),
          savingsRate:
            totalIncome > 0
              ? Number((((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1))
              : 0,
        },
        categoryBreakdown,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalyticsSummary };
