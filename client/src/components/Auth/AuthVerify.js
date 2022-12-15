import React, { useEffect } from "react";
import { withRouter } from "./withRouter";

const verifyToken = token => {
  try {
    return new Date(token.expiry_date * 1000);
  } catch (err) {
    return null;
  }
};
const AuthVerify = props => {
  // console.log("props", props);
  let location = props.router.location;

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("tokens"));
    // console.log("tokens ", tokens);
    if (tokens) {
      const decodedToken = verifyToken(tokens);

      // console.log(decodedToken);
      // console.log(new Date(decodedToken).getMilliseconds() < Date.now());
      //fix when the token is expired
      if (decodedToken < Date.now()) {
        props.logout();
      }
    }
  }, [location]);
  return <></>;
};

export default withRouter(AuthVerify);
