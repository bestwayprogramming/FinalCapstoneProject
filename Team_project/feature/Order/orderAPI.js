import axios from 'axios';
import { API_URL } from '../auth/authAPI';


export const createOrderAPI = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/order/create-order`, orderData);
    return response.data.order;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to create order.');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateShippingAddressAPI = async ({ orderId, shippingAddress }) => {
  try {
    const response = await axios.put(`${API_URL}/order/update-address/${orderId}`, { shippingAddress });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to update shipping address.');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const finalizePaymentAPI = async (orderId) => {
  try {
    const response = await axios.put(`${API_URL}/order/finalize-payment/${orderId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Payment failed.');
    }
    throw new Error('Network error. Please try again later.');
  }
};


export const fetchOrdersAPI = async (filterParams) => {
  try {
    const response = await axios.get(`${API_URL}/order/seller-orders`, {
      params: filterParams // Pass filterParams as URL query parameters
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch orders.');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updateOrderStatusAPI = async ({ orderId, status }) => {
  try {
    const response = await axios.put(`${API_URL}/order/update-status/${orderId}`, { status });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update order status.');
    }
    throw new Error('Network error. Please try again later.');
  }
};



