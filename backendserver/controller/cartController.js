const express = require('express');
const UserModel = require('../models/user');
const ProductModel = require('../models/product');

const router = express.Router();

// Add to cart
// router.post('/cart/add',)
const addProductInCart = async (req, res) => {
    try {

        const { userId, productId, price, size, color, requested } = req.body;

        // Find the user by ID
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the product by ID (you should be using the 'id' field in the Product schema)
        const product = await ProductModel.findOne({ id: productId });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Add the product to the user's cart
        user.cart.push({
            product: product._id, // Store only the ObjectId of the product in the cart
            quantity: 1,
            size,
            color,
            price,
            requested,
            addedAt: new Date(),
        });
        await user.save();

        const updatedUser = await UserModel.findById(userId).populate('cart.product');

        // Send the response with the populated cart
        res.status(200).json({
            message: 'Product added to cart',
            cart: updatedUser.cart, // This will now contain full product details
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateCart = async (req, res) => {
    try {
        const { userId, itemId, price, size, color, quantity } = req.body;

        // Find the user by ID
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Find the specific cart item by itemId
        const cartItemIndex = user.cart.findIndex(
            (item) => item._id.toString() === itemId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Update the specific cart item
        user.cart[cartItemIndex].quantity = quantity;
        user.cart[cartItemIndex].size = size;
        user.cart[cartItemIndex].color = color;
        user.cart[cartItemIndex].price = price;

        // Save the user with the updated cart
        await user.save();

        // Populate the updated cart with full product details
        const updatedUser = await UserModel.findById(userId).populate('cart.product');

        res.status(200).json({
            message: 'Cart updated successfully',
            cart: updatedUser.cart,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const getUpdatedCart = async (userId) => {
    const user = await UserModel.findById(userId).populate('cart.product');
    return user.cart;
};

const removeProductFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Remove only the specific instance of the item
        user.cart = user.cart.filter((item) => item._id.toString() !== itemId);

        await user.save();

        const updatedCart = await getUpdatedCart(userId);
        res.status(200).json({ cart: updatedCart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




const getUserCart = async (req, res) => {
    try {
        const { email } = req.query;

        // Get userId from the request parameters or body
        const user = await UserModel.findOne({ email: email.toString() }).populate('cart.product');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the response with the populated cart
        res.status(200).json({
            message: 'Cart fetched successfully',
            cartItems: user.cart, // This will contain full product details now
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const getcartSummary = async (req, res) => {
    try {
        const { userId } = req.query;
        // Validate the userId
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Check if the userId is a valid ObjectId
        // Get user by userId and populate the cart with product details
        const user = await UserModel.findById(userId).populate('cart.product');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

            
        // Calculate total items and total price
        const summary = user.cart.reduce(
            (acc, item) => {
                acc.totalItems += item.quantity;
                acc.totalPrice += parseFloat(item?.price) * item.quantity;
                return acc;
            },
            { totalItems: 0, totalPrice: 0 }
        );

        // Return the summary
        res.status(200).json({
            totalItems: summary.totalItems,
            totalPrice: summary.totalPrice.toFixed(2),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { addProductInCart, removeProductFromCart, getUserCart, getcartSummary, updateCart };
