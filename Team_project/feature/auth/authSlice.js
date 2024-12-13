// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser, apiverifyOtp, deleteOrderFromHistoryAPI, fetchUserOrderHistoryAPI, getuserProfile, updateUserProfileAPI } from './authAPI';
import { updateOrderStatusAPI } from "../Order/orderAPI";

export const loginUser = createAsyncThunk("auth/loginUser", async (formData, { rejectWithValue }) => {
  try {
    return await apiLoginUser(formData.email, formData.password); // Call the API directly
  } catch (error) {
    return rejectWithValue(error.message); // Use the error message directly
  }
});

export const registerUser = createAsyncThunk("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    return await apiRegisterUser(formData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    return await apiverifyOtp({ email, otp });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchuserprofile = createAsyncThunk('auth/userinfo', async ({ email }, { rejectWithValue }) => {
  try {
    return await getuserProfile({ email });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updatedData, { rejectWithValue }) => {
    try {
      return await updateUserProfileAPI(updatedData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchUserOrderHistory = createAsyncThunk(
  'auth/fetchUserOrderHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchUserOrderHistoryAPI(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'auth/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = updateOrderStatusAPI({ orderId, status });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOrderFromHistory = createAsyncThunk(
  'order/deleteOrderFromHistory',
  async ({userId, orderId}, { rejectWithValue }) => {
    try {
      const updatedOrder = await deleteOrderFromHistoryAPI({userId, orderId});
      return updatedOrder;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userinfo: null,
    orderHistory: [],
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userinfo = null;
      state.orderHistory = [];
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      localStorage.removeItem("userType");
      ; // Remove email from local storage on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", state.user.userEmail);
        localStorage.setItem("userType", state.user.userType)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchuserprofile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchuserprofile.fulfilled, (state, action) => {
        state.loading = false;
        state.userinfo = action.payload;
      })
      .addCase(fetchuserprofile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user profile";
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userinfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrderHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchUserOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orderHistory = state.orderHistory.map((order) =>
          order.orderId._id === updatedOrder.order._id ? { ...order, orderId: updatedOrder.order } : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrderFromHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrderFromHistory.fulfilled, (state, action) => {
        state.loading = false;
        const deletedOrderId = action.payload.orderId; // Assuming the API returns the deleted order's ID
        state.orderHistory = state.orderHistory.filter(
          (order) => order.orderId._id !== deletedOrderId
        );
      })
      .addCase(deleteOrderFromHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete order";
      });


  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
