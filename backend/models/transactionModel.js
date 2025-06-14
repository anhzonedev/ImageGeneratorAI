import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true }, // VND amount
  amountINR: { type: Number, required: true }, // INR amount
  credits: { type: Number, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number },
});

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);

export default transactionModel;
