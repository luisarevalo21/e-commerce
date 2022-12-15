import React from "react";
import Card from "../Card/Card";
import "./Products.css";

const Products = props => {
  const handleProductClicked = productId => {
    props.handleClicked(productId);
  };

  if (props.products.length === 0) {
    return (
      <div>
        <p>No produts found try again</p>
      </div>
    );
  }

  const products = props.products.map(prod => {
    // console.log("id", prod.product_id);
    return (
      <Card
        key={prod.product_id}
        id={prod.product_id}
        name={prod.name}
        image={prod.image_src}
        product_title={prod.product_title}
        price={prod.price}
        onClick={() => {
          handleProductClicked(prod.product_id);
        }}
        handleQuickAdd={() => props.handleQuickAdd(prod.product_id)}
      />
    );
  });

  return (
    <>
      {props.message}

      {products}
    </>
  );
};

export default Products;
