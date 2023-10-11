import axios from "axios";
import { createContext, useState } from "react";

export const CartContext = createContext();

let userToken = localStorage.getItem("userToken");
let headers = {
  token: userToken,
};
function addToCart(id) {
  return axios
    .post(
      "https://ecommerce.routemisr.com/api/v1/cart",
      { productId: id },
      { headers: headers }
    )
    .then((response) => response)
    .catch((error) => error);
}
function getLoggedUserCart() {
  return axios
    .get("https://ecommerce.routemisr.com/api/v1/cart", { headers: headers })
    .then((response) => response)
    .catch((error) => error);
}
function removeCartItem(id) {
  return axios
    .delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
      headers: headers,
    })
    .then((response) => response)
    .catch((error) => error);
}
function ClearCart() {
  return axios
    .delete(`https://ecommerce.routemisr.com/api/v1/cart`, {
      headers: headers,
    })
    .then((response) => response)
    .catch((error) => error);
}
function onlinePayment(cartId, url, values) {
  return axios
    .post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
      { shippingAddress: values },
      {
        headers,
      }
    )
    .then((response) => response)
    .catch((error) => error);
}
function cashPayment(cartId, values) {
  return axios
    .post(
      `https://ecommerce.routemisr.com/api/v1/orders/${cartId}?`,
      { shippingAddress: values },
      {
        headers,
      }
    )
    .then((response) => response)
    .catch((error) => error);
}
function updateProductQuantity(id, count) {
  return axios
    .put(
      `https://ecommerce.routemisr.com/api/v1/cart/${id}`,
      { count },
      {
        headers,
      }
    )
    .then((response) => response)
    .catch((error) => error);
}
export default function CartContextProvider(props) {
  const initialPaymentMethod = localStorage.getItem("paymentMethod") || "";
  const initialCartOwner = localStorage.getItem("cartOwner") || "";
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [cartOwner, setCartOwner] = useState(initialCartOwner);
  const [CartItems, setCartItems] = useState(null);

  return (
    <CartContext.Provider
      value={{
        addToCart,
        getLoggedUserCart,
        removeCartItem,
        updateProductQuantity,
        ClearCart,
        onlinePayment,
        cashPayment,
        paymentMethod,
        setPaymentMethod,
        cartOwner,
        setCartOwner,
        CartItems,
        setCartItems,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}
