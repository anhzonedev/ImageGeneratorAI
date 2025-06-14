import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Tag,
  Popconfirm,
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/plans`, {
        headers: { token },
      });
      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      message.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (values) => {
    try {
      // Ensure features is an array
      const formattedValues = {
        ...values,
        features: values.features ? values.features.split('\n').filter(f => f.trim()) : []
      };

      if (editingPlan) {
        const { data } = await axios.put(
          `${backendUrl}/api/admin/plans/${editingPlan._id}`,
          formattedValues,
          { headers: { token } }
        );
        if (data.success) {
          message.success("Plan updated successfully");
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/plans`,
          formattedValues,
          { headers: { token } }
        );
        if (data.success) {
          message.success("Plan created successfully");
        }
      }
      setModalVisible(false);
      form.resetFields();
      fetchPlans();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleDelete = async (planId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/plans/${planId}`,
        { headers: { token } }
      );
      if (data.success) {
        message.success("Plan deleted successfully");
        fetchPlans();
      }
    } catch (error) {
      message.error("Failed to delete plan");
    }
  };

  const handleToggleStatus = async (planId) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/plans/${planId}/toggle-status`,
        {},
        { headers: { token } }
      );
      if (data.success) {
        message.success("Plan status updated");
        fetchPlans();
      }
    } catch (error) {
      message.error("Failed to update plan status");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) => price.toLocaleString("vi-VN"),
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => (
        <Tag color={record.isPromotion ? "gold" : "green"}>
          {record.isPromotion ? "Promotion" : "Regular"}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isActive ? "success" : "error"}>
          {record.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPlan(record);
              form.setFieldsValue({
                ...record,
                promotionEndDate: record.promotionEndDate
                  ? moment(record.promotionEndDate)
                  : undefined,
                features: record.features?.join("\n"),
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            type={record.isActive ? "default" : "primary"}
            icon={
              record.isActive ? (
                <CloseCircleOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
            onClick={() => handleToggleStatus(record._id)}
          >
            {record.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this plan?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plan Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingPlan(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Add New Plan
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={plans}
        rowKey="_id"
      />

      <Modal
        title={editingPlan ? "Edit Plan" : "Create New Plan"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingPlan(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true, isPromotion: false }}
        >
          <Form.Item
            name="name"
            label="Plan Name"
            rules={[{ required: true, message: "Please input plan name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price (VNĐ)"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="credits"
            label="Credits"
            rules={[
              { required: true, message: "Please input credits amount!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="features" label="Features (One per line)">
            <Input.TextArea
              placeholder="Enter features, one per line"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="isPromotion"
            valuePropName="checked"
            label="Promotional Plan"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isPromotion !== currentValues.isPromotion
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("isPromotion") ? (
                <Form.Item name="promotionEndDate" label="Promotion End Date">
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked" label="Active">
            <Switch />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingPlan(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingPlan ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanManagement;
