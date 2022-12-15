import React from "react";
import styles from "./Card.module.css";
const Card = props => {
  // console.log("props", props);
  return (
    <div className={styles.Card}>
      <div onClick={props.onClick}>
        <div className={styles["card-image"]}>
          <img alt="item" src={props.image} />
        </div>
        <div className={styles["card-body"]}>
          {/* <div className="card-body-header"> */}
          {/* //card body header */}
          <h3 className={styles["card-body-header"]}>{props.name}</h3>
          {/* </div> */}
          {/* //what kind  of candy */}
          <p className={styles.description}>{props.product_title}</p>

          <p>${props.price}</p>
        </div>
      </div>
      <div className={styles["card-footer"]}>
        <button onClick={props.handleQuickAdd}> Quick add</button>
      </div>
    </div>
  );
};

export default Card;
