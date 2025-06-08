import React, { useState, useEffect } from "react";
import {
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { token },
      });
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      creditBalance: user.creditBalance,
      isLocked: user.isLocked,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (userId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/user/${userId}`,
        { headers: { token } }
      );
      if (data.success) {
        message.success("User deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleUpdate = async (values) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/user/${selectedUser._id}`,
        values,
        { headers: { token } }
      );
      if (data.success) {
        message.success("User updated successfully");
        setEditModalVisible(false);
        fetchUsers();
      }
    } catch (error) {
      message.error("Failed to update user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Credits",
      dataIndex: "creditBalance",
      key: "creditBalance",
    },
    {
      title: "Status",
      dataIndex: "isLocked",
      key: "isLocked",
      render: (isLocked) => (
        <span className={isLocked ? "text-red-500" : "text-green-500"}>
          {isLocked ? "Locked" : "Active"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Table
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey="_id"
      />

      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please input valid email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="creditBalance"
            label="Credits"
            rules={[{ required: true, message: "Please input credits!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="isLocked"
            label="Lock Account"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
