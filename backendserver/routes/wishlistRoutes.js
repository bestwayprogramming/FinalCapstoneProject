const express = require("express");
const { getWishlist, addToWishlist, removeFromWishlist, getWishlistProducts } = require("../controller/wishlistController");
const router = express.Router();


router.get('/products', getWishlistProducts)

router.post('/add', addToWishlist);

router.post('/remove', removeFromWishlist)

router.get('/:userId', getWishlist)


module.exports = router;
