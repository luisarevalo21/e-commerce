import React, { useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import { logout } from "../../api";
import { AccountContext } from "../AccountContext/AccountContext";

const Header = props => {
  const { user, setUser } = useContext(AccountContext);
  const { cartSize, setCartSize } = useContext(AccountContext);

  console.log("cart, size", cartSize);
  // console.log("user", user);

  const handleLogout = async () => {
    const res = await logout();
    if (res.ok) {
      setUser({ loggedIn: false });
      setCartSize(0);
      props.handleLogout();
    }
  };
  return (
    <div className={styles.Header}>
      <h2>E-Com</h2>

      <div className={styles.nav}>
        {user.loggedIn === false ? (
          <>
            <NavLink to="/">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : null}

        {user.loggedIn ? (
          <>
            <NavLink to="/products">Products </NavLink>
            <NavLink onClick={() => handleLogout()}>Logout</NavLink>
            <NavLink to="/cart">
              Cart
              <span className={styles.CartNum}>
                {cartSize === 0 ? null : cartSize}
              </span>
            </NavLink>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
