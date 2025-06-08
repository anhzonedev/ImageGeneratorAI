import express from "express";
import {
  adminLogin,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";
import {
  getAllTransactions,
  getTransactionStats,
} from "../controllers/transactionController.js";
import {
  getImageGenerationStats,
  getImageGenerationTrends,
  getMostActiveUsers,
  getPopularPrompts,
  getAllGeneratedImages,
} from "../controllers/analyticsController.js";
import { getDashboardStats } from "../controllers/adminController.js";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
} from "../controllers/planController.js";
import adminAuth from "../middlewares/adminAuth.js";

const adminRouter = express.Router();

// Admin auth routes
adminRouter.post("/login-admin", adminLogin);

// User management routes
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.put("/user/:userId", adminAuth, updateUser);
adminRouter.delete("/user/:userId", adminAuth, deleteUser);

// Transaction routes
adminRouter.get("/transactions", adminAuth, getAllTransactions);
adminRouter.get("/transaction-stats", adminAuth, getTransactionStats);

// Analytics routes
adminRouter.get("/analytics/stats", adminAuth, getImageGenerationStats);
adminRouter.get("/analytics/trends", adminAuth, getImageGenerationTrends);
adminRouter.get("/analytics/active-users", adminAuth, getMostActiveUsers);
adminRouter.get("/analytics/popular-prompts", adminAuth, getPopularPrompts);
adminRouter.get(
  "/analytics/generated-images",
  getAllGeneratedImages
);
adminRouter.get("/dashboard-stats", adminAuth, getDashboardStats);

// Plan management routes
adminRouter.get("/plans", adminAuth, getAllPlans);
adminRouter.post("/plans", adminAuth, createPlan);
adminRouter.put("/plans/:planId", adminAuth, updatePlan);
adminRouter.delete("/plans/:planId", adminAuth, deletePlan);
adminRouter.patch("/plans/:planId/toggle-status", adminAuth, togglePlanStatus);

export default adminRouter;
