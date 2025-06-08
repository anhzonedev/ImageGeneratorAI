import axios from "axios";
import userModel from "../models/userModel.js";
import imageGenerationModel from "../models/imageGenerationModel.js";
import FormData from "form-data";

export const generateImage = async (req, res) => {
  try {
    const startTime = Date.now();
    const { userID, prompt } = req.body;
    const user = await userModel.findById(userID);

    if (!user || !prompt) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "Số dư tín dụng không đủ! Vui lòng nâng cấp thêm.",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;
    await userModel.findByIdAndUpdate(userID, {
      creditBalance: user.creditBalance - 1,
    }); // Track the image generation with detailed logging
    const generationLog = await imageGenerationModel.create({
      userID,
      prompt,
      imageUrl: resultImage,
      creditsUsed: 1,
      metadata: {
        model: "clipdrop-v1",
        processingTime: Date.now() - startTime,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      },
    });

    res.json({
      success: true,
      message: "Tạo ảnh thành công",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    // Log the failed generation attempt
    await imageGenerationModel.create({
      userID,
      prompt,
      status: "failed",
      metadata: {
        model: "clipdrop-v1",
        processingTime: Date.now() - startTime,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
        error: error.message,
      },
    });

    res.json({ success: false, message: error.message });
  }
};
