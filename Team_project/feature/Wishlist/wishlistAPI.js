import axios from "axios";
import { API_URL } from "../auth/authAPI";

export const fetchWishlistAPI = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/wishlist/${userId}`);
        return response.data; // Returns the wishlist items
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to fetch wishlist.");
        }
        throw new Error("Network error. Please try again later.");
    }
};



export const addToWishlistAPI = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_URL}/wishlist/add`, { userId, productId });
        return response.data; // Returns updated wishlist
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to add to wishlist.");
        }
        throw new Error("Network error. Please try again later.");
    }
};


export const removeFromWishlistAPI = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_URL}/wishlist/remove`, { userId, productId });
        return response.data; // Returns updated wishlist
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to remove from wishlist.");
        }
        throw new Error("Network error. Please try again later.");
    }
};



export const getWishlistProductsAPI = async (userId) => {
    try {
        console.log("\n\n\n\njebkfejkwbfbw", userId);
        
        const response = await axios.get(`${API_URL}/wishlist/products`, { 
            params: { userId }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || "Failed to fetch wishlist products.");
        }
        throw new Error("Network error. Please try again later.");
    }
};