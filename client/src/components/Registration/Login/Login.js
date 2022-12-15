import React, { useContext, useState } from "react";
import "../Registration.css";
import GoogleButton from "../GoogleButton/GoogleButton";
import { login, loginGoogle } from "../../../api/index";
import { AccountContext } from "../../AccountContext/AccountContext";

import { useNavigate } from "react-router-dom";
const Login = props => {
  // console.log("props", props);
  const { setUser } = useContext(AccountContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event, inputType) => {
    if (inputType === "email") {
      setEmail(event.target.value);
      return;
    }
    if (inputType === "password") {
      setPassword(event.target.value);
    }
  };
  const handleSubmit = async () => {
    if (email && password !== "") {
      const user = await login(email, password);
      console.log("user", user);
      if (user) {
        setUser({ ...user });
        navigate("/products");
      }
    }
  };

  // const handleSuccessfulLogin = async googleData => {
  //   const res = await loginGoogle(googleData);
  //   // console.log("res", res);
  //   if (res) {
  //     // setTokens(res);
  //     // setUserId(res.userId);
  //     // localStorage.setItem("tokens", JSON.stringify(res));

  //     navigate("/products");
  //   }
  // };
  const handleSuccessfulLogin = async googleData => {
    console.log("google data", googleData);
    const res = await loginGoogle(googleData);
    console.log("res", res);
    if (res) {
      setUser({ loggedIn: true, id: res.userId });
      // setTokens(res);
      // setUserId(res.userId);
      // localStorage.setItem("tokens", JSON.stringify(res));

      navigate("/products");
    }
  };

  return (
    <div className="container">
      <div className="login">
        <div className="row">
          <div className="col-md-12 login-container">
            <h2>Login</h2>
            {/* {props.message ? <p>{props.message}</p> : null} */}
            <form>
              <div className="el-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  id="email"
                  onChange={e => {
                    handleInputChange(e, "email");
                  }}
                ></input>
              </div>
              <div className="el-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  id="password"
                  onChange={e => {
                    handleInputChange(e, "password");
                  }}
                ></input>
              </div>
            </form>
            <div className="buttons">
              <button onClick={handleSubmit}> Login</button>
              <GoogleButton
                handleSuccessfulLogin={handleSuccessfulLogin}
                handleFailedLogin={props.handleFailedLogin}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
