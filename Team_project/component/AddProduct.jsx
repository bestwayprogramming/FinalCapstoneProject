import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, resetProduct } from "../feature/product/productSlice";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Spin,
  Image,
  Row,
  Col,
} from "antd"; // <-- Import Image here
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { categories, COLORS, conditions, SIZES, types } from "../Constant/const";
import Notify from "./Notify";
import { Navigate } from "react-router-dom";

const { Option } = Select;

// Function to generate a random 7-character alphanumeric ID
const generateProductId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProduct = () => {
  const dispatch = useDispatch();
  const username = localStorage.getItem("user");
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  
  const productIntial = useSelector((state) => state.product.product);
  const loading = useSelector((state) => state.product.loading);

  const [product, setProductState] = useState({
    ...productIntial,
    owner: username,
    id: generateProductId(), 
  });

  const [fileList, setFileList] = useState([]);

  const handleChange = (name, value) => {
    setProductState({ ...product, [name]: value });
  };

  const handleFileChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const imagePromises = newFileList.map(async (file) => {
      if (file.originFileObj) {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }
      return null;
    });

    const imageDataUrls = (await Promise.all(imagePromises)).filter(Boolean);
    setProductState({ ...product, images: imageDataUrls });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleSubmit = async () => {
    if (!product.images || product.images.length === 0) {
      Notify({
        type: "error",
        message: "Image Required",
        description: "Please upload at least one image.",
      });
      return;
    }

    try {
      const response = await dispatch(addProduct(product)).unwrap();
      Notify({
        type: "success",
        message: "Product Added",
        description: response.message,
      });

      form.resetFields();
      dispatch(resetProduct());
      setProductState({ ...productIntial, images: [] });
      setFileList([]);
      
    } catch (error) {
      Notify({
        type: "error",
        message: "Error Adding Product",
        description:
          error.message || "An error occurred while adding the product.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 rounded-lg">
      <Spin spinning={loading} tip="Adding product...">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24} md={12}>
              <Form.Item label="Logged-in User">
                <Input value={username} readOnly />
              </Form.Item>

              <Form.Item
                label="Product ID"
                name="id"
                initialValue={product.id} // Set product ID here
                rules={[{ required: true }]}
              >
                <Input value={product.id} readOnly />
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input
                  value={product.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Image Alt Text"
                name="imageAlt"
                rules={[{ required: true }]}
              >
                <Input
                  value={product.imageAlt}
                  onChange={(e) => handleChange("imageAlt", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true }]}
              >
                <Input
                  type="text"
                  value={product.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  rows={4}
                  value={product.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={24} md={12}>
              <Form.Item label="Product Image">
                <ImgCrop rotationSlider>
                  <Upload
                    name="file"
                    beforeUpload={() => false} // Disable auto-upload, handle manually
                    fileList={fileList}
                    onChange={handleFileChange}
                    onPreview={handlePreview}
                    listType="picture-card"
                    accept="image/*"
                  >
                    {fileList.length < 5 && "+ Upload"}
                  </Upload>
                </ImgCrop>

                {previewImage && (
                  <Image
                    width={200}
                    height={200}
                    src={previewImage}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Colors"
                name="color"
                rules={[{ required: true }]}
              >
                <Select
                  mode="tags"
                  placeholder="Add colors"
                  value={product.color}
                  onChange={(value) => handleChange("color", value)}
                  size="large"
                >
                  {COLORS.map(({ name, hex }) => (
                    <Option key={name} value={name}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: hex,
                          marginRight: 8,
                        }}
                      />
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Sizes"
                name="sizes"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select sizes"
                  value={product.sizes}
                  onChange={(value) => handleChange("sizes", value)}
                  size="large"
                >
                  {SIZES.map((size) => (
                    <Option key={size} value={size.name}>
                      {size.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                <Select
                  placeholder="Select type"
                  value={product.type}
                  onChange={(value) => handleChange("type", value)}
                  size="large"
                >
                  {types.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Condition"
                name="condition"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select condition"
                  value={product.condition}
                  onChange={(value) => handleChange("condition", value)}
                  size="large"
                >
                  {conditions.map((condition) => (
                    <Option key={condition} value={condition}>
                      {condition}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select category"
                  value={product.category}
                  onChange={(value) => handleChange("category", value)}
                  size="large"
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="w-full flex justify-center">
            <Button type="primary" htmlType="submit" size="large">
              Add Product
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default AddProduct;
