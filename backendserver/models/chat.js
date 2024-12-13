const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    productId: { type: String, ref: "Product", required: true },
    buyerEmail: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    messages: [
      {
        sender: { type: String, required: true }, // Either 'buyer' or 'seller'
        message: { type: String, required: true },
        messageId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Unique ID for product request
        productRequest: {
          id: { type: String }, // Product ID (Optional)
          email: { type: String }, // Product name (Optional)
          price: { type: Number }, // Product price (Optional)
          color: { type: String },
          size: { type: String }, // Product color (Optional)
          accept: { type: Boolean }, // Whether the request is accepted (Defaults to false)
          reject: { type: Boolean },
          requestId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Unique ID for product request
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
