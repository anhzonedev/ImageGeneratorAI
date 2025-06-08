import mongoose from "mongoose";

const imageGenerationSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  creditsUsed: {
    type: Number,
    default: 1,
  },
  metadata: {
    model: {
      type: String,
      default: "clipdrop-v1",
    },
    processingTime: {
      type: Number,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for efficient querying
imageGenerationSchema.index({ createdAt: 1 });
imageGenerationSchema.index({ userID: 1 });
imageGenerationSchema.index({ status: 1 });
imageGenerationSchema.index({ "metadata.model": 1 });

const imageGenerationModel =
  mongoose.models.imageGeneration ||
  mongoose.model("imageGeneration", imageGenerationSchema);

export default imageGenerationModel;
