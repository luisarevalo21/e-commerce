const express = require("express");

const db = require("../db/index");
const cartRouter = express.Router();

//add to cart  post method

//add to specific cart via cartId post method

cartRouter.get("/", (req, res, next) => {
  console.log("req.user", req.user);
  next();
});

cartRouter.get("/:userId", (req, res) => {
  // console.log("the user is", req.user);
  // console.log("res", res);

  // console.log("INSID FETCHING USERS CART DETAILS");
  const { userId } = req.params;
  if (!userId) {
    return res.status(200).json([]);
  }

  db.query(
    "SELECT cart_item.product_id, cart_item.qty, products.name, products.image_src, products.product_title, products.price FROM cart_item JOIN products ON cart_item.product_id = products.id WHERE account_id = $1 ",
    [userId],
    (err, result) => {
      if (err) return err;

      if (result.rows.length !== 0) {
        res.status(200).json(result.rows);
      } else if (result.rows.length === 0) {
        res.status(200).json([]);
      }
    }
  );
});

// getting cart size
cartRouter.get("/account/:userId", (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(200).json(0);
  }

  // console.log("inside cart id");

  db.query(
    "SELECT SUM (qty) from cart_item WHERE account_id = $1",
    [userId],
    (err, result) => {
      if (err) return next(err);
      if (result.rows.length === 0) {
        return res.send("NO reuslts found");
      }

      // console.log(result.rows[0].sum);
      // console.log(results.rows);
      res.status(200).json(parseInt(result.rows[0].sum));
    }
  );
});

cartRouter.post("/:userId", (req, res) => {
  const { userId } = req.params;
  const { productId, qty } = req.body;

  //check if it exists in the cart
  // if it does add 1 to qty

  db.query(
    "SELECT * FROM cart_item WHERE product_id = $1 AND account_id = $2",
    [productId, userId],
    (err, result) => {
      if (err) {
        return err;
      }

      //result found
      if (result.rows.length > 0) {
        db.query(
          "UPDATE cart_item SET qty = qty +1 WHERE product_id = $1 AND account_id = $2",
          [productId, userId],
          (error, response) => {
            if (error) return error;

            res.status(201).json("Successs");
          }
        );
      } else {
        db.query(
          "INSERT INTO cart_item (product_id, qty, account_id) VALUES($1, $2, $3)",
          [productId, qty, userId],
          (err, response) => {
            console.log("the error is", err);
            if (err) return err;

            res.status(201).json("Success");
          }
        );
      }
    }
  );
});
//get a specific cart via cartId get method
cartRouter.get("/", (req, res, next) => {
  // const { accountId } = req.params;

  // console.log("REQ.USER", req.user);
  const accountId = req.user;
  // console.log("Account id", accountId);

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
      // console.log(err);
      if (err) return next(err);

      // console.log(results);
      res.send(results.rows);
    }
  );
});

cartRouter.post("/:userId/checkout", (req, res, next) => {
  const { userId } = req.params;
  let order = null;

  //cart is an array
  const { cart } = req.body;
  let total = 0;
  cart.forEach(element => (total += element.qty * parseInt(element.price)));
  // console.log(total);

  //clear cart

  // insert content into orders
  //insert cart data

  db.query(
    `INSERT INTO orders (total, account_id) VALUES($1, $2)`,
    [total, userId],
    (err, result) => {
      // console.log(err);
      if (err) return next(err);

      // console.log(result);
      if (result) {
        db.query(
          "DELETE FROM cart_item WHERE account_id = $1",
          [userId],
          (err, result) => {
            if (err) return next(err);

            db.query(
              "DELETE FROM cart WHERE account_id = $1",
              [userId],
              (err, result) => {
                if (err) return next(err);
                res.status(200).json("Successfully created order");
              }
            );
          }
        );
      }
    }
  );

  // db.query(
  //   `SELECT cart_item.qty,products.name, products.price, cart.account_id
  // FROM cart
  // JOIN cart_item
  // ON cart_item.cart_id = cart.id
  // JOIN products
  // ON cart_item.product_id = products.id
  // where cart.id = '${cartId}'`,
  //   null,
  //   (err, result) => {
  //     if (err) return next(err);

  //     if (result.rows.length === 0) {
  //       return "No results found for that cart";
  //     }

  //     const total = result.rows.reduce((prev, cur) => prev + +cur.price, 0);
  //     order = {
  //       total,
  //       accountId: result.rows[0].account_id,
  //     };

  //     db.query(
  //       `INSERT INTO orders (total, account_id) VALUES('${order.total}', '${order.accountId}')`,
  //       null,
  //       (err, result) => {
  //         // console.log("Inside second query", err);
  //         if (err) return next(err);
  //         // console.log("results", result);
  //         res.send("success");
  //       }
  //);/
  //}
  // );
});

cartRouter.delete("/account/:productId/:userId", (req, res) => {
  console.log("inside delte");
  // console.log(req);
  const { productId, userId } = req.params;
  // console.log(productId);

  db.query(
    "DELETE FROM cart_item WHERE product_id = $1 AND account_id = $2",
    [productId, userId],
    (err, result) => {
      // console.log("err", err);
      if (err) return err;
      // console.log("result", result);

      if (result) {
        res.status(200).json("succesfful deleted");
      }
    }
  );
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
