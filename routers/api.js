const router = require('express').Router();
const ProductsRouter = require('./products');

router.use('/products', ProductsRouter);

module.exports = router;
