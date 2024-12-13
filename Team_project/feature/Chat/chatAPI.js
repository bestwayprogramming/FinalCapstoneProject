import axios from 'axios';
import { API_URL } from '../auth/authAPI';

export const fetchChatAPI = async ({ productId, buyerEmail, sellerEmail }) => {
  try {
    const response = await axios.get(`${API_URL}/chat/product/${productId}?buyerEmail=${buyerEmail}&sellerEmail=${sellerEmail}`);
    return response.data; // Return chat data on successful fetch
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch chat.");
    }
    throw new Error("Network error. Please try again later.");
  }
};

export const fetchChatsAPI = async (sellerEmail) => {
  try {
    const response = await axios.get(`${API_URL}/chat/${sellerEmail}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to fetch chats.");
    }
    throw new Error("Network error. Please try again later.");
  }
};

export const sendMessageAPI = async ({ productId, buyerEmail, sellerEmail, sender, message, productRequest }) => {
  try {
    const response = await axios.post(`${API_URL}/chat/${productId}`, {
      buyerEmail,
      sellerEmail,
      sender,
      message,
      productRequest
    });
    return response.data; // Return updated chat data on successful message send
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to send message.");
    }
    throw new Error("Network error. Please try again later.");
  }
};

export const sendMessagefromsellerAPI = async ({ productId, sellerEmail, buyerEmail, sender, message, productRequest }) => {
  try {
    const response = await axios.post(`${API_URL}/chat/send-message/${productId}`, {
      message,
      sellerEmail,
      buyerEmail,
      sender,
      productRequest
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to send message.");
    }
    throw new Error("Network error. Please try again later.");
  }
}

export const updateProductRequestAPI = async ({
  productId,
  buyerEmail,
  sellerEmail,
  accept,
  reject,
  requestId
}) => {
  try {
    const response = await axios.post(`${API_URL}/chat/update-product-request/${productId}`, {
      sellerEmail,
      buyerEmail,
      accept,
      reject,
      requestId
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to update message.");
    }
    throw new Error("Network error. Please try again later.");
  }
}
