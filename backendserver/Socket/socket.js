// const io = require("socket.io")(server);
// const { getChatsForSeller } = require("../controller/chatController");
// const Chat = require("../models/chat");
// const Product = require("../models/product");
// const User = require("../models/user");

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('getChatsForSeller', async (sellerEmail) => {
//     if (!sellerEmail) {
//       socket.emit('error', 'Email is required');
//       return;
//     }

//     const result = await getChatsForSeller(sellerEmail);

//     if (result.error) {
//       socket.emit('noChats', result.error);
//     } else {
//       socket.emit('chats', result);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });
