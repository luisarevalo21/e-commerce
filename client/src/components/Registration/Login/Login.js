import React, { useState } from "react";
import "../Registration.css";
import { login } from "../../../api";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../GoogleButton/GoogleButton";

const Login = () => {
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
  const handleSubmit = async event => {
    event.preventDefault();
    if (email && password !== "") {
      const result = await login(email, password);
      // console.log("resuklt", result);
      if (result.status === 200) navigate("/dashboard");
    }
  };

  const handleLoginWithGoogle = () => {
    window.open("http://localhost:8000/auth/google", "_self");
  };
  return (
    <div className="container">
      <div className="login">
        <h2>Login</h2>
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
        <button onClick={handleSubmit}> Login</button>

        <GoogleButton onClick={handleLoginWithGoogle} />
      </div>
    </div>
  );
};

export default Login;
