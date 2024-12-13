import { Card, Carousel, Descriptions, Image } from "antd";

const DeleteProduct = ({ product }) => (
  <Card bordered={false} style={{ textAlign: "center" }}>
    
    <Carousel
      autoplay
      dots={{ className: "custom-dots" }}
      vertical={true}
      arrows
      dotPosition="right"
    >
      {product.images?.map((image, index) => (
        <div key={index} style={{ textAlign: "center" }}>
          <Image
            src={image}
            alt={`${product.imageAlt || "Product Image"} ${index + 1}`}
            style={{
              borderRadius: "8px", // Rounded corners for images
              objectFit: "cover", // Ensure consistent display // Stretch image to fill carousel width
            }}
          />
        </div>
      ))}
    </Carousel>
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label="Product ID">{product?.id}</Descriptions.Item>
      <Descriptions.Item label="Name">{product?.name}</Descriptions.Item>
      <Descriptions.Item label="Price">{product?.price}</Descriptions.Item>
      <Descriptions.Item label="Condition">
        {product?.condition}
      </Descriptions.Item>
    </Descriptions>
  </Card>
);

export default DeleteProduct;
