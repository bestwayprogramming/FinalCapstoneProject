const express = require("express");
const { getChatByProduct, sendMessage, getChatsForSeller, updateProductRequest } = require("../controller/chatController");
const router = express.Router();

// Get chat for a product
router.get("/chat/product/:productId", getChatByProduct);

// Send a message in a chat
router.post("/chat/send-message/:productId", sendMessage);

// Get chats for a seller
router.get("/chat/:sellerEmail", (req, res) => {
  getChatsForSeller(req, res);
});

// update message product request 
router.post("/chat/update-product-request/:productId", updateProductRequest);

module.exports = router;
