import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats, sendMessage } from "../feature/Chat/chatSliceSeller";
import {
  Layout,
  List,
  Typography,
  Input,
  Button,
  Avatar,
  Space,
  Spin,
  Flex,
} from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import CustomProductSelect from "./CustomProductSelect";
import { fetchuserprofile } from "../feature/auth/authSlice";
import { fetchUserProducts } from "../feature/product/productSlice";
import BargainProduct from "./BargainProduct";
import { Footer } from "antd/es/layout/layout";
import ProductRequestCard from "./ProductRequestCard";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#001529",
};

const contentStyle = {
  padding: "20px",
  overflowY: "auto",
  backgroundColor: "#ffffff",
};

const ChatApp = () => {
  const dispatch = useDispatch();
  const { chats, loading, error } = useSelector((state) => state.chat2);
  const { products } = useSelector((state) => state.product);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const email = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");

  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);

  // Fetch chats based on user type
  useEffect(() => {
    if (email) {
      dispatch(fetchChats(email));
      dispatch(fetchuserprofile({ email: email }));
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (userType === "buyer" && selectedChat?.sellerEmail) {
      dispatch(fetchUserProducts(selectedChat.sellerEmail));
    } else if (userType === "seller") {
      dispatch(fetchUserProducts(email));
    }
  }, [dispatch, selectedChat, userType, email]);

  useEffect(() => {
    if (chats) {
      setFilteredChats(
        chats.filter((chat) => {
          const contactEmail =
            userType === "seller" ? chat.buyerEmail : chat.sellerEmail;
          return contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
  }, [chats, searchTerm, userType]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSendMessage = async () => {
    if (!message || !selectedChat) return;

    const { productId, buyerEmail, sellerEmail } = selectedChat;

    // Determine the receiver email
    const receiverEmail = userType === "seller" ? buyerEmail : sellerEmail;

    dispatch(
      sendMessage({
        productId,
        sellerEmail: userType === "seller" ? email : receiverEmail,
        buyerEmail: userType === "buyer" ? email : receiverEmail,
        sender: userType,
        message,
        productRequest: null,
      })
    );
    setMessage("");

    // Refetch chats and update selected chat after sending the message
    dispatch(fetchChats(email)).then((action) => {
      if (action.payload) {
        const updatedChat = action.payload.find(
          (chat) => chat._id === selectedChat._id
        );
        setSelectedChat(updatedChat || null);
      }
    });
  };

  const handleSendProductMessageRequest = async (productRequest) => {
    const { productId, buyerEmail, sellerEmail } = selectedChat;

    // Determine the receiver email
    const receiverEmail = userType === "seller" ? buyerEmail : sellerEmail;

    // Send the message with product request
    await dispatch(
      sendMessage({
        productId,
        sellerEmail: userType === "seller" ? email : receiverEmail,
        buyerEmail: userType === "buyer" ? email : receiverEmail,
        sender: userType,
        message: "Product Request",
        productRequest,
      })
    );

    setMessage("");
    // Refetch chats and update selected chat after sending the product request
    // dispatch(fetchChats(email)).then((action) => {
    //   if (action.payload) {
    //     const updatedChat = action.payload.find(
    //       (chat) => chat._id === selectedChat._id
    //     );
    //     setSelectedChat(updatedChat || null);
    //   }
    // });
  };

  const renderChatList = () => (
    <List
      itemLayout="horizontal"
      dataSource={filteredChats}
      renderItem={(chat) => (
        <List.Item
          onClick={() => setSelectedChat(chat)}
          style={{
            cursor: "pointer",
            background: selectedChat?._id === chat._id ? "#1890ff" : "transparent",
            padding: "10px 16px",
          }}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                src={
                  userType === "seller"
                    ? chat?.buyer?.profilePicture // Buyer's profile picture for the seller
                    : chat?.seller?.profilePicture // Seller's profile picture for the buyer
                }
                icon={
                  !chat?.buyer?.profilePic && !chat?.seller?.profilePicture ? (
                    <UserOutlined />
                  ) : undefined
                }
                size={48} // Default icon if no profilePic exists
              />
            }
            title={
              <Typography.Text style={{ color: "#fff" }}>
                {userType === "seller"
                  ? `${chat?.buyer?.firstName} ${chat?.buyer?.lastName}`
                  : `${chat?.seller?.firstName} ${chat?.seller?.lastName}`}
              </Typography.Text>
            }
            description={
              <Typography.Text style={{ color: "#d9d9d9" }} ellipsis>
                {chat.messages?.[chat.messages.length - 1]?.message || "No messages yet"}
              </Typography.Text>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar for Chats */}
      <Sider
        width={300}
        style={{ background: "#001529", color: "#fff", overflowY: "auto" }}
      >
        <Header style={{ background: "#001529", padding: "16px" }}>
          <Search
            placeholder="Search chats"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
            size="large"
          />
        </Header>
        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "50px auto", color: "#fff" }}
          />
        ) : error ? (
          <Typography.Text type="danger" style={{ color: "#fff" }}>
            {error}
          </Typography.Text>
        ) : (
          renderChatList()
        )}
      </Sider>

      {/* Main Content Area for Messages */}
      <Layout>
        <Header
          style={{
            background: "#f0f2f5",
            padding: "16px",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          {selectedChat ? (
            <>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Chat with{" "}
                {userType === "seller"
                  ? selectedChat.buyerEmail
                  : selectedChat.sellerEmail}
              </Typography.Title>
            </>
          ) : (
            <Typography.Title level={5} style={{ margin: 0 }}>
              Select a chat to view messages
            </Typography.Title>
          )}
        </Header>
        <Content style={contentStyle}>
          <Flex vertical wrap>
            {selectedChat ? (
              <>
                <div
                  style={{
                    position: "sticky",
                    top: -20,
                    zIndex: 10,
                    background: "#ffffff",
                    // paddingBottom: "8px",
                  }}
                >
                  <CustomProductSelect
                    products={products}
                    onProductClick={handleProductClick}
                  />
                  {selectedProduct && (
                    <BargainProduct
                      open={isModalOpen}
                      onClose={handleModalClose}
                      product={selectedProduct}
                      onSend={handleSendProductMessageRequest}
                      userType={userType}
                    />
                  )}
                </div>

                <List
                  dataSource={selectedChat.messages || []}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        display: "flex",
                        justifyContent:
                          item.sender === userType ? "flex-end" : "flex-start",
                      }}
                    >
                      <Space
                        direction="vertical"
                        style={{
                          background:
                            item.sender === userType ? "#d9f7be" : "#e6f7ff",
                          padding: "8px 12px",
                          borderRadius: "12px",
                          maxWidth: "70%",
                        }}
                      >
                        <Typography.Text strong>
                          {item.sender === "buyer" ? "Buyer" : "Seller"}
                        </Typography.Text>
                        {item?.productRequest?.id ? (
                          <ProductRequestCard
                            productRequest={item.productRequest}
                          />
                        ) : (
                          <Typography.Text>{item.message}</Typography.Text>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <Typography.Text type="secondary">
                No chat selected.
              </Typography.Text>
            )}
          </Flex>
        </Content>

        <Footer style={footerStyle}>
          {selectedChat && (
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onPressEnter={handleSendMessage}
              suffix={
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!message}
                  size="large"
                />
              }
            />
          )}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ChatApp;
