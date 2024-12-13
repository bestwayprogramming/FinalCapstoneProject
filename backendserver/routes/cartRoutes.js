const express = require("express");
const { addProductInCart, removeProductFromCart, getUserCart, getcartSummary, updateCart } = require("../controller/cartController");
const router = express.Router();

router.post('/add', addProductInCart)
router.delete('/remove', removeProductFromCart)
router.get('/getCartItems', getUserCart)
router.get('/summary', getcartSummary)
router.post('/updateCart', updateCart)
module.exports = router;
