import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Image,
  Tag,
  Select,
  Modal,
  Descriptions,
  Spin,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const GeneratedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState("all");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const fetchImages = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const params = {
        page,
        pageSize: pagination.pageSize,
        ...(status !== "all" && { status }),
      };

      const { data } = await axios.get(
        `${backendUrl}/api/admin/analytics/generated-images`,
        {
          headers: { token },
          params,
        }
      );

      if (data.success) {
        setImages(data.images);
        setPagination({
          ...pagination,
          current: data.pagination.page,
          total: data.pagination.total,
        });
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1, status);
  }, [status]);

  const handlePageChange = (page) => {
    fetchImages(page, status);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const showImageDetails = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Generated Images</h2>
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={handleStatusChange}
        >
          <Option value="all">All Status</Option>
          <Option value="success">Success</Option>
          <Option value="failed">Failed</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {images.map((image) => (
              <Col xs={24} sm={12} md={8} lg={6} key={image._id}>
                <Card
                  hoverable
                  onClick={() => showImageDetails(image)}
                  cover={
                    image.status === "success" ? (
                      <Image
                        alt={image.prompt}
                        src={image.imageUrl}
                        className="h-48 object-cover"
                        fallback="data:image/png;base64,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"
                      />
                    ) : (
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <CloseCircleOutlined className="text-red-500 text-2xl" />
                      </div>
                    )
                  }
                >
                  <Card.Meta
                    title={
                      <div className="flex justify-between items-center">
                        <span className="truncate">{image.userID?.name}</span>
                        <Tag
                          color={
                            image.status === "success" ? "success" : "error"
                          }
                        >
                          {image.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <p className="truncate text-gray-500">
                        {moment(image.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </p>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>

          <Modal
            title="Image Details"
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
          >
            {selectedImage && (
              <div>
                <div className="mb-4">
                  {selectedImage.status === "success" ? (
                    <Image
                      alt={selectedImage.prompt}
                      src={selectedImage.imageUrl}
                      className="w-full"
                    />
                  ) : (
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <CloseCircleOutlined className="text-red-500 text-2xl" />
                    </div>
                  )}
                </div>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="User">
                    {selectedImage.userID?.name} ({selectedImage.userID?.email})
                  </Descriptions.Item>
                  <Descriptions.Item label="Prompt">
                    {selectedImage.prompt}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      color={
                        selectedImage.status === "success" ? "success" : "error"
                      }
                    >
                      {selectedImage.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Credits Used">
                    {selectedImage.creditsUsed}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {moment(selectedImage.createdAt).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )}
                  </Descriptions.Item>
                  {selectedImage.metadata && (
                    <>
                      <Descriptions.Item label="Processing Time">
                        {selectedImage.metadata.processingTime}ms
                      </Descriptions.Item>
                      <Descriptions.Item label="Model">
                        {selectedImage.metadata.model}
                      </Descriptions.Item>
                    </>
                  )}
                </Descriptions>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default GeneratedImages;
