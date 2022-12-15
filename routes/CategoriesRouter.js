const categoriesRouter = require("express").Router();
const db = require("../db/index");

categoriesRouter.get("/", (req, res) => {
  // console.log("inside categories router");
  db.query("SELECT * FROM categories", null, (err, result) => {
    if (err) return err;

    if (result.rows.length > 0) {
      const categories = result.rows;
      return res.status(200).json(categories);
    }
  });
});

categoriesRouter.get("/:categoryId", (req, res) => {
  const { categoryId } = req.params;

  db.query(
    "SELECT products.id AS product_id, products.name, products.quantity,products.price,products.image_src, products.product_title, categories.id AS category_id FROM products JOIN categories on products.category_id = categories.id WHERE categories.id = $1",
    [categoryId],
    (err, result) => {
      if (err) return err;
      // console.log(err);
      // console.log("products", result.rows);
      res.status(200).json(result.rows);
    }
  );
});

module.exports = categoriesRouter;
