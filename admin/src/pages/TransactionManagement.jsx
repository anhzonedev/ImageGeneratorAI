import React, { useState, useEffect } from "react";
import { Table, DatePicker, Space, Select, Tag } from "antd";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("all");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchTransactions = async (filters = {}) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/transactions`, {
        headers: { token },
        params: filters,
      });
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      fetchTransactions({
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
        paymentStatus,
      });
    }
  };

  const handleStatusChange = (value) => {
    setPaymentStatus(value);
    const filters = { paymentStatus: value === "all" ? null : value };
    if (dateRange) {
      filters.startDate = dateRange[0].format("YYYY-MM-DD");
      filters.endDate = dateRange[1].format("YYYY-MM-DD");
    }
    fetchTransactions(filters);
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
      width: 220,
    },
    {
      title: "User",
      dataIndex: "userID",
      key: "userID",
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => <Tag color="blue">{plan}</Tag>,
    },
    {
      title: "Amount (VNĐ)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toLocaleString("vi-VN") + " VND",
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Status",
      dataIndex: "payment",
      key: "payment",
      render: (payment) => (
        <Tag color={payment ? "success" : "error"}>
          {payment ? "Successful" : "Failed"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Transaction Management</h1>
        <Space size="large">
          <RangePicker onChange={handleDateRangeChange} />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Option value="all">All Status</Option>
            <Option value="true">Successful</Option>
            <Option value="false">Failed</Option>
          </Select>
        </Space>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={transactions}
        rowKey="_id"
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default TransactionManagement;
