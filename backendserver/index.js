const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes")
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")
const http = require("http"); 


require("dotenv").config();

const app = express();
const server = http.createServer(app); 

const io = require("socket.io")(server);// Create an HTTP server to attach Socket.IO

app.use(express.json({ limit: "10mb" }));  // Allows for larger image payloads
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log("MongoDB connection error:", err);
});

// Use routes
app.use('/api/auth', authRoutes); 
app.use('/api/product', productRoutes); 
app.use("/api", chatRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);


// io.on('connection', (socket) => {
//   console.log('A user connected');
  
//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// const io = initializeSocket(server);

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
