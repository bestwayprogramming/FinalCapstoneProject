import React from "react";
import {
  List,
  Card,
  Avatar,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Flex,
  Divider,
} from "antd";
import { mapColorsToHex } from "../Constant/const";

const ProcessOrder = ({ cart }) => {
  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={cart}
      renderItem={(item) => {
        const { product, quantity, color, price } = item;
        const { name, images, imageAlt } = product;

        return (
          <List.Item key={item._id}>
            <Card title={name}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={images[0]}
                    alt={imageAlt}
                    shape="square"
                    size={64}
                  />
                }
                title={<Typography.Text strong>{name}</Typography.Text>}
                description={
                  <Flex vertical align="start">
                    <Typography.Text strong>Price: ${price}</Typography.Text>
                    <Row>
                      <Col span={24}>
                        <Typography.Text strong>
                          Quantity: {quantity}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row gutter={[0, 16]}>
                      <Col span={24}>
                        <Flex gap={"small"}>
                          <Typography.Text strong>Colors:</Typography.Text>

                          <Avatar
                            shape="square"
                            style={{
                              backgroundColor: color,
                              border: "1px solid #ccc",
                            }}
                            size={32}
                          />
                        </Flex>
                      </Col>
                    </Row>
                  </Flex>
                }
              />
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

export default ProcessOrder;
