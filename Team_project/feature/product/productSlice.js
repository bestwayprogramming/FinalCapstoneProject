// src/redux/productSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addProduct as addProductAPI, getUserProducts, deleteProduct as deleteProductAPI, updateProduct as updateProductAPI, getProductById, getAllProducts } from '../product/productAPI';

// Define an initial state
const initialState = {
  products: [],
  product: {
    id: '',
    name: '',
    images: null,
    imageAlt: '',
    price: '',
    color: '',
    sizes: '',
    type: '',
    condition: '',
    category: '',
    description: '',
    owner: '',
  },
  loading: false,
  error: null,
};

// Async thunk for adding a product
export const addProduct = createAsyncThunk(
  'product/add',
  async (productData, { rejectWithValue }) => {
    try {
      const data = await addProductAPI(productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateProduct = createAsyncThunk(
  'product/update',
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const data = await updateProductAPI(productId, updatedData);
      return data; // Return the updated product
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await deleteProductAPI(productId);
      return productId; // Pass the ID back to remove it from the state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const product = await getProductById(productId); // Use the API function
      return product; // Return product data
    } catch (error) {
      return rejectWithValue(error.message); // Reject if there's an error
    }
  }
);



export const fetchUserProducts = createAsyncThunk(
  'product/fetchUserProducts',
  async (ownerEmail, { rejectWithValue }) => {
    try {
      const products = await getUserProducts(ownerEmail);
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (_,{rejectWithValue }) => {
    try {
      const products = await getAllProducts();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetProduct: (state) => {
      state.product = { ...initialState.product };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products.push(action.payload); // Adding new product
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product.";
      })
      .addCase(fetchUserProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete product.";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Find the index of the updated product in the products array
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // Update product in the array
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product.';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload; // Store fetched product data
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product.";
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Reset error state
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.products = action.payload; // Populate products with fetched data
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload || 'Something went wrong'; // Set error message
      });

  }

});

export const { resetProduct } = productSlice.actions;
export default productSlice.reducer;

