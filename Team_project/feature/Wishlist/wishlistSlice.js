import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToWishlistAPI, fetchWishlistAPI, getWishlistProductsAPI, removeFromWishlistAPI } from './wishlistAPI';

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetchWishlist',
    async (userId, { rejectWithValue }) => {
        try {
            return await fetchWishlistAPI(userId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            return await addToWishlistAPI(userId, productId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async ({ userId, productId }, { rejectWithValue }) => {
        try {
            return await removeFromWishlistAPI(userId, productId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchWishlistProducts = createAsyncThunk(
    'wishlist/fetchWishlistProducts',
    async ({ userId }, { rejectWithValue }) => {
        try {
            return await getWishlistProductsAPI(userId);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { products: [], wishlistProducts: [], loading: false, error: null },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.products = action.payload;
                state.loading = false;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(fetchWishlistProducts.pending, (state) => {
                state.loading = true;   
                state.error = null;    
            })
            .addCase(fetchWishlistProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlistProducts = action.payload; 
            })
            .addCase(fetchWishlistProducts.rejected, (state, action) => {
                state.loading = false;  
                state.error = action.payload;
            });
    },
});

export default wishlistSlice.reducer;
