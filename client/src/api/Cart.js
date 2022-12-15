const baseUrl = "http://localhost:8000/";

export const fetchUsersCart = userId => {
  return fetch(`${baseUrl}cart/${userId}`)
    .then(res => res.json())
    .then(data => data);
};

export const addToUsersCart = (userId, data) => {
  return fetch(`${baseUrl}cart/${userId}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
};

export const getCartSize = userId => {
  return fetch(`${baseUrl}cart/account/${userId}`)
    .then(res => res.json())
    .then(data => data);
};

export const deleteFromCart = (productId, userId) => {
  return fetch(`${baseUrl}cart/account/${productId}/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => {
      if (res.status === 200);
      return res.json();
    })
    .then(data => data);
};

export const postCheckout = (userId, cart) => {
  return fetch(`${baseUrl}cart/${userId}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart }),
  }).then(res => {
    // console.log(res);
    if (res.status === 200) {
      return res.json();
    }
  });
  // .then(data => data);
};
