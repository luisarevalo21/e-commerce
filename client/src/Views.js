import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Registration/Login/Login";
import Register from "./components/Registration/Register/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductsItem from "./components/Products/ProductsItem";
import Cart from "./components/Cart/Cart";

import PrivateRoutes from "./PrivateRoutes";

const Views = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/products" element={<Dashboard />} exact />
        <Route path="/categories/:categoryId" element={<Dashboard />} exact />
        <Route path="/products/:productId" element={<ProductsItem />} exact />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
};

export default Views;
