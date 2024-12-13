import React from "react";
import { Avatar, Col, Row, Tooltip } from "antd";

const CustomProductSelect = ({ products, onProductClick }) => {
  return (
    <Row
      gutter={[12, 0]}
      style={{ padding: "8px 0", overflowX: "auto", whiteSpace: "nowrap" }}
    >
      {products.map((product, index) => (
        <Col key={index} style={{ display: "inline-block" }}>
          <Tooltip title={product.name} placement="top">
            <Avatar
              src={product.images[0]} // Display the first image
              alt={product.imageAlt}
              size={60}
              shape="square"
              style={{
                border: "2px solid #e8e8e8",
                cursor: "pointer",
              }}
              onClick={() => onProductClick(product)}
            />
          </Tooltip>
        </Col>
      ))}
    </Row>
  );
};

export default CustomProductSelect;
