import React from "react";
import { Link } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  DollarOutlined,
  PictureOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const items = [
  {
    key: "sub1",
    label: "Dashboard",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "dashboard",
        label: <Link to="/admin/dashboard">Dashboard</Link>,
        icon: <AppstoreOutlined />,
      },
      {
        key: "manageUsers",
        label: <Link to="/admin/manageUser">User Management</Link>,
        icon: <UserOutlined />,
      },
      {
        key: "transactions",
        label: <Link to="/admin/transactions">Transaction Management</Link>,
        icon: <DollarOutlined />,
      },
      {
        key: "analytics",
        label: <Link to="/admin/analytics">Image Analytics</Link>,
        icon: <PictureOutlined />,
      },
      {
        key: "plans",
        label: <Link to="/admin/plans">Plan Management</Link>,
        icon: <ShoppingOutlined />,
      },
    ],
  },
  { type: "divider" },
];

const SideBar = () => {
  return (
    <div className="fixed top-2 left-2 bottom-[30px] h-full w-1/6 p-2 bg-gradient-to-b from-gray-200 to-gray-100 overflow-hidden rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      <h1 className="text-center font-black text-2xl p-4 text-gray-800 flex-none">
        Trang Quản Trị
      </h1>
      <div className="flex-1 overflow-auto">
        <Menu
          className="w-full !bg-transparent !border-none"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
};

export default SideBar;
