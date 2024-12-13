// chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatsAPI, sendMessagefromsellerAPI, updateProductRequestAPI } from './chatAPI';



export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (sellerEmail, { rejectWithValue }) => {
    try {
      const data = await fetchChatsAPI(sellerEmail);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ productId, sellerEmail, buyerEmail, sender, message, productRequest }, { rejectWithValue }) => {
    try {
      const data = await sendMessagefromsellerAPI({
        productId,
        sellerEmail,
        buyerEmail,
        sender,
        message,
        productRequest: productRequest ? productRequest : null
      });
      return data;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProductRequest = createAsyncThunk(
  "chat/updateProductRequest",
  async ({ productId, buyerEmail, sellerEmail, accept, reject, requestId }, { rejectWithValue }) => {
    try {
      const data = await updateProductRequestAPI({
        productId,
        buyerEmail,
        sellerEmail,
        accept,
        reject,
        requestId,
      });
      console.log("API Response:", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const chatIndex = state.chats.findIndex(chat => chat.productId === action.payload.productId);

        console.log("mayank\n\n\n\n", state.chats);
        
        if (chatIndex >= 0) {
          state.chats[chatIndex] = action.payload;
          console.log("mayank22222222\n\n\n\n", state.chats);

        } else {
          state.chats.push(action.payload);
          console.log("mayank3333333\n\n\n\n", state.chats);

        }

      })
      .addCase(updateProductRequest.pending, (state) => {
        state.loading = true;
        
      })
      .addCase(updateProductRequest.fulfilled, (state, action) => {
        state.loading = false;
        const chatIndex = state.chats.findIndex(
          (chat) => chat.productId === action.payload.productId
        );
        if (chatIndex >= 0) {
          state.chats[chatIndex] = action.payload;
        }
        
      })
      .addCase(updateProductRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export default chatSlice.reducer;
