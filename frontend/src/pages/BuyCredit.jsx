import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { Button, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const BuyCredit = () => {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/api/user/plans");
        if (data.success) {
          setPlans(data.plans);
        } else {
          toast.error("Failed to fetch plans");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching plans");
        setLoading(false);
      }
    };

    fetchPlans();
  }, [backendUrl]);

  const initPay = async (order, originalAmount) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount, // This is in paise (INR)
      currency: "INR",
      name: "Credits Payment",
      description: `Payment for ${originalAmount.toLocaleString("vi-VN")} VND`,
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verypay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            loadCreditsData();
            navigate("/");
            toast.success("Thanh toán thành công");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planID) => {
    try {
      if (!user) {
        setShowLogin(true);
        return;
      }
      const { data } = await axios.post(
        backendUrl + "/api/user/pay",
        { planID },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order, data.originalAmount);
      }
    } catch (error) {
      toast.error("Payment initialization failed");
    }
  };
  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 mb-6 rounded-full">
        Gói dịch vụ
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Nâng cấp gói dịch vụ của bạn
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {loading ? (
          <div>Đang tải gói dịch vụ...</div>
        ) : (
          plans.map((item, index) => (
            <div
              key={index}
              className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            >
              <img src={assets.lock_icon} alt="" />
              <p className="mt-3 mb-1 font-semibold">{item.name}</p>
              <p className="text-sm">{item.description}</p>
              <p className="mt-6">
                <span className="text-3xl font-semibold">
                  {item.price.toLocaleString("vi-VN")} VNĐ
                </span>
                <br />
                <span className="text-base">{item.credits} Tín dụng</span>
              </p>
              <button
                onClick={() => paymentRazorpay(item._id)}
                className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer"
              >
                {user ? "Nâng cấp ngay" : "Bắt đầu"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyCredit;
