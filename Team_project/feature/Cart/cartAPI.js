import axios from 'axios';
import { API_URL } from '../auth/authAPI';


// Add a product to the cart
export const addToCartAPI = async ({ userId, productId, price, size, color, requested }) => {
    try {
        const response = await axios.post(`${API_URL}/cart/add`, { userId, productId, price, size, color, requested });
        return response.data.cart;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to add product to cart.');
        }
        throw new Error('Network error. Please try again later.');
    }
};

// Remove a product from the cart
export const removeFromCartAPI = async ({ userId, itemId }) => {
    try {
        const response = await axios.delete(`${API_URL}/cart/remove`, {
            data: { userId, itemId },
        });
        return response.data.cart;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to remove product from cart.');
        }
        throw new Error('Network error. Please try again later.');
    }
};

// Fetch all cart items
export const fetchCartItemsAPI = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/cart/getCartItems`, {
            params: { email }
        });
        return response.data.cartItems;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to fetch cart items.');
        }
        throw new Error('Network error. Please try again later.');
    }
};

export const updateCartItemsAPI = async ({
    userId,
    itemId,
    price,
    size,
    color,
    quantity,
}) => {
    try {
        const response = await axios.post(`${API_URL}/cart/updateCart`, {
            userId, itemId, price, size, color, quantity
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to calculate cart total.');
        }
        throw new Error('Network error. Please try again later.');
    }
}

// Get cart total
export const getCartTotalAPI = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/cart/summary`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Failed to calculate cart total.');
        }
        throw new Error('Network error. Please try again later.');
    }
};
