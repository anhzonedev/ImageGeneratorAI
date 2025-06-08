import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import transactionModel from "../models/transactionModel.js";
import imageGenerationModel from "../models/imageGenerationModel.js";

export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password match the ones in .env
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate a token for the admin
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Thông tin đăng nhập không chính xác",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, creditBalance, isLocked } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { name, email, creditBalance, isLocked },
        { new: true }
      )
      .select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await userModel.findByIdAndDelete(userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Get total revenue
    const totalRevenue = await transactionModel.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await transactionModel.aggregate([
      { $match: { payment: true } },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$date" } },
            month: { $month: { $toDate: "$date" } },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    // Get new users count for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersCount = await userModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get total users count
    const totalUsers = await userModel.countDocuments();

    // Get active users (users who have generated images in last 30 days)
    const activeUsers = await imageGenerationModel
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: "$userID",
            imageCount: { $sum: 1 },
          },
        },
      ])
      .exec();

    // Get credit usage metrics
    const creditUsage = await userModel.aggregate([
      {
        $group: {
          _id: null,
          totalCredits: { $sum: "$creditBalance" },
          avgCredits: { $avg: "$creditBalance" },
        },
      },
    ]);

    // Get daily image generations for the last 30 days
    const dailyGenerations = await imageGenerationModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue,
        newUsersCount,
        totalUsers,
        activeUsersCount: activeUsers.length,
        creditStats: creditUsage[0] || { totalCredits: 0, avgCredits: 0 },
        dailyGenerations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
