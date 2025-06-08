import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Navbar = ({ setToken }) => {
  const nameEmail = localStorage.getItem("email");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("email");
    setToken("");
  };

  const location = useLocation();
  const path = location.pathname;
  const pathTitleMap = {
    "/admin/dashboard": "Dashboard",
    "/admin/add-seller": "Thêm Seller",
  };

  return (
    <div className="fixed top-2 left-[17.6667%] w-[80.888%] z-10 flex justify-between items-center bg-white/30 backdrop-blur-md px-6 py-2 border border-gray-200 rounded-2xl ">
      <div className="flex flex-col items-center justify-center gap-1">
        <Breadcrumb
          items={[
            {
              href: "/dashboard",
              title: <HomeOutlined />,
            },
            {
              title: pathTitleMap[path],
            },
          ]}
        />
        <h1 className="text-lg font-semibold text-gray-500">
          {pathTitleMap[path]}
        </h1>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <div className="flex flex-col items-start justify-center bg-red-500 py-1 px-4 rounded-2xl text-white">
          <h2 className="text-sm">TRANG QUẢN TRỊ DÀNH CHO ADMIN</h2>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <div className="flex flex-col items-start justify-center bg-gray-300 py-1 px-4 rounded-2xl text-gray-800">
          <h2 className="text-sm">{nameEmail}</h2>
          <p className="font-semibold text-blue-600 text-base">HI ADMIN</p>
        </div>
        <div className="relative inline-block group text-gray-500">
          <FaRegUserCircle className="cursor-pointer transition duration-300 group-hover:text-gray-800 text-2xl" />
          {/* Popup */}
          <div className="absolute right-[-24px] top-full mt-2 w-48 rounded-lg bg-white p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 shadow-lg text-sm">
            <div className="flex flex-col justify-center items-start">
              <div className="flex items-center gap-6 cursor-pointer w-full hover:bg-gray-200 p-1 px-4 rounded-sm transition-all duration-300 hover:text-gray-800">
                <FaRegUserCircle />
                <p>Profile</p>
              </div>
              <div className="flex items-center gap-6 cursor-pointer w-full hover:bg-gray-200 p-1 px-4 rounded-sm transition-all duration-300 hover:text-gray-800">
                <FaSignOutAlt />
                <p onClick={() => logout()}>Đăng xuất</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
