import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Avatar, Button, Layout, Badge, Flex } from "antd";
import Icon, {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import UserMenu from "./Usermenu"; // Your existing UserMenu component
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrent,
  filterNavigationByUserType,
} from "../feature/navigation/navigationSlice";
import { getCartTotal } from "../feature/Cart/cartSlice";

const { Header } = Layout;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigation = useSelector((state) => state.navigation.filteredItems);
  const { summary, loading, error } = useSelector((state) => state.cart);
  const { userinfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCartTotal(userinfo?._id));
  }, [dispatch]);

  const isFavoritePage = location.pathname === "/favorite";

  const handlenavigate = () => {
    navigate("/favorite");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const menuItems = navigation.map((item, index) => ({
    key: index + 1, // Unique key for each menu item
    label: <Link to={item.href}>{item.name}</Link>, // Render the label as a Link
  }));

  const userType = localStorage.getItem("userType");
  useEffect(() => {
    // Fetch userType from localStorage and filter navigation
    dispatch(filterNavigationByUserType(userType || "buyer"));
    dispatch(setCurrent(location.pathname));
  }, [dispatch, location.pathname]);

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#001529",
      }}
    >
      {/* Logo */}
      <Link to={navigation[0]?.href}>
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
          style={{ height: "32px", marginRight: "16px" }}
        />
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ flex: 1, minWidth: 0 }}
        items={navigation.map((item) => ({
          key: item.href,
          label: <Link to={item.href}>{item.name}</Link>,
        }))}
      />

      <Flex gap={"large"} justify="flex-end" align="center">
        {userType === "buyer" && (
          <>
            <Button
              shape="circle"
              size="large"
              icon={
                !isFavoritePage ? (
                  <HeartOutlined />
                ) : (
                  <HeartFilled style={{ color: "red" }} />
                )
              }
              onClick={handlenavigate}
            />

            <Badge count={summary.totalItems} size="small">
              <Button
                shape="circle"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleCart}
              />
            </Badge>
          </>
        )}
        {/* Profile Dropdown */}
        <UserMenu></UserMenu>
      </Flex>
    </Header>
  );
};

export default Navbar;
