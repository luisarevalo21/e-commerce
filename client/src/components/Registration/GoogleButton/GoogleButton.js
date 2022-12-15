import React from "react";
import googleImage from "../../../assets/googleImage.png";
import styles from "./GoogleButton.module.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

// add heroku https to credentials on googl site
//https://console.cloud.google.com/apis/credentials?project=e-com-367702

const GoogleButton = props => {
  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => props.handleSuccessfulLogin(tokenResponse.code),
    onError: () => props.handleFailedLogin(),
    flow: "auth-code",
  });
  // const handleSuccess = googleData => {
  //   props.handleSuccessfulLogin(googleData);
  // };
  const handleFailure = () => {
    props.handleFailedLogin();
  };
  return (
    // // <div className={styles.googleButton}>
    //   {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}> */}
    //   {/* <button onClick={googleLogin}>Log in with Google</button> */}
    <button onClick={() => googleLogin()}>Login with Google</button>
    // {/* </GoogleOAuthProvider> */}
    // {/* <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    //   <GoogleLogin
    //     buttonText="Log in with Google"
    //     onSuccess={handleSuccess}
    //     onFailure={handleFailure}
    //     cookiePolicy="single_host_origin"
    //   />
    // </GoogleOAuthProvider> */}
    // </div>
  );
};
export default GoogleButton;
