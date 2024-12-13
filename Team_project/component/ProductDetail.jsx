import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  fetchProductById,
  updateProduct,
} from "../feature/product/productSlice";
import Navbar from "./Navbar";
import PageHeader from "./PageHeader";
import {
  COLORS,
  mapColorsToHex,
  mapSizesToStock,
  SIZES,
} from "../Constant/const";
import {
  Image,
  Radio,
  Tag,
  Row,
  Col,
  Button,
  Flex,
  Modal,
  Carousel,
  Typography,
  Space,
  Avatar,
  notification,
} from "antd";
import DeleteProduct from "./DeleteProduct";
import { ExclamationCircleOutlined, ShoppingOutlined } from "@ant-design/icons";
import EditProduct from "./EditProduct";
import Notify from "./Notify";
import QuickMessage from "./QuickMessage";
import { fetchuserprofile } from "../feature/auth/authSlice";
import { addToCart, getCartTotal } from "../feature/Cart/cartSlice";
import { setCurrent } from "../feature/navigation/navigationSlice";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.product);
  const { userinfo } = useSelector((state) => state.auth);
  const user = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null); // State for selected color
  const [selectedSize, setSelectedSize] = useState(null);
  const { filteredItems } = useSelector((state) => state.navigation);
  const location = useLocation(); // React Router hook to get the current location
  const { confirm } = Modal;

  useEffect(() => {
    dispatch(fetchProductById(productId));
    dispatch(setCurrent(location.pathname));
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(fetchuserprofile({ email: user }));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const onChange = (e) => {
    console.log(`radio checked:${e.target.value}`);
  };

  const updatedSizes = mapSizesToStock(product.sizes || []);
  const colorHexes = mapColorsToHex(product.color || []);

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await dispatch(
        updateProduct({
          productId: productId,
          updatedData: { ...updatedProduct },
        })
      ).unwrap();

      Notify({
        type: "success",
        message: "Update Successful",
        description: `Product "${response.product.name}" has been updated successfully.`,
      });

      dispatch(fetchProductById(productId));
    } catch (err) {
      Notify({
        type: "error",
        message: "Update Failed",
        description:
          err.message || "An error occurred while updating the product.",
      });
    }
  };
  const handleDelete = (product) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: <DeleteProduct product={product} />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        dispatch(deleteProduct(product.id));
      },
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedProduct(null); // Clear the selected product
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    setIsModalVisible(true); // Show the modal
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      Notify({
        type: "error",
        message: "Validation Error",
        description: "Please select both color and size.",
      });
      return; // Prevent further action if validation fails
    }

    try {
      // Dispatch addToCart action and wait for it to complete
      await dispatch(
        addToCart({
          userId: userinfo._id,
          productId: product.id,
          price: product.price,
          size: selectedSize,
          color: selectedColor,
        })
      ).unwrap();

      Notify({
        type: "success",
        message: "Product successfully added to your cart!",
        description: "You can now proceed to checkout or keep shopping.",
      });

      // After the product is added to the cart, dispatch getCartTotal
      dispatch(getCartTotal(userinfo._id));
    } catch (error) {
      // Handle any errors that might occur during the addToCart action
      Notify({
        type: "error",
        message: "Error adding to cart",
        description: error.message || "Something went wrong.",
      });
    }
  };

  const breadcrumbs = [
    ...filteredItems
      .filter((item) => location.pathname.startsWith(item.href))
      .map((item) => ({ text: item.name, link: item.href })),
    { text: `Product_${product.id}` },
  ];

  return (
    <>
      <Navbar />
      <PageHeader title="All Products" breadcrumbItems={breadcrumbs} />

      <main>
        <div className="mx-auto pt-10 max-w-7xl px-4 py-6 sm:p-6 lg:p-12">
          <div className="bg-white">
            <div className="pt-10">
              <Row gutter={24}>
                {/* Left Column (Product Image) */}
                {/* Left Column (Scrollable Product Images with Ant Design) */}
                {/* Left Column (Product Images with Carousel) */}
                <Col span={24} lg={12}>
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
                          alt={`${product.imageAlt || "Product Image"} ${
                            index + 1
                          }`}
                          style={{
                            borderRadius: "8px", // Rounded corners for images
                            objectFit: "cover", // Ensure consistent display
                            width: "100%", // Stretch image to fill carousel width
                          }}
                        />
                      </div>
                    ))}
                  </Carousel>
                </Col>

                {/* Right Column (Product Details) */}
                <Col span={24} lg={12}>
                  <div>
                    {/* Product Name and Price */}
                    <Typography.Title level={3}>
                      {product.name}
                    </Typography.Title>
                    <Typography.Title level={4} style={{ color: "#555" }}>
                      ${product.price}
                    </Typography.Title>

                    {/* Colors */}
                    <Row gutter={[0, 16]} style={{ marginTop: "8px" }}>
                      {/* Row for heading */}
                      <Col span={24}>
                        <Typography.Text strong>Colors</Typography.Text>
                      </Col>
                      <Col span={24}>
                        <Space>
                          {colorHexes.map((hex, index) => (
                            <Avatar
                              key={index}
                              shape="circle"
                              style={{
                                backgroundColor: hex,
                                border: "1px solid #ccc",
                              }}
                              size={selectedColor === hex ? 48 : 32}
                              onClick={() => setSelectedColor(hex)}
                            />
                          ))}
                        </Space>
                      </Col>
                    </Row>

                    {/* Condition */}
                    <div style={{ marginTop: "16px" }}>
                      <Typography.Text strong>Condition</Typography.Text>
                      <div style={{ marginTop: "8px" }}>
                        <Tag color="blue">{product.condition}</Tag>
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginTop: "24px" }}>
                      <Typography.Text strong>Description</Typography.Text>
                      <Typography.Paragraph
                        style={{ marginTop: "8px", color: "#555" }}
                      >
                        {product.description}
                      </Typography.Paragraph>
                    </div>

                    {/* Size Selection */}
                    <Row gutter={[0, 16]} style={{ marginTop: "24px" }}>
                      {/* Row for heading */}
                      <Col span={24}>
                        <Typography.Text strong>Size</Typography.Text>
                      </Col>

                      {/* Row for Radio Group */}
                      <Col span={24}>
                        <Radio.Group
                          defaultValue="6"
                          size="large"
                          onChange={(e) => setSelectedSize(e.target.value)}
                          buttonStyle="solid"
                        >
                          {updatedSizes.map((size) => (
                            <Radio.Button
                              key={size.name}
                              value={size.name}
                              disabled={!size.inStock}
                            >
                              {size.name}
                            </Radio.Button>
                          ))}
                        </Radio.Group>
                      </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div style={{ marginTop: "32px" }}>
                      {userType === "buyer" ? (
                        <Flex vertical gap={"large"}>
                          <QuickMessage
                            productId={product.id}
                            sellerEmail={product.owner}
                          />

                          <Button
                            size="large"
                            icon={<ShoppingOutlined />}
                            type="primary"
                            onClick={handleAddToCart}
                          >
                            Add to Cart
                          </Button>
                        </Flex>
                      ) : (
                        <Space size="middle">
                          <Button
                            size="large"
                            type="primary"
                            onClick={() => handleEditClick(product)}
                          >
                            Update
                          </Button>
                          <Button
                            size="large"
                            type="primary"
                            danger
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </Button>
                        </Space>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        {selectedProduct && (
          <EditProduct
            open={isModalVisible}
            onClose={handleModalClose}
            onUpdate={handleUpdate}
            product={selectedProduct}
          />
        )}
      </main>
    </>
  );
};

export default ProductDetail;
