import React from "react";
import styles from "./Header.module.css";
const Header = () => {
  return (
    <div className={styles.Header}>
      <h2>E-Com</h2>

      <a>Sign in</a>
      <a>Sign up</a>
    </div>
  );
};

export default Header;
