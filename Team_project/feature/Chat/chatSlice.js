import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChatAPI, sendMessageAPI } from './chatAPI';

// Fetch existing chat
export const fetchChat = createAsyncThunk('chat/fetchChat', async ({ productId, buyerEmail, sellerEmail }, { rejectWithValue }) => {
  try {
    const data = await fetchChatAPI({ productId, buyerEmail, sellerEmail });
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});



// Send a new message
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ productId, buyerEmail, sellerEmail, sender, message }, { rejectWithValue }) => {
  try {
    const data = await sendMessageAPI({ productId, buyerEmail, sellerEmail, sender, message });
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});



const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chat: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {        
        state.loading = false;
        state.chat = action.payload;
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default chatSlice.reducer;
