import React from "react";
import Navbar from "../component/Navbar";
import Favorite from "../component/Favorite";
import { Card } from "antd";
import Cart from "../component/Cart";

const CartPage = () => {
  return (
    <>
      <Navbar></Navbar>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Card className="w-full max-w-2xl p-6 shadow-lg">
            <Cart />
          </Card>
        </div>
      </main>
    </>
  );
};

export default CartPage;
