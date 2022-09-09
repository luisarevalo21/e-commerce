const express = require("express");
const db = require("../db/index");
const ordersRouter = express.Router();

ordersRouter.get("/:orderId", (req, res) => {
  const { orderId } = req.params;

  db.query(
    `SELECT * FROM orders WHERE id = ${orderId} LIMIT 10`,
    orderId,
    (err, results) => {
      if (err) return err;
      res.status(200).send(results.rows);
    }
  );
});

module.exports = ordersRouter;
