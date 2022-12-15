import React, { useState } from "react";
import "../Registration.css";
// import { useNavigate } from "react-router-dom";
// import { register } from "../../../api";

const Register = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (event, inputType) => {
    if (inputType === "email") {
      setEmail(event.target.value);
      return;
    }
    if (inputType === "password") {
      setPassword(event.target.value);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (email && password !== "") {
      props.handleRegisterUser(email, password);
      // const result = await register(email, password);
      // console.log(result);
      // if (result.status === 200) {
      //   // navigate("/products");
      // }
      // if (result.status === 400) {
      //   console.log("error has occured try again!");
      // }
    }
  };
  return (
    <div className="container">
      <div className="login">
        <div className="row">
          <div className="col-md-12 login-container">
            <h2>Register</h2>
            <form>
              <div className="el-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="email"
                  id="email"
                  value={email}
                  onChange={e => handleInputChange(e, "email")}
                ></input>
              </div>
              <div className="el-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  id="password"
                  value={password}
                  onChange={e => handleInputChange(e, "password")}
                ></input>
              </div>
            </form>
          </div>
        </div>
        <div className="buttons">
          <button onClick={handleSubmit}> Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
