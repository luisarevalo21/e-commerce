import React from "react";
import googleImage from "../../../assets/googleImage.png";
import styles from "./GoogleButton.module.css";
const GoogleButton = props => {
  return (
    <button className={styles.googleButton} onClick={props.onClick}>
      {/* <img src={googleImage} alt="google sign in" /> */}
    </button>
  );
};

export default GoogleButton;
