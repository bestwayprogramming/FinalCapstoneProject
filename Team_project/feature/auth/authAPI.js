// src/features/auth/authAPI.js

import axios from "axios";

export const API_URL = "http://localhost:3001/api"; // Base URL for the API

// API call to login a user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data; // Return user data on successful login
  } catch (error) {
    if (error.response) {
      // Return specific error message based on server response
      if (error.response.status === 401) {
        throw new Error("Incorrect password. Please try again.");
      } else if (error.response.status === 404) {
        throw new Error("No user found with this email.");
      }
    }
    throw new Error("An unexpected error occurred."); // Default error message
  }
};

// API call to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data; // Return success message on successful registration
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error); // Return server-provided error
    }
    throw new Error("An unexpected error occurred."); // Default error message
  }
};


export const apiverifyOtp = async ({ email, otp }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verifyOtp`, { email, otp });
    return response.data; // Return success message on successful OTP send
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error); // Return server-provided error
    }
    throw new Error("An unexpected error occurred."); // Default error message
  }
};


export const getuserProfile = async ({ email }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/userinfo`, { email });
    return response.data; // Return success message on successful OTP send
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error); // Return server-provided error
    }
    throw new Error("An unexpected error occurred."); // Default error message
  }
};


export const updateUserProfileAPI = async (updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/update-profile`, updatedData);
    return response.data.user; // Return the updated user object
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error); // Return server-provided error
    }
    throw new Error("An unexpected error occurred."); // Default error message
  }
};


export const fetchUserOrderHistoryAPI = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/order/order-history/${userId}`);
    return response.data.orderHistory;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch chats.");
    }
    throw new Error("Network error. Please try again later.");
  }
};


export const deleteOrderFromHistoryAPI = async ({ userId, orderId }) => {
  try {
    // Updated API endpoint to include userId and orderId
    const response = await axios.delete(`${API_URL}/order/remove/${userId}/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete order from history.');
    }
    throw new Error('Network error. Please try again later.');
  }
};