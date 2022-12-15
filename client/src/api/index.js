const baseUrl = "http://localhost:8000/";

export const login = (email, password) => {
  // console.log("login triggered");
  const data = {
    email,
    password,
  };
  return fetch(`${baseUrl}login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(data => data);
  // .then(data => data);
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
    },
    body: JSON.stringify(data),
  }).then(res => res);
  // .then(result => );
};

export const loginGoogle = async tokenResponse => {
  console.log("inside google login", tokenResponse);
  return fetch(`${baseUrl}auth/google`, {
    // credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: tokenResponse }),
  })
    .then(res => res.json())
    .then(data => data);
};

export const logout = () => {
  return fetch(`${baseUrl}logout`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(res => res);
};
