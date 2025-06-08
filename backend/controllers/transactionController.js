import transactionModel from "../models/transactionModel.js";

export const getAllTransactions = async (req, res) => {
  try {
    const { startDate, endDate, paymentStatus } = req.query;
    let query = {};

    // Add date range filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime() + 86400000, // Add one day to include the end date
      };
    }

    // Add payment status filter
    if (paymentStatus && paymentStatus !== "all") {
      query.payment = paymentStatus === "true";
    }

    const transactions = await transactionModel.find(query).sort({ date: -1 }); // Sort by date in descending order

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionStats = async (req, res) => {
  try {
    // Get total transactions
    const totalTransactions = await transactionModel.countDocuments();

    // Get successful transactions
    const successfulTransactions = await transactionModel.countDocuments({
      payment: true,
    });

    // Get total revenue from successful transactions
    const totalRevenue = await transactionModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get total credits sold
    const totalCredits = await transactionModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$credits" } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalTransactions,
        successfulTransactions,
        failedTransactions: totalTransactions - successfulTransactions,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCredits: totalCredits[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
