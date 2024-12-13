const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  accountType: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure email is unique
  password: { type: String, required: true },
  addresses: {
    type: [
      {
        label: { type: String, default: "Home" },
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
        country: { type: String, default: "" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    default: [],
  },
  wishlist: {
    type: [
      {
        productId: { type: String, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  orderHistory: {
    type: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        purchasedAt: { type: Date },
        totalAmount: { type: Number },
      },
    ],
    default: [],
  },
  cart: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference to the Product model
        quantity: { type: Number, default: 1 }, // Quantity of the product
        size: { type: String, required: true }, // Size of the product
        color: { type: String, required: true },
        price: { type: String, required: true },
        requested: {type: Boolean, default: false}, // Color of the product
        addedAt: { type: Date, default: Date.now }, // Timestamp when the product was added
      },
    ],
    default: [],
  },
  profilePicture: { type: String, default: "" },
}, { timestamps: true }); 

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;



