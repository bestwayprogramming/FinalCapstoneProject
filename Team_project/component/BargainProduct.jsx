import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Image } from "antd";
import {
  COLORS,
  mapColorsToHex,
  mapColorsToHexAndName,
  mapSizesToStock,
} from "../Constant/const";

const { Option } = Select;

const BargainProduct = ({ open, onClose, product, userType, onSend }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const user = localStorage.getItem("user")

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        color: [],
        sizes: [],
      });

      if (product.images) {
        const existingImages = product.images.map((url, index) => ({
          uid: `-image-${index}`,
          name: `Image-${index + 1}`,
          url,
          status: "done",
        }));
        setFileList(existingImages);
      }
    }
  }, [product, form]);

  const handleSendProductrequest = async () => {
    try {
      // Validate the form fields
      const formData = await form.validateFields();
      
      // Prepare the product request
      const productRequest = {
        productId: product.id,
        email: user,
        price: formData.price,
        color: formData.color,
        size: formData.sizes,
        accept: false,
        reject: false,
      };
  
      // Call the send request handler
      onSend(productRequest);
      
      onClose();
    } catch (error) {
      // Handle validation errors
      console.error("Validation failed:", error);
    }
  };
  

  return (
    <Modal
      open={open}
      title="Bargain Product"
      onCancel={onClose}
      footer={
        <Button
          type="primary"
          size="large"
          onClick={() => handleSendProductrequest()}
        >
          Send Request
        </Button>
      }
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Product Image" name="image">
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {fileList.map((file, index) => (
              <Image
                key={index}
                width={100}
                height={100}
                src={file.url || file.thumbUrl} // Use the appropriate key based on your file object
                preview={{
                  visible:
                    previewOpen && previewImage === (file.url || file.thumbUrl),
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                onClick={() => {
                  setPreviewImage(file.url || file.thumbUrl);
                  setPreviewOpen(true);
                }}
                style={{ cursor: "pointer", borderRadius: "8px" }}
              />
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Colors"
          name="color"
          rules={[
            { required: true, message: "Please select at least one color!" },
          ]}
        >
          <Select
            placeholder="Select color"
            onChange={(value) => form.setFieldsValue({ color: value })}
          >
            {mapColorsToHexAndName(product.color).map(({ name, hex }) => (
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
          rules={[{ required: true, message: "Please select sizes!" }]}
        >
          <Select placeholder="Select sizes">
            {mapSizesToStock(product.sizes).map((size) => (
              <Select.Option key={size.name} value={size.name}>
                {size.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Condition" name="condition">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} readOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BargainProduct;
