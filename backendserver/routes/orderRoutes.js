const express = require("express");
const { createOrder, updateAddressInYourOrder, paymentSuccess, getsellerOrder, fetchSellerOrders, updateOrderStatus, getUserOrderHistory, removeOrderFromHistory } = require("../controller/orderController");
const router = express.Router();


router.post('/create-order', createOrder)
router.put('/update-address/:orderId', updateAddressInYourOrder)
router.put('/finalize-payment/:orderId', paymentSuccess)
router.get('/owner-orders', getsellerOrder);
router.get('/seller-orders', fetchSellerOrders)
router.put('/update-status/:orderId', updateOrderStatus);
router.get('/order-history/:userId', getUserOrderHistory);
router.delete("/remove/:userId/:orderId", removeOrderFromHistory);




module.exports = router;
