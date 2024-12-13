import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addToCartAPI, fetchCartItemsAPI, getCartTotalAPI, removeFromCartAPI, updateCartItemsAPI } from './cartAPI';

const initialState = {
  cart: [],
  summary: {
    totalItems: 0,
    totalPrice: 0,
  },
  status: 'idle',
  error: null,
};

// Thunk to add product to cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, price, size, color, requested }, { rejectWithValue }) => {
    try {
      const cart = await addToCartAPI({ userId, productId, price, size, color, requested });
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a product from the cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      const cart = await removeFromCartAPI({ userId, itemId });
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (email, { rejectWithValue }) => {
    try {
      const cartItems = await fetchCartItemsAPI(email);
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItems = createAsyncThunk(
  'cart/updateCartItems',
  async ({ userId, itemId, price, size, color, quantity }, { rejectWithValue }) => {
    try {
      const cartItems = await updateCartItemsAPI({ userId, itemId, price, size, color, quantity });
      return cartItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get cart total
export const getCartTotal = createAsyncThunk(
  'cart/getCartTotal',
  async (userId, { rejectWithValue }) => {
    try {
      const summary = await getCartTotalAPI(userId);
      console.log("gtigrgir", summary);

      return summary;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        console.log("Before removal:", state.cart);
        state.cart = action.payload;
        console.log("After removal:", state.cart);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItems.fulfilled, (state, action) => {
        // Find and update the cart item

        console.log("mayank", action.payload);
        
        const updatedCart = state.cart.map((item) =>
          item.product._id === action.payload.cart[0].product._id
            ? { ...item, ...action.payload }
            : item
        );

        console.log("knekwkenekqwnkenqknek",updateCartItems);
        
        state.cart = action.payload.cart;
        state.status = 'succeeded';
      })
      .addCase(updateCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getCartTotal.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCartTotal.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getCartTotal.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default cartSlice.reducer;
