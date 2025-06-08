import express from "express";
import {
  registerUser,
  loginUser,
  userCredits,
  paymenRazorpay,
  verifyRazorpay,
  getActivePlans,
} from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits", userAuth, userCredits);
userRouter.get("/plans", getActivePlans);
userRouter.post("/pay", userAuth, paymenRazorpay);
userRouter.post("/verypay", verifyRazorpay);

export default userRouter;
