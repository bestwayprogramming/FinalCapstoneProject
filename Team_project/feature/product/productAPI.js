import { API_URL } from "../auth/authAPI";
import axios from 'axios';


export const addProduct = async (productData) => {
    try {
      const response = await axios.post(`${API_URL}/product/add-product`, productData);
      return response.data; // Return product data on successful addition
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Failed to add product.");
      }
      throw new Error("Network error. Please try again later.");
    }
  };

  export const getUserProducts = async (ownerEmail) => {
    try {
      const response = await axios.post(`${API_URL}/product/get-products`, { ownerEmail });
      return response.data; // Return products on success
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Failed to fetch products.");
      }
      throw new Error("Network error. Please try again later.");
    }
  };
  

  export const getAllProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/all-products`);
      return response.data; // Return products on success
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error || "Failed to fetch products.");
      }
      throw new Error("Network error. Please try again later.");
    }
  };


export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/get-product/${productId}`);
    return response.data; // Return the product data on success
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch product.");
    }
    throw new Error("Network error. Please try again later.");
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    console.log("\n\n\n\nproduct", productId, {...updatedData})
    const response = await axios.patch(`${API_URL}/product/update-product/${productId}`, updatedData);
    return response.data; // Return updated product data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to update product.');
    }
    throw new Error('Network error. Please try again later.');
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/product/delete-product/${productId}`);
    return response.data; // Returns success message on deletion
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to delete product.");
    }
    throw new Error("Network error. Please try again later.");
  }
};