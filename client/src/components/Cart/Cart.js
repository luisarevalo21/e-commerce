import React, { useEffect, useContext } from "react";
import {
  deleteFromCart,
  fetchUsersCart,
  getCartSize,
  postCheckout,
} from "../../api/Cart";
import { NavLink, useNavigate } from "react-router-dom";
import "./Cart.css";
import { AccountContext } from "../AccountContext/AccountContext";

const Cart = props => {
  const { usersCart, user, setUsersCart, setCartSize } =
    useContext(AccountContext);
  const navigate = useNavigate();
  console.log("cart inside of cart", usersCart);
  // console.log("props inside of cart", props);
  // console.log("props", props.cart);
  // const [cart, setCart] = useState([]);
  // const fetchCart = async () => {
  //   const result = await fetchUsersCart(props.userId);

  //   // console.log(result);
  //   setCart(result);
  // };
  // const { userId, cart } = props;

  const handleDelete = async productId => {
    const res = await deleteFromCart(productId, user.id);
    if (res) {
      const usersCart = await fetchUsersCart(user.id);
      const cartSize = await getCartSize(user.id);
      setUsersCart(usersCart);
      setCartSize(cartSize);
    }
    // props.handleDelete(productId);
  };
  const handleCheckout = async () => {
    // if (cart.length !== 0) {

    const res = await postCheckout(user.id, usersCart);
    if (res) {
      setCartSize(0);
      setUsersCart([]);
      navigate("/products");
    }

    // }
  };
  // useEffect(() => {
  //   fetchCart();
  // }, []);

  let cartDetails = null;
  let qty = 0;
  let total = 0;
  if (usersCart) {
    cartDetails = usersCart.map(item => {
      qty += item.qty;
      total += item.qty * parseInt(item.price);
      // console.log("item", item);
      return (
        <div className="row border-top border-bottom" key={item.product_id}>
          <div className="row main align-items-center">
            <div className="col-2">
              <img src={item.image_src} alt="item" className="img-fluid" />
            </div>

            <div className="col">
              <div className="row">{item.name}</div>
              <div className="row text-muted">{item.product_description}</div>
            </div>

            <div className="col">
              <div className="row">{item.qty}</div>
            </div>

            <div className="col">
              <div className="row"> item price {item.price}</div>

              {/* <span className="close">x</span> */}
              {/* </div> */}
            </div>
            <div className="col">
              <div className="row">
                <button
                  className="close"
                  onClick={() => handleDelete(item.product_id)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="Cart-Container">
      <div className="Card">
        <div className="row">
          <div className="col-md-8 cart">
            <h3>Shopping Cart</h3>
            {props.message}

            <p>You have {qty} items in your cart</p>
            {cartDetails}
            <div className="back-to-shop">
              <NavLink to="/products" className="back">
                ← <span>Back to products</span>
              </NavLink>
            </div>
          </div>
          <div className="col-md-4 summary">
            <div>
              <h3>Summary</h3>
            </div>

            <hr />
            <div className="summary-body">
              <div className="row">
                <div className="col"> Items {qty}</div>
                <div className="col text-right">cost is {total}</div>
              </div>
            </div>

            <div className="row">
              <div className="col"> total price </div>
              <div className="col text-right"> {total} </div>
            </div>

            <button className="btn" onClick={handleCheckout}>
              Checkout
            </button>
            {/* <p>
              Shipping <span>+5</span>
            </p>
            <p>total price total plus shipping</p> */}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* {cart !== null
        ? cart.map(items => {
            return (
              <div>
                <h3>{items.id}</h3>
              </div>
            );
          })
        : null} */}
    </div>
  );
};

export default Cart;
