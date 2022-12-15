const baseUrl = "http://localhost:8000/";

export const fetchProductCategories = () => {
  return fetch(`${baseUrl}categories`)
    .then(res => res.json())
    .then(data => data);
};

export const fetchProducts = (categoryId = null) => {
  if (categoryId === null) {
    return fetch(`${baseUrl}products`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => data);
  } else
    return fetch(`${baseUrl}categories/${categoryId}`)
      .then(res => res.json())
      .then(data => data);
};

export const fetchProductdetails = productId => {
  return fetch(`${baseUrl}products/${productId}`)
    .then(res => res.json())
    .then(data => data);
};
