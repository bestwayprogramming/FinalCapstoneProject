import {
  Avatar,
  Button,
  Flex,
  Form,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import { mapHexToColorName, Orderstatus } from "../Constant/const";

const EditOrderStatus = ({ open, onClose, onUpdate, product }) => {
  

    const handleUpdate = () => {
        form
          .validateFields() // Validate all fields in the form
          .then((values) => {
            console.log("Selected Status:", values.status); // Log the selected status
            // Optionally, call onUpdate or any other logic here
            onUpdate(product._id,values.status);
          })
          .catch((errorInfo) => {
            console.error("Validation Failed:", errorInfo);
          });
      };
      

  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);
  return (
    <>
      <Modal
        open={open}
        title="Update Order Status"
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
        <Flex vertical gap={"middle"}>
          <Typography.Text >OrderID: {product?._id}</Typography.Text>
          <Typography.Text strong>Total Amount: ${product?.totalAmount}</Typography.Text>

          <Avatar.Group
            max={{
              count: 3,
            }}
            size={96}
            shape="square"
          >
            {product?.items.map(({ product, quantity, color, size, price }) => (
              <Tooltip
                key={product._id}
                title={
                  <p>
                    Name: {product.name}
                    <br />
                    Price: ${price}
                    <br />
                    Color: {mapHexToColorName(color)}
                    <br />
                    Size: {size}
                    <br />
                    Quantity: {quantity}
                  </p>
                }
              >
                <Avatar
                  style={{
                    backgroundColor: product.color,
                  }}
                  size={96}
                  src={product.images[0]}
                />
              </Tooltip>
            ))}
          </Avatar.Group>

          <Form form={form}>
            <Form.Item
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select options={Orderstatus} style={{ width: 120 }}></Select>
            </Form.Item>
          </Form>
        </Flex>
      </Modal>
    </>
  );
};

export default EditOrderStatus;