import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  isPromotion: {
    type: Boolean,
    default: false,
  },
  promotionEndDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  features: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
planSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const planModel = mongoose.models.plan || mongoose.model("plan", planSchema);

export default planModel;
