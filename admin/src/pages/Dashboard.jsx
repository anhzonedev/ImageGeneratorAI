import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Space, Table } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  PictureOutlined,
  CrownOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Line } from "@ant-design/charts";
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
      {" "}
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      {/* Revenue and User Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={(stats?.totalRevenue || 0).toLocaleString("vi-VN")}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="New Users (30 days)"
              value={stats?.newUsersCount || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Active Users (30 days)"
              value={stats?.activeUsersCount || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>
      {/* Credit Usage Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Credits in Circulation"
              value={Math.round(stats?.creditStats?.totalCredits || 0)}
              prefix={<CrownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Average Credits per User"
              value={Math.round(stats?.creditStats?.avgCredits || 0)}
              prefix={<CrownOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Images Generated (30 days)"
              value={
                stats?.dailyGenerations?.reduce(
                  (acc, curr) => acc + curr.count,
                  0
                ) || 0
              }
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
