import React, { useState, useEffect } from "react";

import Header from "./components/Header/Header";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  loginGoogle,
  login,
  register,
  fetchCurrentUser,
  logout,
} from "./api/index";
import AuthVerify from "./components/Auth/AuthVerify";

import UserContext from "./components/AccountContext/AccountContext";
import Views from "./Views";

import {
  getCartSize,
  deleteFromCart,
  fetchUsersCart,
  postCheckout,
  addToUsersCart,
} from "./api/Cart";

function App() {
  window.history.replaceState({}, document.title);

  const [tokens, setTokens] = useState(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : null
  );
  const [userId, setUserId] = useState(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens")).userId
      : null
  );
  const [cartSize, setCartSize] = useState(0);
  const [cart, setCart] = useState([]);

  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   getCurrentUser();
  //   // fetchCartSize();
  //   // fetchCart();
  // }, []);

  const fetchCartSize = async () => {
    if (userId && tokens) {
      const size = await getCartSize(userId);
      // console.log("size", size);
      setCartSize(size);
    }
  };

  // console.log(user);

  const fetchCart = async () => {
    const result = await fetchUsersCart(userId);
    // console.log("result", result);
    // console.log("Fetch cart triggered", result);
    // console.log(result);
    setCart(result);
    fetchCartSize();
  };

  // console.log("userId", userId);
  const navigate = useNavigate();

  const handleFailedLogin = () => {
    console.log("logn in failed");
  };

  const handleCheckout = async () => {
    if (userId && cart.length !== 0) {
      const response = await postCheckout(userId, cart);

      console.log("response", response);
      if (response) {
        setMessage(response);
        setCart([]);
        setCartSize(0);
        navigate("/products");
      }
    }
  };
  const handleDeleteFromCart = async productId => {
    // console.log("produc idt", productId);
    // console.log("user id", userId);
    const response = await deleteFromCart(productId, userId);
    // console.log("response", response);
    setMessage(response);
    fetchCart();
    // fetchCart();
    // if (response) fetchCart();
  };

  const handleAddToCart = async itemData => {
    console.log("qty", itemData);
    // addToUsersCart(userId, itemData);
    const response = await addToUsersCart(userId, itemData);
    if (response.status === 201) {
      setMessage("Successfully added to cart!");
      fetchCart();
      fetchCartSize();
      navigate("/products");
    }
    setMessage("error addin to cart");
  };
  // const handleSuccessfulLogin = async googleData => {
  //   const res = await loginGoogle(googleData);
  //   console.log("res", res);
  //   if (res) {
  //     setTokens(res);
  //     setUserId(res.userId);
  //     localStorage.setItem("tokens", JSON.stringify(res));

  //     navigate("/products");
  //   }
  // };

  const handleRegisterUser = async (email, password) => {
    const response = await register(email, password);
    console.log(response);
    if (response.status === 201) {
      const token = await response.json();
      console.log("token", token);
      setTokens(token);
      setUserId(token.userId);
      localStorage.setItem("tokens", JSON.stringify(token));

      navigate("/products");
    }
    // if (response.status === 201) {
    //   const token = await response.json();
    //   console.log("token", token);
    //   // setTokens(token);
    //   // setUserId(token.id);
    //   // navigate("/products");
    // } else {
    //   // setTokens("");
    //   // setUserId("");
    //   // setMessage("ERROR OCCURED");
    // }
  };

  // const handleSubmit = async (email, password) => {
  //   console.log("submit triggered");
  //   const res = await login(email, password);

  //   console.log("respones", res);
  //   if (res.status === 201) {
  //     setUser(true);
  //     setMessage("");

  //     navigate("/products");
  //     // const user = await res.json();
  //     // setTokens(user);
  //     // setUserId(user.userId);
  //     // localStorage.setItem("tokens", JSON.stringify(user));
  //     // navigate("/products");
  //   } else {
  //     setUser(false);
  //     const response = await res.json();
  //     setMessage(response.message);
  //   }
  // };
  const handleLogout = async () => {
    navigate("/login");

    // localStorage.removeItem("tokens");
  };

  return (
    <>
      <UserContext>
        <Header handleLogout={handleLogout} cartSize={cartSize} />
        <Views />
        {/*
        <Route
          path="/register"
          element={
            <Register
              // handleSuccessfulLogin={handleSuccessfulLogin}
              // handleFailedLogin={handleFailedLogin}
              handleRegisterUser={handleRegisterUser}
              message={message}
            />
          }
        />

        <Route element={<PrivateRoutes user={user} />}>
          <Route
            path="/products"
            element={
              <Dashboard
                // userId={userId}
                fetchCartSize={fetchCartSize}
                fetchCart={fetchCart}
                message={message}
              />
            }
            exact
          />

          <Route
            path="/categories/:categoryId"
            element={
              <Dashboard userId={userId} fetchCartSize={fetchCartSize} />
            }
            exact
          />
          <Route
            path="/products/:productId"
            element={
              <ProductsItem
                userId={userId}
                fetchCartSize={fetchCartSize}
                handleAddToCart={handleAddToCart}
              />
            }
            exact
          />

          <Route
            path="/cart"
            element={
              <Cart
                userId={userId}
                handleDelete={handleDeleteFromCart}
                message={message}
                cart={cart}
                handleCheckout={handleCheckout}
              />
            }
          />
        </Route>
      </Routes> */}
        <AuthVerify logout={handleLogout} />
      </UserContext>
    </>
  );
}

export default App;
