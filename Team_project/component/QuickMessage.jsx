import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input, Button, Card, Row, Col, Typography,} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { sendMessage } from "../feature/Chat/chatSliceSeller";
import Notify from "./Notify";

const QuickMessage = ({ productId, sellerEmail }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const buyerEmail = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const sender = userType === "seller" ? "seller" : "buyer";

    dispatch(
      sendMessage({
        productId,
        buyerEmail,
        sellerEmail,
        sender,
        message,
        productRequest: null,
      })
    );
    Notify({
      type: "success",
      message: "Message sent successfully!",
      description: "Please check your chatbox.",
    });
    setMessage(""); // Clear the input field after sending
  };

  return (
    <div>
      <Typography.Text strong>Quick Message</Typography.Text>
      <Row gutter={8} align="middle">
        <Col span={20}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onPressEnter={handleSendMessage}
            size="large"
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            style={{ width: "100%" }}
          >
            Send
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default QuickMessage;
