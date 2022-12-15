import React, { useContext, useEffect, useState } from "react";
import Products from "../Products/Products";
import CategoryRibbon from "../CategoryRibbon/CategoryRibbon";
import styles from "./Dashboard.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProducts, fetchProductdetails } from "../../api/products";
import {
  addToUsersCart,
  postCheckout,
  fetchUsersCart,
  getCartSize,
} from "../../api/Cart";
import { AccountContext } from "../AccountContext/AccountContext";

const DashBoard = props => {
  // console.log("props inside of dashboard", props);
  const { user, setUsersCart, setCartSize } = useContext(AccountContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [selectedProducts, setSelectedProducts] = useState("");
  const [message, setMessage] = useState("");

  const { categoryId } = useParams();
  // console.log("category id", categoryId);

  // console.log(categoryId);
  const fetchAllProducts = async categoryId => {
    // console.log("category id inside of fetch al products", categoryId);

    if (categoryId) {
      const products = await fetchProducts(categoryId);

      setProducts(products);
    } else {
      const products = await fetchProducts();
      setProducts(products);
    }
  };

  const getCartData = async () => {
    // console.log("inside get cart data");
    const cart = await fetchUsersCart(user.id);
    setUsersCart(cart);

    const cartSize = await getCartSize(user.id);
    setCartSize(cartSize);
  };

  useEffect(() => {
    fetchAllProducts(categoryId);
    getCartData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleProductClicked = async productId => {
    const result = await fetchProductdetails(productId);
    setSelectedProducts(result);

    navigate(`/products/${productId}`, {
      state: [...result],
    });
  };

  const handleQuickAdd = async productId => {
    // console.log("quick add triggered");
    console.log(productId);
    const userId = user.id;
    console.log("user id", userId);

    const response = await addToUsersCart(userId, { productId, qty: 1 });
    if (response.status === 201) {
      setMessage("Successfully added to cart!");
      const usersCart = await fetchUsersCart(user.id);
      setUsersCart(usersCart);
      const cartSize = await getCartSize(user.id);
      setCartSize(cartSize);
      // props.fetchCart();
      // props.fetchCartSize();

      return;
    }
    setMessage("error addin to cart");
  };

  // console.log("props message is", props.message);
  return (
    <>
      {/* <div style={{ "color ": "red", fontSize: "50px" }}>{props.messsage}</div> */}

      <CategoryRibbon fetchAllProducts={fetchAllProducts} />
      <p>{message}</p>
      <p style={{ color: "red", fontSize: "50px" }}> {props.message}</p>

      <div className={styles.container}>
        <Products
          // message={props.message}
          products={products}
          handleClicked={handleProductClicked}
          handleQuickAdd={handleQuickAdd}
        />
      </div>
    </>
  );
};

export default DashBoard;
