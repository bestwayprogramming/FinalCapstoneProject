const express = require("express");
const ProductModel = require("../models/product");
const cloudinary = require("../cloudinaryConfig");
const router = express.Router();

// Get product by ID
router.get('/get-product/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const product = await ProductModel.findOne({ id: id });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      console.error("Error fetching product:", err);
      res.status(500).json({ error: "Server error, please try again later" });
    }
  });
  
  
  // Add product
  router.post('/add-product', async (req, res) => {
    try {
      const { id, name, images, imageAlt, price, color, sizes, type, condition, category, description, owner } = req.body;
      if (!images || images.length === 0) {
        return res.status(400).json({ message: "At least one image is required." });
      }
  
      // Upload each image and store URLs
      const uploadPromises = images.map((image) =>
        cloudinary.uploader.upload(image, {
          upload_preset: "ml_default",
          folder: "uploads",
          allowed_formats: ["jpg", "jpeg", "png"]
        })
      );
  
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);
  
      // Process color and sizes fields
      const colorArray = Array.isArray(color) ? color : color.split(',');
      const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(',');
  
      // Create a new product document
      const newProduct = new ProductModel({
        id,
        name,
        images: imageUrls,
        imageAlt,
        price,
        color: colorArray,
        sizes: sizesArray,
        type,
        condition,
        category,
        description,
        owner,
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json({
        message: "Product added successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ message: "Server error, please try again later" });
    }
  });
  
  router.patch('/update-product/:id', async (req, res) => {
    const { id } = req.params;
    const { images, ...updatedData } = req.body;
  
    try {
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          if (image.startsWith('http')) {
            return image; // Existing Cloudinary URL
          } else {
            // Upload base64 image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(image, {
              upload_preset: "ml_default",
              folder: "uploads",
              allowed_formats: ["jpg", "jpeg", "png"],
            });
            return uploadResult.secure_url; // Return new Cloudinary URL
          }
        })
      );
  
      // Update product with new images in DB
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { id: id },
        { ...updatedData, images: imageUrls },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  
  
  router.delete("/delete-product/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProduct = await ProductModel.findOneAndDelete({ id: id });
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  
  
  router.post('/get-products', async (req, res) => {
    const { ownerEmail } = req.body; // Assume ownerEmail is passed in the request body
  
    try {
      const products = await ProductModel.find({ owner: ownerEmail });

      if(!products) {
        products = await ProductModel.findById(ownerEmail);
      }
      res.status(200).json(products); // Send the list of products as JSON response
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Server error, please try again later" });
    }
  });
  


  router.get('/all-products', async (req, res) => {
    try {
      const products = await ProductModel.find(); // Fetch all products
      res.status(200).json(products); // Send the list of products as a JSON response
    } catch (err) {
      console.error("Error fetching all products:", err);
      res.status(500).json({ error: "Server error, please try again later" });
    }
  });
  
  module.exports = router;