import planModel from "../models/planModel.js";

// Get all plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await planModel.find().sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new plan
export const createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      credits,
      description,
      isPromotion,
      promotionEndDate,
      features,
    } = req.body;

    const plan = await planModel.create({
      name,
      price,
      credits,
      description,
      isPromotion,
      promotionEndDate,
      features,
    });

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update plan
export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updateData = req.body;

    const plan = await planModel.findByIdAndUpdate(planId, updateData, {
      new: true,
    });

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete plan
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await planModel.findByIdAndDelete(planId);

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle plan status (active/inactive)
export const togglePlanStatus = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await planModel.findById(planId);

    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found" });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
