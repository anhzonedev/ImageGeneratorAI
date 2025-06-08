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

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR", // Explicitly set currency to INR
      name: "Credits Payment",
      description: "Credits Payment",
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
      }
      const { data } = await axios.post(
        backendUrl + "/api/user/pay",
        { planID },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {}
  };
  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 mb-6 rounded-full">
        Kế hoạch
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Nâng cấp kế hoạch của bạn
      </h1>{" "}
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {loading ? (
          <div>Loading plans...</div>
        ) : (
          plans.map((item, index) => {
            return (
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
                  / {item.credits} Tín dụng
                </p>
                {item.features && (
                  <ul className="mt-4 list-disc list-inside text-sm">
                    {item.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => paymentRazorpay(item.name)}
                  className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 cursor-pointer"
                >
                  {user ? "Nâng Cấp" : "Bắt đầu"}
                </button>
              </div>
            );
          })
        )}
      </div>
      {/* <Modal
        title="Mua tín dụng tại đây"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="copy" onClick={handleCopyMessage} type="primary">
            Sao chép tin nhắn
          </Button>,
          <Button key="ok" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {selectedPlan && (
          <>
            <p className="text-sm text-gray-500">
              Quét mã QR Zalo liên hệ Admin để mua tín dụng
            </p>
            <div className="mt-6">
              <h2 className="text-center font-medium text-base">
                Nội dung nhắn tin để mua tín dụng
              </h2>
              <p className="text-sm text-gray-700 font-medium">
                Email đăng ký tài khoản: {email} <br />
                {`Chào Admin, tôi muốn mua gói ${
                  selectedPlan.id
                } với giá ${selectedPlan.price.toLocaleString(
                  "vi-VN"
                )} VNĐ VNĐ. Email đăng ký tài khoản của tôi: ${email}`}
              </p>
            </div>
            <h1 className="text-red-600 text-xl font-medium text-center mt-3">
              Lưu ý:
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Coppy đầy đủ nội dung tin nhắn để nạp tín dụng <br /> Chờ nhân
              viên phản hồi hướng dẫn nạp tiền và nhận tín dụng
            </p>

            <img
              className="mt-4 h-[500px] w-full rounded-4xl"
              src={assets.qr_code}
              alt=""
            />
          </>
        )}
      </Modal> */}
    </div>
  );
};

export default BuyCredit;
