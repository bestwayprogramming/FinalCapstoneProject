const Chat = require("../models/chat");
const Product = require("../models/product"); // Assuming you have a product model
const { Server } = require("socket.io");
const User = require("../models/user");


const getChatsForSeller = async (req, res) => {
  const { sellerEmail } = req.params;

  if (!sellerEmail) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find chats by sellerEmail or buyerEmail
    let chats = await Chat.find({ sellerEmail });
    if (!chats || chats.length === 0) {
      chats = await Chat.find({ buyerEmail: sellerEmail });
    }

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found" });
    }

    // Fetch product and user details for each chat
    const chatWithDetails = await Promise.all(
      chats.map(async (chat) => {
        // Fetch product details
        const product = await Product.findOne({ id: chat.productId });

        // Fetch buyer details
        const buyer = await User.findOne({ email: chat.buyerEmail }, { firstName: 1, lastName: 1, profilePicture: 1, email: 1 });

        // Fetch seller details
        const seller = await User.findOne({ email: chat.sellerEmail }, { firstName: 1, lastName: 1, profilePicture: 1, email: 1 });

        return {
          ...chat.toObject(),
          buyer: buyer || null, // Include buyer details
          seller: seller || null, // Include seller details
          productDetails: product || null, // Include product details
        };
      })
    );

    res.status(200).json(chatWithDetails);
  } catch (err) {
    console.error("Error fetching chats:", err.message);
    res.status(500).json({ message: err.message });
  }
};




const getChatByProduct = async (req, res) => {
  const { productId } = req.params;
  const { buyerEmail, sellerEmail } = req.query;
  try {
    // Find the product by _id (if the productId corresponds to _id)
    const product = await Product.findOne({ id: productId });  // This works if `id` is the custom field you want to query
    // Or, if you're querying by the default _id field in MongoDB:
    // const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const sellerEmailFromProduct = product.owner;

    // Check if a chat exists between the buyer and seller
    let chat = await Chat.findOne({ productId, buyerEmail, sellerEmail: sellerEmailFromProduct });

    console.log(chat);
    
    if (!chat) {
      chat = new Chat({
        productId,
        buyerEmail,
        sellerEmail: sellerEmailFromProduct,
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json(chat || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send a message in an existing chat
const sendMessage = async (req, res) => {
  const { productId } = req.params; // Get productId from the path
  const { buyerEmail, sellerEmail, message, sender, productRequest } = req.body;

  try {
    // Check if the product exists (using productId, which is a string)
    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the chat by buyerEmail and sellerEmail
    let chat = await Chat.findOne({ buyerEmail, sellerEmail });

    let productRequestdata = null;
    if (productRequest) {
      productRequestdata = {
        id: productRequest.productId,
        email: productRequest.email,
        price: productRequest?.price,
        color: productRequest?.color,
        size: productRequest.size,
        accept: false,
        reject: false,
      };
    }

    if (!chat) {
      // If no chat exists, create a new one with productRequest
      chat = new Chat({
        productId, // Assign productId for the new chat
        buyerEmail,
        sellerEmail,
        messages: [{ sender, message, productRequestdata }],
      });

      await chat.save();
    } else {
      // If chat exists, append the message with productRequest
      chat.messages.push({ sender, message, productRequest: productRequestdata });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ message: err.message });
  }
};




const updateProductRequest = async (req, res) => {

  const { productId } = req.params;
  const { buyerEmail, sellerEmail, accept, reject, requestId } = req.body;  
  
  try {
    const chat = await Chat.findOne({ buyerEmail, sellerEmail });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messageIndex = chat.messages.findIndex(
      (msg) =>
        msg.productRequest &&
        msg.productRequest.id === productId && 
        msg.productRequest.requestId.toString() === requestId
      );
    
    if (messageIndex >= 0) {
      chat.messages[messageIndex].productRequest.accept = accept || false;
      chat.messages[messageIndex].productRequest.reject = reject || false;
      await chat.save();

      res.status(200).json(chat);
    } else {
      res.status(404).json({ message: "Product Request not found in messages" });
    }
  } catch (err) {
    console.error("Error in updateProductRequest:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = { getChatByProduct, sendMessage, getChatsForSeller, updateProductRequest };
