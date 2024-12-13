import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Avatar,
  Carousel,
  Spin,
  Skeleton,
  Divider,
  Typography,
  Space,
  Flex,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllProducts } from "../feature/product/productSlice";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../feature/Wishlist/wishlistSlice";
import { fetchuserprofile } from "../feature/auth/authSlice";

import Navbar from "./Navbar";
import ProductPagination from "./ProductPagination";
import PageHeader from "./PageHeader";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { setCurrent } from "../feature/navigation/navigationSlice";
import { mapColorsToHex } from "../Constant/const";

const { Text } = Typography;

const AllProduct = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.product);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { products: wishlist } = useSelector((state) => state.wishlist);
  const { userinfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const { filteredItems } = useSelector((state) => state.navigation);

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

  const handleFavorite = (productId) => {
    const list = userinfo?.wishlist.length > 0 ? userinfo.wishlist : wishlist;
    if (list.some((item) => item.productId === productId)) {
      dispatch(removeFromWishlist({ userId: userinfo._id, productId }));
    } else {
      dispatch(addToWishlist({ userId: userinfo._id, productId }));
    }
  };

  const isProductInWishlist = (productId) => {
    const list = wishlist;
    return list.some((item) => item.productId === productId);
  };

  useEffect(() => {
    if (userinfo) dispatch(fetchWishlist(userinfo?._id));
  }, [userinfo]);

  useEffect(() => {
    if (!userinfo && localStorage.getItem("user")) {
      const userEmail = localStorage.getItem("user");
      dispatch(fetchuserprofile({ email: userEmail }));
    }
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, userinfo, wishlist, products]);

  useEffect(() => {
    // Set the current breadcrumb based on the URL
    dispatch(setCurrent(location.pathname));
  }, [location.pathname, dispatch]);

  const breadcrumbs = filteredItems
    .filter((item) => item.current)
    .map((item) => ({
      text: item.name,
      link: item.href,
    }));

  return (
    <>
      <Navbar />
      <PageHeader title="All Products" breadcrumbItems={breadcrumbs} />

      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Spin spinning={loading}>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Show error message */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Map over products and create a card for each */}
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
                          <Space
                            direction="vertical"
                            size="middle"
                            style={{
                              display: "flex",
                              padding: "2px",
                            }}
                          >
                            {/* Colors */}
                            <Space size="small" direction="vertical">
                              <Flex gap={"small"}>
                                {product?.color?.map((col) => (
                                  <Avatar
                                    key={col}
                                    shape="circle"
                                    style={{
                                      backgroundColor: mapColorsToHex([col]),
                                    }}
                                    size={32}
                                  />
                                ))}
                              </Flex>
                              <Tooltip title={product.description}>
                                <p>
                                  {product.description.slice(0, 20)}
                                  {product.description.length > 20 && "..."}
                                </p>
                              </Tooltip>
                            </Space>
                            <Flex justify="space-between">
                              <Text
                                strong
                                style={{ fontSize: "21px", color: "#000" }}
                              >
                                ${product.price}
                              </Text>
                              <Button
                                shape="circle"
                                icon={
                                  isProductInWishlist(product.id) ? (
                                    <HeartFilled />
                                  ) : (
                                    <HeartOutlined />
                                  )
                                }
                                danger={isProductInWishlist(product.id)}
                                onClick={() => handleFavorite(product.id)}
                              />
                            </Flex>
                          </Space>
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
      </main>
    </>
  );
};

export default AllProduct;
