const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/user');
const Product = require("../models/product");


const createOrder = async (req, res) => {
  const { userId, items, totalAmount } = req.body;

  try {
    // Fetch the user to get the default address
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const defaultAddress = user.addresses.find((address) => address.isDefault) || null;

    // Map through items to populate seller for each product
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error(`Product with ID ${item.product} not found`);
        }

        // Validate if the product.owner is an ObjectId
        if (!mongoose.Types.ObjectId.isValid(product.owner)) {
          const seller = await User.findOne({ email: product.owner });
          // Find user by email
          if (seller) {
            product.owner = seller._id; // Update to ObjectId
            // await product.save(); // Persist the change
          } else {
            throw new Error(`Seller not found for product ID ${item.product}`);
          }
        }

        return {
          product: item.product,
          seller: product.owner, // This will now be an ObjectId
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        };
      })
    );

    // Create a new order
    const newOrder = new Order({
      user: userId,
      items: itemsWithSeller, // Include items with seller details
      totalAmount,
      shippingAddress: defaultAddress,
      paymentStatus: 'paid',
    });

    await newOrder.save();

    // Add the order to the user's order history
    await User.findByIdAndUpdate(userId, {
      $push: {
        orderHistory: {
          orderId: newOrder,
          purchasedAt: newOrder.placedAt,
          totalAmount,
        },
      },
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find and update the order status
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = Date.now(); // Update timestamp
    await order.save();

    // Populate product details, user details, and seller details
    const updatedOrder = await Order.findById(orderId)
      .populate({
        path: 'items.product',
        select: '_id name images description', // Select fields for products
      })
      .populate({
        path: 'user',
        select: 'firstName lastName email mobile', // Select fields for the user
      })
      .populate({
        path: 'items.seller',
        select: 'firstName lastName email mobile', // Select fields for the seller
      })
      .lean(); // Convert Mongoose Document to a plain JavaScript object

    // Map over the items to include the populated product details
    const responseOrder = {
      ...updatedOrder,
      items: updatedOrder.items.map((item) => ({
        ...item,
        product: item.product ? {
          _id: item.product._id,
          name: item.product.name,
          images: item.product.images,
          description: item.product.description,
        } : null,
        seller: item.seller ? {
          firstName: item.seller.firstName,
          lastName: item.seller.lastName,
          email: item.seller.email,
          mobile: item.seller.mobile,
        } : null,
      })),
      user: updatedOrder.user ? {
        firstName: updatedOrder.user.firstName,
        lastName: updatedOrder.user.lastName,
        email: updatedOrder.user.email,
        mobile: updatedOrder.user.mobile,
      } : null,
    };

    res.status(200).json({ message: 'Order status updated successfully', order: responseOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

const removeOrderFromHistory = async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.orderHistory.length;
    user.orderHistory = user.orderHistory.filter(
      (order) => order.orderId.toString() !== orderId
    );

    if (initialLength === user.orderHistory.length) {
      return res.status(404).json({ message: "Order not found in user's history" });
    }

    await user.save();

    res.status(200).json({
      message: "Order removed successfully from user's history",
      orderId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};



const updateAddressInYourOrder = async (req, res) => {
  const { orderId } = req.params;
  const { shippingAddress } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { shippingAddress },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Shipping address updated', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error updating address', error: err.message });
  }
};


const paymentSuccess = async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Order Placed', paymentStatus: 'Paid', updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Payment successful, order placed', order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error finalizing payment', error: err.message });
  }
};



const getsellerOrder = async (req, res) => {
  try {
    // const userEmail = req.query.email; // Replace with the user's email from frontend
    const productOwnerEmail = 'test@gmail.com'; // Replace with the desired product owner email

    // Find user by email
    const user = await User.findOne({ email: productOwnerEmail });

    if (!user) {
      return res.status(404).send('User not found');
    }


    // console.log("gnnrngkrnkgkenrskn\n\n\n", await Order.find({ user: user._id }) );

    // Fetch orders for the user and filter products by owner
    const orders = await Order.find({ user: user._id })
      .populate({
        path: 'items.product',
        match: { owner: productOwnerEmail }
      });

    if (!orders) {
      return res.status(404).send('Orders not found');
    }

    res.json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};




const fetchSellerOrders = async (req, res) => {
  const sellerId = req.query.Productseller; // Get sellerId from request

  if (!sellerId) {
    return res.status(400).json({ message: 'Seller ID is required' });
  }

  try {
    const productSeller = await User.findById(sellerId);
    if (!productSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const seller = new mongoose.Types.ObjectId(productSeller._id); // Convert seller ID to ObjectId

    // Fetch orders with selected user and product details
    const orders = await Order.aggregate([
      {
        $match: {
          'items.seller': seller, // Filter orders by seller ID
        },
      },
      {
        $lookup: {
          from: 'users', // Collection to join with
          localField: 'user', // Field from orders
          foreignField: '_id', // Field in users collection
          as: 'userData', // Output array field
          pipeline: [
            { $project: { firstName: 1, lastName: 1, email: 1, mobile: 1 } }, // Select only required fields
          ],
        },
      },
      {
        $unwind: '$userData', // Flatten the userData array
      },
      {
        $unwind: '$items', // Flatten items to process each separately
      },
      {
        $lookup: {
          from: 'products', // Collection to join with
          localField: 'items.product', // Field from items
          foreignField: '_id', // Field in products collection
          as: 'productData', // Output array field
          pipeline: [
            { $project: { name: 1, description: 1, images: 1 } }, // Select only required fields
          ],
        },
      },
      {
        $unwind: '$productData', // Flatten the productData array
      },
      {
        $group: {
          _id: '$_id', // Group by order ID
          user: { $first: '$userData' },
          shippingAddress: { $first: '$shippingAddress' },
          status: { $first: '$status' },
          totalAmount: { $first: '$totalAmount' },
          paymentStatus: { $first: '$paymentStatus' },
          placedAt: { $first: '$placedAt' },
          updatedAt: { $first: '$updatedAt' },
          items: {
            $push: {
              product: '$productData',
              quantity: '$items.quantity',
              size: '$items.size',
              color: '$items.color',
              price: '$items.price',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          user: 1,
          shippingAddress: 1,
          status: 1,
          totalAmount: 1,
          paymentStatus: 1,
          placedAt: 1,
          updatedAt: 1,
          items: 1,
        },
      },
    ]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this seller' });
    }

    res.status(200).json({ message: 'Orders fetched successfully', orders });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};


const getUserOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and populate order history
    const user = await User.findById(userId)
      .select('orderHistory') // Only select the orderHistory field
      .populate({
        path: 'orderHistory.orderId',
        model: 'Order',
        populate: [
          {
            path: 'items.product',
            model: 'Product',
            select: 'name images description', // Fetch specific fields
          },
          {
            path: 'items.seller',
            model: 'User',
            select: 'firstName lastName email mobile', // Fetch specific fields
          },
        ],
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }



    res.status(200).json({ orderHistory: user.orderHistory });
  } catch (error) {
    console.error('Error fetching order history:', error.message);
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};


// const fetchSellerOrders = async (req, res) => {
//   const sellerId = req.query.Productseller; // Seller ID from query parameter

//   if (!sellerId) {
//     return res.status(400).json({ message: 'Seller ID is required' });
//   }

//   try {
//     // Ensure sellerId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(sellerId)) {
//       return res.status(400).json({ message: 'Invalid Seller ID' });
//     }

//     const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

//     // Fetch orders with selected user and product details
//     const orders = await Order.aggregate([
//       {
//         $match: {
//           'items.seller': sellerObjectId, // Match orders with the seller ID in items
//         },
//       },
//       {
//         $lookup: {
//           from: 'users', // Join with users collection
//           localField: 'user', // Match user field in orders
//           foreignField: '_id', // Match _id field in users
//           as: 'userData', // Store joined data as userData
//         },
//       },
//       {
//         $unwind: '$userData', // Flatten userData array
//       },
//       {
//         $lookup: {
//           from: 'products', // Join with products collection
//           localField: 'items.product', // Match product in items
//           foreignField: '_id', // Match _id in products
//           as: 'productData', // Store joined data as productData
//         },
//       },
//       {
//         $unwind: '$items', // Flatten items array
//       },
//       {
//         $lookup: {
//           from: 'products', // Lookup again for each item.product
//           localField: 'items.product',
//           foreignField: '_id',
//           as: 'productDetails',
//         },
//       },
//       {
//         $unwind: '$productDetails', // Flatten productDetails array
//       },
//       {
//         $project: {
//           _id: 1,
//           'user._id': '$userData._id',
//           'user.firstName': '$userData.firstName',
//           'user.lastName': '$userData.lastName',
//           'user.email': '$userData.email',
//           'user.mobile': '$userData.mobile',
//           shippingAddress: 1,
//           status: 1,
//           totalAmount: 1,
//           paymentStatus: 1,
//           placedAt: 1,
//           updatedAt: 1,
//           items: {
//             _id: '$items._id',
//             quantity: '$items.quantity',
//             size: '$items.size',
//             color: '$items.color',
//             price: '$items.price',
//             product: {
//               _id: '$productDetails._id',
//               name: '$productDetails.name',
//               images: '$productDetails.images',
//               description: '$productDetails.description',
//             },
//           },
//         },
//       },
//     ]);

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'No orders found for this seller' });
//     }

//     res.status(200).json({ message: 'Orders fetched successfully', orders });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching orders', error: err.message });
//   }
// };




module.exports = { createOrder, paymentSuccess, updateAddressInYourOrder, removeOrderFromHistory, getsellerOrder, fetchSellerOrders, updateOrderStatus, getUserOrderHistory };
