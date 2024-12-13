import React, { useEffect, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import Navbar from "./Navbar";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, getCartTotal } from "../feature/Cart/cartSlice";
import {
  createOrder,
  finalizePayment,
} from "../feature/Order/orderSlice";
import AddressManagement from "./AddressManagement";

const OrderCheckout = ({item}) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const { userinfo } = useSelector((state) => state.auth);
  const { cart, summary } = useSelector((state) => state.cart);
  const { order, loading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    const email = localStorage.getItem("user");
    if (email) {
      dispatch(fetchCartItems(email));
    }
    dispatch(getCartTotal(userinfo?._id));
  }, [dispatch, userinfo]);

  useEffect(() => {
    if (order) {
      setCurrent(order.step || 0);
    }
  }, [order]);

  const next = async () => {
    if (current === 0) {
      setCurrent(1);
    } else if (current === 1) {
      const defaultAddress = userinfo?.addresses.find(
        (address) => address.isDefault
      );
      if (defaultAddress) {
        setCurrent(2);
      } else {
        message.error("Please select or add new address!");
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const processPayment = () => {
    dispatch(
      createOrder({
        userId: userinfo._id,
        items: cart,
        totalAmount: summary.totalPrice,
      })
    )
      .unwrap()
      .then(() => {
        message.success("Order Placed successfully!");
      })
      .catch(() => {
        message.error("Failed to create order!");
      });

    dispatch(finalizePayment(order?._id))
      .unwrap()
      .then(() => {
        message.success("Payment successful! Order placed.");
      })
      .catch(() => {
        message.error("Payment failed. Please try again.");
      });
  };

  const steps = [
    {
      title: "Order Summary",
      content: (
        <>
          <CartItem cart={item} summary={summary} />
          <p>Total Price: ${summary?.totalPrice}</p>
        </>
      ),
    },
    {
      title: "Select Shipping Address",
      content: <AddressManagement />,
    },
    {
      title: "Payment",
      content: (
        <div>
          <p>Complete your payment to place the order.</p>
          <Button type="primary" onClick={processPayment} loading={loading}>
            Pay Now
          </Button>
        </div>
      ),
    },
  ];


  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    textAlign: "center",
    marginTop: 16,
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next} loading={loading}>
                Next
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={processPayment} loading={loading}>
                Finish
              </Button>
            )}
            {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={prev}>
                Previous
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderCheckout;
