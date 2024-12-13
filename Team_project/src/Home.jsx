import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Modal,
  Descriptions,
  Avatar,
  Carousel,
  message,
  Spin,
  Breadcrumb,
  Skeleton,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  fetchUserProducts,
  deleteProduct,
  updateProduct,
} from "../feature/product/productSlice";
import EditProduct from "../component/EditProduct";
import DeleteProduct from "../component/DeleteProduct";
import Navbar from "../component/Navbar";
import ProductPagination from "../component/ProductPagination";
import PageHeader from "../component/PageHeader";
import Notify from "../component/Notify"; // Import Notify component

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { confirm } = Modal;

  const { products, loading, error } = useSelector((state) => state.product);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  };

  // Paginate products
  const paginatedProducts = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the selected product for editing
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
    setSelectedProduct(null); // Clear the selected product
  };

  const userEmail = localStorage.getItem("user");

  // const handleLogout = () => {
  //   localStorage.removeItem("isAuthenticated");
  //   localStorage.removeItem("userEmail");
  //   navigate("/login");
  // };

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchUserProducts(userEmail));
    }
  }, [dispatch, userEmail]);

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await dispatch(
        updateProduct({
          productId: updatedProduct.id,
          updatedData: { ...updatedProduct },
        })
      ).unwrap(); // Unwraps the response from the thunk

      Notify({
        type: "success",
        message: "Update Successful",
        description: `Product "${response.product.name}" has been updated successfully.`,
      });

      dispatch(fetchUserProducts(userEmail)); // Re-fetch to ensure updated data is shown
    } catch (err) {
      Notify({
        type: "error",
        message: "Update Failed",
        description: err.message || "An error occurred while updating the product.",
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

  return (
    <>
      <Navbar></Navbar>
      <PageHeader
        title="Dashboard"
        breadcrumbItems={[{ text: "Dashboard", link: "/home" }]}
      />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Spin spinning={loading}>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {!loading &&
                !error &&
                paginatedProducts?.map((product, i) => (
                  <Badge.Ribbon text={product.condition} key={i}>
                    <Card
                      key={product.id}
                      hoverable
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                      cover={
                        <Carousel
                          autoplay={hoveredProductId === product.id}
                          autoplaySpeed={2000}
                        >
                          {product?.images?.map((image, index) => (
                            <img
                              key={index}
                              alt={product.imageAlt}
                              src={image}
                              className="h-64 object-cover object-center"
                            />
                          ))}
                        </Carousel>
                      }
                      actions={[
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => handleEditClick(product)}
                        >
                          Edit
                        </Button>,
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(product)}
                          danger
                        >
                          Delete
                        </Button>,
                      ]}
                      className="shadow-md"
                    >
                      <Card.Meta
                        title={
                          <Link
                            to={`/products/${product.id}`}
                            className="text-lg font-medium text-gray-800"
                          >
                            {product.name}
                          </Link>
                        }
                        description={
                          <Descriptions column={1} size="small" bordered={false}>
                            <Descriptions.Item label="">
                              <div style={{ display: "flex", gap: "5px" }}>
                                {product?.color?.map((col) => (
                                  <Avatar
                                    key={col}
                                    shape="circle"
                                    style={{ backgroundColor: col }}
                                    size={18}
                                  />
                                ))}
                              </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="">
                              <span className="text-lg font-semibold text-gray-900">
                                ${product.price}
                              </span>
                            </Descriptions.Item>
                          </Descriptions>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                ))}

              {/* Skeleton loading for each product when loading */}
              {loading &&
                [...Array(4)].map((_, index) => (
                  <Skeleton key={index} active paragraph={{ rows: 5 }} />
                ))}
            </div>
          </Spin>
          <Divider />
          <ProductPagination
            current={currentPage}
            total={products.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onShowSizeChange={onShowSizeChange}
          />
        </div>

        {/* Edit Product Modal */}
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

export default Home;



