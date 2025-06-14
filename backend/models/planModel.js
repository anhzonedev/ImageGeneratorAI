import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  credits: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
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
