const express = require("express");

const db = require("../db/index");
const cartRouter = express.Router();

//add to cart  post method

//add to specific cart via cartId post method

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

cartRouter.post("/:cartId/checkout", (req, res, next) => {
  const { cartId } = req.params;
  let order = null;

  db.query(
    `SELECT cart_item.qty,products.name, products.price, cart.account_id
  FROM cart 
  JOIN cart_item 
  ON cart_item.cart_id = cart.id
  JOIN products 
  ON cart_item.product_id = products.id
  where cart.id = '${cartId}'`,
    null,
    (err, result) => {
      if (err) return next(err);

      if (result.rows.length === 0) {
        return "No results found for that cart";
      }

      const total = result.rows.reduce((prev, cur) => prev + +cur.price, 0);
      order = {
        total,
        accountId: result.rows[0].account_id,
      };

      db.query(
        `INSERT INTO orders (total, account_id) VALUES('${order.total}', '${order.accountId}')`,
        null,
        (err, result) => {
          console.log("Inside second query", err);
          if (err) return next(err);
          console.log("results", result);
          res.send("success");
        }
      );
    }
  );
});

cartRouter.delete("/:cartId", (req, res) => {
  const { cartId } = req.params;

  db.query(`DELETE FROM cart WHERE id = '${cartId}'`, null, (err, result) => {
    if (err) return next(err);

    if (result.rows.length !== 0) {
      return "no result found with that id";
    }

    res.status(201).send(`successfully delte with ${cartId}`);
  });
});

// res.send("order couldnt be added try again");
// res.redirect("/accounts");

// cartRouter.get("/", (req, res, next) => {
//   db.query(`SELECT * FROM cart`, null, (err, results) => {
//     if (err) return err;
//     res.send(results.rows);
//   });
// });
module.exports = cartRouter;
