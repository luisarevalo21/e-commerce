const express = require("express");

const db = require("../db/index");
const cartRouter = express.Router();

//add to cart  post method

//add to specific cart via cartId post method

cartRouter.post("/", (req, res) => {
  // db.query(`INSERT INTO cart VALUES()`, null, (err, result) => {
  // });
});

cartRouter.get("/:cartId", (req, res, next) => {
  const { cartId } = req.params;
  console.log("CART ID", cartId);
  console.log("inside cart id");

  db.query(
    `SELECT cart_item.qty,products.name, products.price
  FROM cart 
  JOIN cart_item 
  ON cart_item.cart_id = cart.id
  JOIN products 
  ON cart_item.product_id = products.id
  where cart.id = '${cartId}'`,
    null,
    (err, results) => {
      if (err) return next(err);
      if (results.rows.length === 0) {
        return res.send("NO reuslts found");
      }
      res.send(results.rows);
    }
  );
});

//get a specific cart via cartId get method
cartRouter.get("/", (req, res, next) => {
  // const { accountId } = req.params;

  console.log("REQ.USER", req.user);
  const accountId = req.user;
  console.log("Account id", accountId);

  console.log("INSIED CART");
  db.query(
    `SELECT  products.name, cart_item.qty, products.price
    FROM cart
   JOIN cart_item
   ON cart.id = cart_item.cart_id
   JOIN products 
   ON products.id = cart_item.product_id`,
    null,
    (err, results) => {
      console.log(err);
      if (err) return next(err);

      // console.log(results);
      res.send(results.rows);
    }
  );
});

// cartRouter.get("/", (req, res, next) => {
//   db.query(`SELECT * FROM cart`, null, (err, results) => {
//     if (err) return err;
//     res.send(results.rows);
//   });
// });
module.exports = cartRouter;
