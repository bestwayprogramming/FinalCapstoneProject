import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createOrderAPI, fetchOrdersAPI, finalizePaymentAPI, updateOrderStatusAPI, updateShippingAddressAPI } from './orderAPI';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const order = await createOrderAPI(orderData);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  'order/updateShippingAddress',
  async ({ orderId, shippingAddress }, { rejectWithValue }) => {
    try {
      const response = await updateShippingAddressAPI({ orderId, shippingAddress });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const finalizePayment = createAsyncThunk(
  'order/finalizePayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await finalizePaymentAPI(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (filterParams, { rejectWithValue }) => {
    try {
      const orders = await fetchOrdersAPI(filterParams); // API call to fetch orders
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const updatedOrder = await updateOrderStatusAPI({ orderId, status });
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Order slice
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [],
    loading: false,
    error: null,
    step: 0, // Track the current step in the checkout process
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.error = null;
      state.loading = false;
      state.step = 0; // Reset step to 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.step = 1; // Set step to 1 after order is created
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShippingAddress.fulfilled, (state) => {
        state.loading = false;
        state.step = 2; // Set step to 2 after updating shipping address
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(finalizePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(finalizePayment.fulfilled, (state) => {
        state.loading = false;
        state.step = 3;
      })
      .addCase(finalizePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);

        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
