import React, { useEffect, useState } from "react";
import { Card, Button, Carousel, Skeleton, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../feature/product/productSlice";
import { updateProductRequest } from "../feature/Chat/chatSliceSeller";
import Notify from "./Notify";
import OrderCheckout from "./orderCheckOut";
import { addToCart } from "../feature/Cart/cartSlice";
import { mapColorsToHex } from "../Constant/const";

const { Countdown } = Statistic;

const ProductRequestCard = ({ productRequest }) => {
  const dispatch = useDispatch();
  // const { product, loading } = useSelector((state) => state.product);
  const { products } = useSelector((state) => state.product);
  const { userinfo, loading, error } = useSelector((state) => state.auth);

  const [isOrderButtonVisible, setOrderButtonVisible] = useState(false);
  const [isCardDisabled, setCardDisabled] = useState(false);
  const [showOrderButton, setShowOrderButtton] = useState(true);
  const [isCheckoutVisible, setCheckoutVisible] = useState(false);

  const { email } = productRequest;
  const user = localStorage.getItem("user");
  const userType = localStorage.getItem("userType");

  let product = products.find((item) => item.id === productRequest.id);

  useEffect(() => {
    dispatch(fetchProductById(productRequest.id));
  }, [dispatch, productRequest.id]);

  const handleUpdate = (type) => {
    const isAccept = type === "accept";

    if (!product || !productRequest || !productRequest.requestId) {
      Notify({
        type: "error",
        message: "Required data is missing.",
      });
      return;
    }

    dispatch(
      updateProductRequest({
        productId: product.id,
        buyerEmail: userType === "buyer" ? user : productRequest.email,
        sellerEmail: product?.owner, // Access safely
        accept: isAccept,
        reject: !isAccept,
        requestId: productRequest.requestId,
      })
    )
      .unwrap()
      .then(() => {
        Notify({
          type: "success",
          message: `Product Request ${isAccept ? "Accepted" : "Rejected"}`,
        });
        if (isAccept && userType !== "seller") {
          setOrderButtonVisible(true);
        } else {
          setCardDisabled(true);
        }
      })
      .catch((err) => {
        Notify({
          type: "error",
          message: `Failed to ${isAccept ? "Accept" : "Reject"} Request`,
          description: err.message,
        });
      });

      setShowOrderButtton(true);
  };

  const handleOrderNow = () => {
    setCheckoutVisible(true); // Show Checkout page when "Order Now" is clicked
    let product = products.find((item) => item.id === productRequest.id);

     dispatch(
      addToCart({
        userId: userinfo._id,
        productId: product.id,
        price: productRequest.price,
        size: productRequest.size,
        color: mapColorsToHex([productRequest.color]).toString(),
        requested: true,
      })
    ).unwrap();

    Notify({
      type: "success",
      message: "Product successfully added to your cart!",
      description: "You can now proceed to checkout .",
    });

    setShowOrderButtton(false)

  };

  const shouldShowButtons = email !== user;

  return (
    <Card
      title={`Product Request: ${product?.name || "Loading..."}`}
      style={{ width: 300, marginBottom: 16 }}
      cover={
        <Carousel autoplay={true} autoplaySpeed={2000}>
          {product?.images?.map((image, index) => (
            <img
              key={index}
              alt={product?.imageAlt || "Product"}
              src={image}
              className="h-64 object-cover object-center"
            />
          ))}
        </Carousel>
      }
      actions={
        !isCardDisabled && shouldShowButtons
          ? [
              <Button
                type="primary"
                disabled={productRequest.accept || productRequest.reject}
                onClick={() => handleUpdate("accept")}
              >
                Accept
              </Button>,
              <Button
                type="primary"
                danger
                disabled={productRequest.accept || productRequest.reject}
                onClick={() => handleUpdate("reject")}
              >
                Reject
              </Button>,
            ]
          : []
      }
      disabled={isCardDisabled}
    >
      <p>
        <strong>Price:</strong> ${productRequest.price}
      </p>
      <p>
        <strong>Color:</strong> {productRequest.color}
      </p>
      <p>
        <strong>Size:</strong> {productRequest.size}
      </p>
      <p>
        <strong>Status:</strong>{" "}
        {productRequest.accept
          ? "Accepted"
          : productRequest.reject
          ? "Rejected"
          : "Pending"}
      </p>

      {(isOrderButtonVisible ||
        (productRequest?.accept && product?.owner !== user)) && (
        <div>
          <Button type="primary" onClick={handleOrderNow} className="b-block">
            Order Now
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProductRequestCard;
