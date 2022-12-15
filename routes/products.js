const express = require("express");
const db = require("../db/index");

const productsRouter = express.Router();

//gets all products in db limits 10
productsRouter.get("/", (req, res) => {
  // console.log("inside products req", req.user);
  db.query(
    "SELECT id AS product_id, *  FROM products LIMIT 10",
    null,
    (err, result) => {
      if (err) return err;

      // console.log("products", result.rows);
      res.status(200).json(result.rows);
    }
  );
});

productsRouter.get("/:productId", (req, res) => {
  const { productId } = req.params;

  console.log("product Id", productId);

  db.query(
    "SELECT * FROM products WHERE id = $1",
    [productId],
    (err, result) => {
      if (err) return err;

      return res.status(200).json(result.rows);
    }
  );
  // db.query(
  //   "SELECT * FROM products WHERE id = $1",
  //   [productId],
  //   (error, result) => {
  //     if (error) return error;

  //     return res.status(200).json(result.rows);
  //   }
  // );
  // console.log("fetch product details", categoryId, productId);
});
// productsRouter.get("/:catgoryId", (req, res) => {
//   const { categoryId } = req.params;
//   db.query(
//     `SELECT * FROM products WHERE category_id = ${categoryId}`,
//     null,
//     (err, result) => {
//       if (err) return err;

//       res.status(200).send(result.rows);
//     }
//   );
// });

module.exports = productsRouter;
