import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Avatar,
  Button,
  Empty,
  Typography,
  Radio,
  Select,
  Flex,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartTotal,
  removeFromCart,
  updateCartItems,
} from "../feature/Cart/cartSlice";
import { Link, useLocation } from "react-router-dom";
import { mapColorsToHex, mapSizesToStock } from "../Constant/const";

const CartItem = () => {
  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.auth);
  const { cart, loading } = useSelector((state) => state.cart);

  const location = useLocation();

  console.log("jdbfjekfw", location);

  const [selectedColors, setSelectedColors] = useState({});
  const [quantities, setQuantities] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [updatedCartItems, setUpdatedCartItems] = useState([]);

  useEffect(() => {
    setUpdatedCartItems(cart);
  }, [cart]);

  useEffect(() => {
    if (userinfo?._id) {
      dispatch(getCartTotal(userinfo._id));
    }
  }, [dispatch, userinfo, updatedCartItems]);

  const handleRemove = (itemId) => {
    dispatch(removeFromCart({ userId: userinfo?._id, itemId }));
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
    updateCartItem(productId, { quantity: value });

    const updatedCartItems = cart.find(
      (cartItem) => cartItem._id === productId
    );
    
    dispatch(
      updateCartItems({
        userId: userinfo._id,
        itemId: productId,
        price: updatedCartItems.price,
        size: updatedCartItems.size,
        color: updatedCartItems.color,
        quantity: value,
      })
    );
  };


  const handleSizeChange = (productId, value) => {
    setSelectedSize((prevSize) => ({
      ...prevSize,
      [productId]: value,
    }));
    updateCartItem(productId, { size: value });
    const updatedCartItems = cart.find(
      (cartItem) => cartItem._id === productId
    );
    
    dispatch(
      updateCartItems({
        userId: userinfo._id,
        itemId: productId,
        price: updatedCartItems.price,
        size: value,
        color: updatedCartItems.color,
        quantity: updatedCartItems.quantity
      })
    );
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [productId]: color,
    }));
    updateCartItem(productId, { color });

    const updatedCartItems = cart.find(
      (cartItem) => cartItem._id === productId
    );
    
    dispatch(
      updateCartItems({
        userId: userinfo._id,
        itemId: productId,
        price: updatedCartItems.price,
        size: updatedCartItems.size,
        color: color,
        quantity: updatedCartItems.quantity
      })
    );
  };

  const updateCartItem = (productId, updatedData) => {
    setUpdatedCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, ...updatedData } : item
      )
    );
  };

  if (loading) {
    return <Typography.Text>Loading cart items...</Typography.Text>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Empty
          description={
            <Typography.Text>Choose your Favorite Item</Typography.Text>
          }
        >
          <Link to={"/products"}>
            <Button type="primary">Browse Products</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  return (
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={updatedCartItems}
      renderItem={(item) => {
        const { product, quantity, size, color, price, _id, requested } = item;
        const selectedProductColor = selectedColors[_id] || color;
        const selectedProductQuantity = quantities[_id] || quantity;
        const selectedProductSize = selectedSize[_id] || size;

        return (
          <List.Item key={_id}>
            <Card
              title={product.name}
              extra={
                location.pathname === "/cart" && (
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(_id)}
                  />
                )
              }
              bordered={true}
            >
              <List.Item.Meta
                avatar={
                  <Avatar.Group max={3} size={48}>
                    <Flex vertical gap={"small"}>
                      {product.images.map((i, index) => (
                        <Avatar key={index} size={80} shape="square" src={i} />
                      ))}
                    </Flex>
                  </Avatar.Group>
                }
                description={
                  <>
                    <Flex vertical gap={"middle"} align="start">
                      <Typography.Text strong>Price: ${price}</Typography.Text>
                      <div>
                        <Typography.Text strong>Quantity: </Typography.Text>
                        <Select
                          value={selectedProductQuantity}
                          onChange={(value) => handleQuantityChange(_id, value)}
                          style={{ width: 80 }}
                          disabled={requested}
                        >
                          {[...Array(10).keys()].map((num) => (
                            <Select.Option key={num + 1} value={num + 1}>
                              {num + 1}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <Typography.Text strong>Sizes: </Typography.Text>
                        <Radio.Group
                          defaultValue={selectedProductSize}
                          onChange={(e) =>
                            handleSizeChange(_id, e.target.value)
                          }
                        >
                          {requested
                            ? mapSizesToStock([size]).map((size) => (
                                <Radio.Button
                                  key={size.name}
                                  value={size.name}
                                  disabled={!size.inStock}
                                >
                                  {size.name}
                                </Radio.Button>
                              ))
                            : mapSizesToStock(product.sizes).map((size) => (
                                <Radio.Button
                                  key={size.name}
                                  value={size.name}
                                  disabled={!size.inStock}
                                >
                                  {size.name}
                                </Radio.Button>
                              ))}
                        </Radio.Group>
                      </div>
                      <div>
                        <Flex gap={"small"}>
                          <Typography.Text strong>Colors: </Typography.Text>
                          <Flex gap={"small"}>
                            {mapColorsToHex(product.color).map((hex, index) => (
                              <Avatar
                                key={index}
                                shape="square"
                                style={{
                                  backgroundColor: hex,
                                  cursor: "pointer",
                                  border:
                                    selectedProductColor === hex
                                      ? "2px solid black"
                                      : "1px solid #ccc",
                                }}
                                size={32}
                                onClick={() => {
                                  if (!requested) handleColorChange(_id, hex);
                                }}
                              />
                            ))}
                          </Flex>
                        </Flex>
                      </div>
                    </Flex>
                  </>
                }
              />
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default CartItem;
