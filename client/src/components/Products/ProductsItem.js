import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import "./Products.css";
const ProductsItem = props => {
  const [selected, setSelect] = useState("1");

  const location = useLocation();

  const handleSubmit = e => {
    e.preventDefault();
    console.log("seelcted", selected);
  };

  const handleChange = e => {
    setSelect(e.target.value);
  };
  const handleAddToCart = () => {
    // console.log("selected", selected, id);
    // console.log("add to cart trigger inside product item");
    props.handleAddToCart({ qty: selected, productId: id });
  };

  console.log("location.state", location.state);
  if (location.state === null) {
    return <Navigate to="/products" />;
  }

  const { id, image_src, name, price, product_title, quantity } =
    location.state[0];

  let selectOptions = [];

  for (let i = 1; i < quantity; i++) {
    selectOptions.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  return (
    <div className="product-item">
      <div className="product-image">
        <img src={image_src} alt="item" />
      </div>

      <div className="product-details">
        <h3>{name} </h3>

        <p>${price}</p>

        <p>{product_title}</p>

        <form onSubmit={handleSubmit}>
          <label>Select amount</label>
          <select value={selected} onChange={handleChange}>
            {selectOptions}
          </select>
          <button onClick={handleAddToCart}>Add to cart </button>
        </form>
      </div>
    </div>
  );
};

export default ProductsItem;
