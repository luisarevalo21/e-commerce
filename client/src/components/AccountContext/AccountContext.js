import { createContext, useState, useEffect } from "react";

import { getCartSize } from "../../api/Cart";
import { useNavigate } from "react-router-dom";
export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const [cartSize, setCartSize] = useState(0);
  const [usersCart, setUsersCart] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/user-data", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(res => {
        if (!res.ok || res.status >= 400) {
          setUser({ loggedIn: false });
          setCartSize(0);
          return;
        }
        return res.json();
      })
      .then(async data => {
        // console.log("data", data);
        if (data) {
          const cartSize = await getCartSize(data.id);
          console.log("cart size in account context", cartSize);
          setCartSize(cartSize);

          setUser({ ...data });
          navigate("/products");
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountContext.Provider
      value={{ user, setUser, setUsersCart, usersCart, cartSize, setCartSize }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
