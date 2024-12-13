import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import productReducer from "../feature/product/productSlice";
import navigationReducer from "../feature/navigation/navigationSlice";
import chatReducer from "../feature/Chat/chatSlice";
import chatReducer2 from "../feature/Chat/chatSliceSeller";
import wishlist from "../feature/Wishlist/wishlistSlice";
import cart from "../feature/Cart/cartSlice";
import order from "../feature/Order/orderSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    navigation: navigationReducer,
    chat: chatReducer,
    chat2: chatReducer2,
    wishlist: wishlist,
    cart: cart,
    order: order,
  },
});

export default store;
