const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require("../models/product"); // Assuming you have a product model

// Get wishlist
// router.get('/wishlist/:userId')

const getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('wishlist');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to wishlist
// router.post('/wishlist/add') 

const addToWishlist = async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check if productId is already in the wishlist (compare by productId string)
      if (!user.wishlist.some(item => item.productId === productId)) {
        user.wishlist.push({ productId }); // Pushing productId as a string
        await user.save();
      }
  
      res.status(200).json(user.wishlist);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Remove from wishlist
// router.post('/wishlist/remove')

const removeFromWishlist =async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter((product) => product.productId !== productId);
    await user.save();

    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getWishlistProducts = async (req, res) => {

    
    try {
      const userId = req.query.userId;
      // Get userId from query params
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get the productIds from the user's wishlist
      const wishlistProductIds = user.wishlist.map(item => item.productId);      
  
      // Query products by the 'id' field, which is a string in the Product schema
      const products = await Product.find({ id: { $in: wishlistProductIds } });
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {getWishlist, addToWishlist, removeFromWishlist, getWishlistProducts};
