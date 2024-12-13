import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import { fetchCartItems, getCartTotal } from "../feature/Cart/cartSlice";
import { Button, Divider, Flex, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, summary, loading, } = useSelector((state) => state.cart);
  const { userinfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (email) {
      dispatch(fetchCartItems(email));
    }
    dispatch(getCartTotal(userinfo?._id));
  }, [dispatch]);

  return (
    <div>
      {loading ? (
        [...Array(4)].map((_, index) => (
          <Skeleton key={index} active paragraph={{ rows: 5 }} />
        ))
      ) : (
        <>
          <CartItem cart={cart} summary={summary} />
          <Divider />
          <Flex gap={"large"} justify="end">
            <Typography.Text strong>
              Price: ${summary.totalPrice}
            </Typography.Text>
            <Typography.Text strong>
              Total Items: {summary.totalItems}
            </Typography.Text>
          </Flex>
          <Link to={'/Checkout'}><Button type="primary">Proceed to Checkout</Button></Link>
          </>
      )}
    </div>
  );
};

export default Cart;
