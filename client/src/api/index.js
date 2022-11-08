const baseUrl = "http://localhost:8000/";

export const login = (email, password) => {
  const data = {
    email,
    password,
  };
  return fetch(`${baseUrl}accounts/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res);
  // .then(result => result);
  // .then(result => console.log(result));
};

export const register = (email, password) => {
  const data = {
    email,
    password,
  };
  return fetch(`${baseUrl}accounts/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(data),
  }).then(res => res);
  // .then(result => );
};

// export const loginGoogle = () => {
//   console.log("inside google login");
//   fetch("/auth/google");
// };
