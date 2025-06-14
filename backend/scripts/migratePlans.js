import mongoose from "mongoose";
import "dotenv/config";
import planModel from "../models/planModel.js";

const plans = [
  {
    name: "Cơ bản",
    price: 10000,
    credits: 100,
    description: "Sử dụng tốt cho cá nhân.",
    isActive: true,
    features: ["Tạo hình ảnh AI", "100 Credits", "Hỗ trợ qua email"],
  },
  {
    name: "Ưu tiên",
    price: 50000,
    credits: 500,
    description: "Tốt nhất dành cho kinh doanh.",
    isActive: true,
    features: [
      "Tất cả tính năng Cơ bản",
      "500 Credits",
      "Ưu tiên hỗ trợ",
      "Tùy chỉnh nâng cao",
    ],
  },
  {
    name: "Cao cấp",
    price: 250000,
    credits: 5000,
    description: "Tốt nhất cho doanh nghiệm sử dụng.",
    isActive: true,
    features: [
      "Tất cả tính năng Ưu tiên",
      "5000 Credits",
      "Hỗ trợ 24/7",
      "API access",
      "Tùy chỉnh theo yêu cầu",
    ],
  },
];

const validatePlans = (plans) => {
  return plans.every((plan) => {
    return (
      plan.name &&
      typeof plan.price === "number" &&
      typeof plan.credits === "number" &&
      plan.description &&
      Array.isArray(plan.features) &&
      plan.features.length > 0
    );
  });
};

const migratePlans = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    if (!validatePlans(plans)) {
      throw new Error("Invalid plan data structure");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing plans
    const deleteResult = await planModel.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing plans`);

    // Insert new plans
    const result = await planModel.insertMany(plans);
    console.log(`Successfully inserted ${result.length} plans:`);
    result.forEach((plan) => {
      console.log(
        `- ${plan.name}: ${plan.credits} credits at ${plan.price} VND`
      );
    });

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

migratePlans();
