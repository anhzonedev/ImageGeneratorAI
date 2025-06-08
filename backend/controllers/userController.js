import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import planModel from "../models/planModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "Vui lòng điền đầy đủ thông tin",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Tài khoản không tồn tại" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      return res.json({
        success: false,
        message: "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại!",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userID } = req.body;
    const user = await userModel.findById(userID);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymenRazorpay = async (req, res) => {
  try {
    const { userID, planID } = req.body;
    const userData = await userModel.findById(userID);
    if (!userID || !planID) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }

    let credits, plan, amount, date;
    switch (planID) {
      case "Cơ bản":
        plan = "Cơ bản";
        credits = 100;
        amount = 10;
        break;
      case "Ưu tiên":
        plan = "Ưu tiên";
        credits = 500;
        amount = 50;
        break;
      case "Cao cấp":
        plan = "Cao cấp";
        credits = 5000;
        amount = 500;
        break;
      default:
        return res.json({ success: false, message: "Chưa chọn gói dùng" });
    }
    date = Date.now();

    const transactionData = {
      userID,
      plan,
      amount,
      credits,
      date,
    };

    const newTransaction = await transactionModel.create(transactionData);
    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR", // Explicitly set currency to INR
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      const transactionData = await transactionModel.findById(
        orderInfo.receipt
      );
      if (transactionData.payment) {
        return res.json({ success: false, message: "Thanh toán thất bại" });
      }
      const userData = await userModel.findById(transactionData.userID);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, { creditBalance });
      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });
      return res.json({ success: true, message: "Thanh toán thành công" });
    } else {
      return res.json({ success: false, message: "Thanh toán thất bại" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getActivePlans = async (req, res) => {
  try {
    const plans = await planModel
      .find({
        isActive: true,
        $or: [
          { isPromotion: false },
          {
            isPromotion: true,
            promotionEndDate: { $gt: new Date() },
          },
        ],
      })
      .sort({ price: 1 });

    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, userCredits, paymenRazorpay, verifyRazorpay };
