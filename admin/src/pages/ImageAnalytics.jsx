import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Statistic, List, DatePicker, Tabs } from "antd";
import GeneratedImages from "../components/GeneratedImages";
import { Line } from "@ant-design/plots";
import {
  PictureOutlined,
  UserOutlined,
  FireOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

const ImageAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [popularPrompts, setPopularPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, trendsRes, usersRes, promptsRes] = await Promise.all([
        axios.get(`${backendUrl}/api/admin/analytics/stats`, {
          headers: { token },
        }),
        axios.get(`${backendUrl}/api/admin/analytics/trends`, {
          headers: { token },
        }),
        axios.get(`${backendUrl}/api/admin/analytics/active-users`, {
          headers: { token },
        }),
        axios.get(`${backendUrl}/api/admin/analytics/popular-prompts`, {
          headers: { token },
        }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (trendsRes.data.success) {
        const formattedTrends = trendsRes.data.trends.map((trend) => ({
          date: moment(
            `${trend._id.year}-${trend._id.month}-${trend._id.day}`
          ).format("YYYY-MM-DD"),
          value: trend.count,
        }));
        setTrends(formattedTrends);
      }
      if (usersRes.data.success) setActiveUsers(usersRes.data.activeUsers);
      if (promptsRes.data.success)
        setPopularPrompts(promptsRes.data.popularPrompts);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const config = {
    data: trends,
    xField: "date",
    yField: "value",
    smooth: true,
    areaStyle: {
      fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
    },
  };

  const activeUsersColumns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Total Images",
      dataIndex: "totalImages",
      key: "totalImages",
      sorter: (a, b) => a.totalImages - b.totalImages,
    },
    {
      title: "Credits Used",
      dataIndex: "totalCredits",
      key: "totalCredits",
      sorter: (a, b) => a.totalCredits - b.totalCredits,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Image Generation Analytics</h1>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Images Generated"
              value={stats?.totalImages || 0}
              prefix={<PictureOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Credits Used"
              value={stats?.totalCreditsUsed || 0}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Unique Users"
              value={stats?.uniqueUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Most Active Users */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <>
                <CrownOutlined /> Most Active Users
              </>
            }
            loading={loading}
          >
            <Table
              columns={activeUsersColumns}
              dataSource={activeUsers}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>

        {/* Popular Prompts */}
        <Col xs={24} lg={10}>
          <Card title="Popular Prompts" loading={loading}>
            <List
              dataSource={popularPrompts}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <span className="text-lg font-bold">#{index + 1}</span>
                    }
                    title={item._id}
                    description={`Used ${item.count} times`}
                  />
                </List.Item>
              )}
            />{" "}
          </Card>
        </Col>
      </Row>

      {/* Add Generated Images Section */}
      <Tabs
        defaultActiveKey="analytics"
        items={[
          {
            key: "analytics",
            label: "Analytics Overview",
            children: null,
          },
          {
            key: "images",
            label: "Generated Images",
            children: <GeneratedImages />,
          },
        ]}
      />
    </div>
  );
};

export default ImageAnalytics;
