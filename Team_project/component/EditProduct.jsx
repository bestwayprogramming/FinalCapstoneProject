import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Upload, message, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { categories, COLORS, conditions, types } from "../Constant/const";

const { Option } = Select;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditProduct = ({ open, onClose, onUpdate, product }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);

      if (product.images) {
        const existingImages = product.images.map((url, index) => ({
          uid: `-image-${index}`,
          name: `Image-${index + 1}`,
          url, // Set URL from Cloudinary
          status: "done", // Mark as uploaded
        }));
        setFileList(existingImages);
      }
    }
  }, [product, form]);

  const handleFileChange = async ({ fileList: newFileList }) => {
    const processedFiles = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj) {
          file.url = await getBase64(file.originFileObj);
        }
        return file;
      })
    );

    setFileList(processedFiles);
    form.setFieldsValue({
      images: processedFiles.map((file) => file.url),
    });
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedProduct = {
        ...values,
        id: product.id,
        owner: product.owner,
      };
      if (fileList.length > 0) {
        updatedProduct.images = fileList.map((file) => file.url);
      }
      onUpdate(updatedProduct);
      onClose(); 
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Product"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Product ID"
          name="id"
          readOnly
          rules={[{ required: true, message: "Please input the product ID!" }]}
        >
          <Input type="text" readOnly />
        </Form.Item>

        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Product Image" name="image">
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
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
            />
          )}
        </Form.Item>

        <Form.Item
          label="Image Alt Text"
          name="imageAlt"
          rules={[
            { required: true, message: "Please input the image alt text!" },
          ]}
        >
          <Input />
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
            mode="tags"
            placeholder="Add colors"
            value={product.color}
            onChange={(value) => form.setFieldsValue({ color: value })}
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
          rules={[{ required: true, message: "Please select sizes!" }]}
        >
          <Select mode="multiple" placeholder="Select sizes">
            {Array.from({ length: 10 }, (_, i) => (
              <Option key={i + 3} value={(i + 3).toString()}>
                {i + 3}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            { required: true, message: "Please select the product type!" },
          ]}
        >
          <Select placeholder="Select type">
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
          rules={[
            { required: true, message: "Please select the product condition!" },
          ]}
        >
          <Select placeholder="Select condition">
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
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select category">
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProduct;
