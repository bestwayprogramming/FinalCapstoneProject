import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Typography,
  Button,
  Image,
  Radio,
  Row,
  Col,
  Flex,
  Tag,
  Carousel,
  Modal,
  message,
} from "antd";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOrderFromHistory,
  fetchUserOrderHistory,
  fetchuserprofile,
  updateOrderStatus,
} from "../feature/auth/authSlice";
import { getStatusColor } from "../Constant/const";

const { Title, Text } = Typography;

const OrderHistory = () => {
  const { userinfo, orderHistory, loading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [itemsPerRow, setItemsPerRow] = useState(2);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelledModalVisible, setIsCancelledModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const updatedSizes = ["1", "2", "3"]; // Dynamic size options

  useEffect(() => {
    if (userinfo) {
      dispatch(fetchUserOrderHistory(userinfo?._id));
    } else {
      const email = localStorage.getItem("user");
      dispatch(fetchuserprofile({ email: email }));
    }
  }, [dispatch, userinfo]);

  const handleOrdercancel = () => {
    dispatch(
      updateOrderStatus({ orderId: selectedOrderId, status: "Cancelled" })
    )
      .unwrap()
      .then((response) => {
        message.success("Order successfully cancelled.");
        setIsCancelledModalVisible(false);
        setSelectedOrderId(null);
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
      });
  };

  const getVisibleActions = (status) => {
    switch (status) {
      case "Pending":
        return ["Cancel"];
      case "Shipped":
        return ["Cancel"];
      case "Delivered":
      case "Cancelled":
        return ["Delete"];
      default:
        return ["Delete"];
    }
  };

  const showDeleteConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalVisible(true);
  };

  const showCancelConfirm = (orderId) => {
    setSelectedOrderId(orderId);
    setIsCancelledModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteOrderFromHistory({
          userId: userinfo?._id,
          orderId: selectedOrderId,
        })
      ).unwrap();
      message.success("Order successfully removed from history.");
    } catch (error) {
      message.error(error || "Failed to delete order.");
    } finally {
      setIsModalVisible(false);
      setSelectedOrderId(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedOrderId(null);
  };

  const handleOrderNotCancel = () => {
    setIsCancelledModalVisible(false);
    setSelectedOrderId(null);
  };
  return (
    <div>
      {/* <Flex gap={"small"} align="baseline">
        <Typography.Text>Order List Size: </Typography.Text>
        <Radio.Group
          defaultValue="2"
          size="large"
          onChange={(e) => setItemsPerRow(parseInt(e.target.value))}
          buttonStyle="solid"
          style={{ marginBottom: 16 }}
        >
          {updatedSizes.map((size) => (
            <Radio.Button key={size} value={size}>
              {size}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Flex> */}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={orderHistory}
        renderItem={(order) => (
          <List.Item>
            <Card
              title={`Order ID: ${order.orderId._id}`}
              extra={
                <Flex vertical justify="end">
                  <Text type="secondary">
                    Placed At:{" "}
                    {new Date(order.orderId.placedAt).toLocaleDateString()}
                  </Text>
                  <Text type="secondary">
                    Updated At:{" "}
                    {new Date(order.orderId.updatedAt).toLocaleDateString()}
                  </Text>
                </Flex>
              }
              actions={getVisibleActions(order.orderId.status).map((action) => {
                switch (action) {
                  case "Edit":
                    return (
                      <Button
                        key="edit"
                        icon={<EditOutlined />}
                        onClick={() => onDelete(order.orderId._id)}
                      >
                        Edit
                      </Button>
                    );
                  case "Cancel":
                    return (
                      <Flex
                        justify="end"
                        style={{
                          paddingRight: 10,
                        }}
                      >
                        <Button
                          key="cancel"
                          type="primary"
                          size="large"
                          icon={<CloseOutlined />}
                          onClick={() => showCancelConfirm(order.orderId._id)}
                        ></Button>
                      </Flex>
                    );
                  case "Delete":
                    return (
                      <Flex
                        justify="end"
                        style={{
                          paddingRight: 10,
                        }}
                      >
                        <Button
                          key="delete"
                          type="primary"
                          size="large"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => showDeleteConfirm(order.orderId._id)}
                        ></Button>
                      </Flex>
                    );
                  default:
                    return null;
                }
              })}
            >
              <List
                // grid={{ gutter: 24, column: 2 }}
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={order.orderId.items}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      hoverable
                      cover={
                        <Carousel
                          //   autoplay={hoveredProductId === product.id}
                          autoplaySpeed={2000}
                        >
                          {item.product?.images?.map((image, index) => (
                            <img
                              key={index}
                              alt={item.product.imageAlt}
                              src={image}
                              className="h-64 w-64 object-cover object-center"
                            />
                          ))}
                        </Carousel>
                      }
                    >
                      <Card.Meta
                        title={item.product.name}
                        description={
                          <>
                            <Typography>
                              <Text strong>Size:</Text> {item.size}
                            </Typography>
                            <Typography>
                              <Text strong>Color:</Text>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "16px",
                                  height: "16px",
                                  backgroundColor: item.color,
                                  borderRadius: "50%",
                                  verticalAlign: "middle",
                                  marginLeft: "4px",
                                }}
                              ></span>
                            </Typography>
                            <Typography>
                              <Text strong>Price:</Text> ${item.price}
                            </Typography>
                            <Typography>
                              <Text strong>Quantity:</Text> {item.quantity}
                            </Typography>
                          </>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
              <Row>
                <Col span={12}>
                  <Typography>
                    <Text strong>Status:</Text>{" "}
                    <Tag color={getStatusColor(order.orderId.status)}>
                      {order.orderId.status.toUpperCase()}
                    </Tag>
                  </Typography>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Typography>
                    <Text strong>Total Amount:</Text> ${order.totalAmount}
                  </Typography>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Yes, Delete"
        cancelText="No"
      >
        <p>
          Are you sure you want to remove this item from your order history?
        </p>
      </Modal>

      <Modal
        title="Confirm Order cancelled?"
        open={isCancelledModalVisible}
        onOk={handleOrdercancel}
        onCancel={handleOrderNotCancel}
        okText="Yes, Cancel"
        cancelText="No"
      >
        <p>
          Are you sure you want to cancel this Order?
        </p>
      </Modal>
    </div>
  );
};

export default OrderHistory;
