const express = require("express");
const db = require("../db/index");

const productsRouter = express.Router();

productsRouter.get("/:productId", (req, res) => {
  const { productId } = req.params;
  db.query(
    `SELECT * FROM products WHERE id = ${productId}`,
    null,
    (err, result) => {
      if (err) return err;
      console.log("scucdess");
      res.status(200).send(result.rows);
    }
  );
});

productsRouter.get("/", (req, res) => {
  db.query("SELECT * FROM products LIMIT 10", null, (err, result) => {
    if (err) return err;

    console.log("products");
    res.status(200).send(result.rows);
  });
});

productsRouter.get("/:catgoryId", (req, res) => {
  const { categoryId } = req.params;
  db.query(
    `SELECT * FROM products WHERE category_id = ${categoryId}`,
    null,
    (err, result) => {
      if (err) return err;

      res.status(200).send(result.rows);
    }
  );
});

module.exports = productsRouter;
