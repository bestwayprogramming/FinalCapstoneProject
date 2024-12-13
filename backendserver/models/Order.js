const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      quantity: { type: Number, required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    label: { type: String,},
    street: { type: String,},
    city: { type: String,},
    state: { type: String,},
    zipCode: { type: String,},
    country: { type: String,},
  },
  status: { type: String, default: 'Pending' }, // Pending, Shipped, Delivered, Cancelled
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Unpaid' }, // Unpaid, Paid
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
