const database = require('../database/database');
const createHttpError = require('http-errors');
const router = require('express').Router();

// Get product
router.get('/', function (req, res, next) {
  return database
    .queryPromise(`SELECT * FROM shopping ORDER BY id;`, [])
    .then(function (result) {
      const products = [];
      for (let i = 0; i < result.rows.length; i++) {
        const product = result.rows[i];
        products.push({
          id: product.id,
          productName: product.product, // This is the sql table column name
          quantityNum: product.quantity,
          productStatus: product.product_status,
        });
      }
      return res.json({ products: products });
    })
    .catch(function (error) {
      console.log(error + 'this is the error');
      return next(error);
    });
});

router.post('/', function (req, res, next) {
  const name = req.body.name;
  const num = req.body.num;
  return database
    .queryPromise(`INSERT INTO shopping (product, quantity) VALUES ($1, $2)`, [name, num])
    .then(function () {
      return res.sendStatus(201);
    })
    .catch(function (error) {
      if (error && error.code === '23505') {
        return next(createHttpError(400, `Product ${name} already exists`));
      } else if (error) {
        return next(createHttpError(500, `Internal Server Error`));
      }
      return next(error);
    });
});

// Update product Name
router.put('/test/:quantityNum', function (req, res, next) {
  const productStatus = req.body.productStatus;
  const quantityNum = req.params.quantityNum;

  return database
    .queryPromise(`UPDATE shopping SET product_status = $1 WHERE quantity = $2`, [productStatus, quantityNum])
    .then(function () {
      return res.sendStatus(200);
    })
    .catch(function (error, result) {
      if (error && result.rowCount === 0) {
        console.log(error + 'Its here');
        return next(createHttpError(404, `No such product: ${quantityNum}`));
      }
      return next(error);
    });
});


router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  return database
    .queryPromise(`DELETE FROM shopping WHERE id = $1`, [id])
    .then(function () {
      return res.sendStatus(200);
    })
    .catch(function (error) {
      return next(createHttpError(500, `Internal Server Error`));
    });
});

module.exports = router;
