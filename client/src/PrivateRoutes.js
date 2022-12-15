import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./components/AccountContext/AccountContext";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  console.log("is auth", isAuth);

  // console.log("user in private routes", user);

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
