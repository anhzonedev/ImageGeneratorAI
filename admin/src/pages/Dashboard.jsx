import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/admin/dashboard-stats`,
        {
          headers: { token },
        }
      );
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng doanh thu"
              value={(stats?.totalRevenue || 0).toLocaleString("vi-VN")}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
