import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  fetchWishlistProducts,
  removeFromWishlist,
} from "../feature/Wishlist/wishlistSlice";
import { fetchuserprofile } from "../feature/auth/authSlice";
import {
  Button,
  Card,
  Empty,
  Flex,
  Image,
  List,
  Skeleton,
  Typography,
} from "antd";
import Title from "antd/es/skeleton/Title";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const Favorite = () => {
  const dispatch = useDispatch();
  const { userinfo, loading } = useSelector((state) => state.auth);
  const { wishlistProducts: products, loading: wishlistLoading } = useSelector(
    (state) => state.wishlist
  );
  const { products: wishlist } = useSelector((state) => state.wishlist);

  const isProductInWishlist = (productId) => {
    const list = wishlist?.length > 0 ? wishlist : userinfo?.wishlist;
    return list.some((item) => item.productId === productId);
  };

  const handleFavorite = (productId) => {
    if (wishlist.some((item) => item.productId === productId)) {
      dispatch(removeFromWishlist({ userId: userinfo._id, productId }));
    } else {
      dispatch(addToWishlist({ userId: userinfo._id, productId }));
    }
  };

  useEffect(() => {
    const userEmail = localStorage.getItem("user");
    if (userEmail && !userinfo) {
      dispatch(fetchuserprofile({ email: userEmail }));
    }
    dispatch(fetchWishlistProducts({ userId: userinfo?._id }));
  }, [dispatch, userinfo, wishlist]);

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <Title level={2}>Product List</Title>
        {wishlistLoading && <Skeleton />}
        {products?.length === 0 ? (
          <Flex vertical align="center" justify="center">
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description={
                <Typography.Text>Choose your Favorite Item</Typography.Text>
              }
            >
              <Link to={"/products"}>
                <Button type="primary">Browse Products</Button>
              </Link>
            </Empty>
          </Flex>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={products}
            renderItem={(product) => (
              <List.Item>
                <Card
                  title={
                    <Link
                      to={`/products/${product.id}`}
                      className="text-lg font-medium text-gray-800"
                    >
                      {product.name}
                    </Link>
                  }
                  extra={
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
                  }
                  hoverable
                  cover={
                    <Image
                      alt={product.imageAlt}
                      src={product.images[0]}
                      style={{ height: 200, objectFit: "cover" }}
                    />
                  }
                >
                  <Flex justify="center">
                    <Link to={`/products/${product.id}`}>
                      <Button type="primary" size="large">
                        Order Now
                      </Button>
                    </Link>
                  </Flex>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Favorite;
