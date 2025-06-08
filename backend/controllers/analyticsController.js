import imageGenerationModel from "../models/imageGenerationModel.js";
import userModel from "../models/userModel.js";

// Get overall statistics
export const getImageGenerationStats = async (req, res) => {
  try {
    const totalImages = await imageGenerationModel.countDocuments();
    const totalCreditsUsed = await imageGenerationModel.aggregate([
      { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
    ]);

    const uniqueUsers = await imageGenerationModel.distinct("userID");

    res.json({
      success: true,
      stats: {
        totalImages,
        totalCreditsUsed: totalCreditsUsed[0]?.total || 0,
        uniqueUsers: uniqueUsers.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get time-based trends
export const getImageGenerationTrends = async (req, res) => {
  try {
    const { period } = req.query; // 'daily', 'weekly', or 'monthly'
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const trends = await imageGenerationModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          creditsUsed: { $sum: "$creditsUsed" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get most active users
export const getMostActiveUsers = async (req, res) => {
  try {
    const activeUsers = await imageGenerationModel.aggregate([
      {
        $group: {
          _id: "$userID",
          totalImages: { $sum: 1 },
          totalCredits: { $sum: "$creditsUsed" },
        },
      },
      { $sort: { totalImages: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          totalImages: 1,
          totalCredits: 1,
          name: { $arrayElemAt: ["$userDetails.name", 0] },
          email: { $arrayElemAt: ["$userDetails.email", 0] },
        },
      },
    ]);

    res.json({ success: true, activeUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get popular prompts
export const getPopularPrompts = async (req, res) => {
  try {
    const popularPrompts = await imageGenerationModel.aggregate([
      {
        $group: {
          _id: "$prompt",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, popularPrompts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllGeneratedImages = async (req, res) => {
  try {
    const { page = 1, pageSize = 12, status } = req.query;
    const skip = (page - 1) * pageSize;

    let query = {};
    if (status) {
      query.status = status;
    }

    const [images, total] = await Promise.all([
      imageGenerationModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(pageSize))
        .populate("userID", "name email"),
      imageGenerationModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      images,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
