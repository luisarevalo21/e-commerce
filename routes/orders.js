const express = require("express");
const db = require("../db/index");
const ordersRouter = express.Router();

ordersRouter.get("/", (req, res) => {
  db.query(`SELECT * FROM orders`, (err, result, next) => {
    if (err) return next(err);
    if (result.rows.length === 0) {
      return res.send("no results found");
    }

    res.status(201).send(result.rows);
  });
});

ordersRouter.get("/:accountId", (req, res, next) => {
  const { accountId } = req.params;
  const account_id = req.user;
  console.log("id", account_id);

  db.query(
    `SELECT * FROM orders WHERE account_id = '${account_id}'`,
    null,
    (err, results) => {
      console.log("Err", err);
      if (err) return next(err);

      if (results.rows.length === 0) {
        return res.send("no orders found");
      }
      res.status(200).send(results.rows);
    }
  );
});

// ordersRouter.get("/", (req, res, next) => {});

// ordersRouter.post("/", (req, res) => {
//   console.log("isnde post method");
// });
module.exports = ordersRouter;
