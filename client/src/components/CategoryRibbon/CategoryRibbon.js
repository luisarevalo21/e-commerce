import React, { useEffect, useState } from "react";
import styles from "./CategoryRibbon.module.css";
import { fetchProductCategories } from "../../api/products";
import { NavLink } from "react-router-dom";

const CategoryRibbon = props => {
  const [categories, setCategories] = useState("");
  useEffect(() => {
    const fetch = async () => {
      const categories = await fetchProductCategories();
      setCategories(categories);
    };
    fetch();
  }, []);

  let myCategories = null;
  if (categories) {
    myCategories = categories.map(cat => {
      return (
        <li key={cat.category}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={`/categories/${cat.id}`}
          >
            {cat.category}
          </NavLink>
        </li>
      );
    });
  }
  return (
    <>
      <div className={styles["ribbon-container"]}>
        <h4 onClick={props.fetchAllProducts}>Products</h4>

        <ul className={styles["categories-container"]}>{myCategories}</ul>
      </div>
      {/* <hr /> */}
    </>
  );
};

export default CategoryRibbon;
