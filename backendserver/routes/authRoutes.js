const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const express = require('express');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cloudinary = require("../cloudinaryConfig");


const otpStorage = {};
const otpTimestampStorage = {}; // Store timestamps of OTP generation
const userDataStorage = {}; // Temporarily stores user data until OTP verification

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateOtp = () => otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

// Route to register a user (Generate OTP)
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, mobile, password, accountType } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        userDataStorage[email] = {
            firstName,
            lastName,
            email,
            mobile,
            password: hashedPassword,
            accountType,
        };

        const otp = generateOtp();
        otpStorage[email] = otp;
        otpTimestampStorage[email] = Date.now();  // Store timestamp when OTP was generated

        const templatePath = path.join(__dirname, '..', 'templates', 'otpTemplate.html');
        fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
            if (err) {
                console.error('Error reading OTP template:', err);
                return res.status(500).json({ error: 'Server error, please try again later' });
            }

            const emailContent = htmlContent.replace('{{OTP_CODE}}', otp);

            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'OTP Verification',
                html: emailContent,
            }, (error, info) => {
                if (error) {
                    console.error('OTP send error:', error);
                    return res.status(500).json({ error: 'Failed to send OTP' });
                }
                res.status(200).json({ message: 'OTP sent successfully. Please verify to complete registration.' });
            });
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

// Route to verify OTP and save user to the database
router.post('/verifyOtp', async (req, res) => {
    const { email, otp } = req.body;

    console.log("\n\n\n", email, otp);

    try {
        // Check if OTP exists and is not expired
        if (!otpStorage[email]) {
            return res.status(400).json({ error: 'OTP does not exist or has expired' });
        }

        const otpGeneratedTime = otpTimestampStorage[email];
        const currentTime = Date.now();
        if (currentTime - otpGeneratedTime > 60000) {  // OTP is valid for 1 minute (60,000 ms)
            delete otpStorage[email];
            delete otpTimestampStorage[email];
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (otpStorage[email] !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const userData = userDataStorage[email];
        if (!userData) {
            return res.status(400).json({ error: 'No user data found for verification' });
        }

        const newUser = new UserModel(userData);
        await newUser.save();

        delete otpStorage[email];
        delete otpTimestampStorage[email];
        delete userDataStorage[email];

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('OTP verification error:', err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});



// Route to send OTP (For other verification purposes, e.g., login)
router.post('/sendOtp', async (req, res) => {
    const { email } = req.body;

    try {
        // Generate and store OTP
        const otp = generateOtp();
        otpStorage[email] = otp;

        // Read OTP template
        const templatePath = path.join(__dirname, '..', 'templates', 'otpTemplate.html');
        fs.readFile(templatePath, 'utf8', (err, htmlContent) => {
            if (err) {
                console.error('Error reading OTP template:', err);
                return res.status(500).json({ error: 'Server error, please try again later' });
            }

            const emailContent = htmlContent.replace('{{OTP_CODE}}', otp);

            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'OTP Verification',
                html: emailContent,
            }, (error, info) => {
                if (error) {
                    console.error('OTP send error:', error);
                    return res.status(500).json({ error: 'Failed to send OTP' });
                }
                res.status(200).json({ message: 'OTP sent successfully.' });
            });
        });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

// Route for user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        res.status(200).json({ message: 'Login successful', userEmail: user.email, userType: user.accountType });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error, please try again later' });
    }
});

router.post("/userinfo", async (req, res) => {
    const { email } = req.body; // Get the email from the request body
    
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Return the user data (exclude password for security reasons)
    //   const { password, ...userInfo } = user.toObject();
      
      // Send the user info back as response
      res.status(200).json(user);
    } catch (error) {
      console.error(error); // Log error for debugging purposes
      res.status(500).json({ error: "An error occurred while fetching user data" });
    }
  });

  router.put('/update-profile', async (req, res) => {
    try {
      const { email, firstName, lastName, mobile, accountType, addresses, profilePicture } = req.body;
  
      let uploadedImageUrl = null;      
  
      if (profilePicture  && !profilePicture.startsWith('https://res.cloudinary.com')) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
            upload_preset: "ml_default", // Replace with your Cloudinary preset
            folder: "profile-pictures", // Replace with your desired folder
            allowed_formats: ["jpg", "jpeg", "png"], // Restrict formats
          });
          uploadedImageUrl = uploadResponse.secure_url; // URL of the uploaded image
        } catch (uploadError) {
          console.error("Error uploading profile picture:", uploadError);
          return res.status(500).json({ message: "Failed to upload profile picture" });
        }
      }
  
      // Update the user's profile in the database
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            firstName,
            lastName,
            mobile,
            accountType,
            addresses,
            ...(uploadedImageUrl && { profilePicture: uploadedImageUrl }), // Update profile picture only if provided
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });


  router.put('/update-profile/profile-pic', async (req, res) => {
    try {
      const { email, profilePicture } = req.body; // Expect email and profilePicture only
      
      if (!profilePicture) {
        return res.status(400).json({ message: "No profile picture provided" });
      }

      let uploadedImageUrl = null;
  
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
          upload_preset: "ml_default", // Replace with your Cloudinary preset
          folder: "profile-pictures", // Replace with your desired folder
          allowed_formats: ["jpg", "jpeg", "png"], // Restrict formats
        });
        uploadedImageUrl = uploadResponse.secure_url; // URL of the uploaded image
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res.status(500).json({ message: "Failed to upload profile picture" });
      }
  
      // Update only the profile picture in the database
      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { $set: { profilePicture: uploadedImageUrl } }, // Update profile picture only
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile picture updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
module.exports = router;
