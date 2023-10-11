import axios from "axios";
import { createContext, useState } from "react";

export const WishListContext = createContext();

let userToken = localStorage.getItem("userToken");
let headers = {
  token: userToken,
};
function addToWish(id) {
  return axios
    .post(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      { productId: id },
      { headers: headers }
    )
    .then((response) => response)
    .catch((error) => error);
}
function getLoggedUserWish() {
  return axios
    .get("https://ecommerce.routemisr.com/api/v1/wishlist", {
      headers: headers,
    })
    .then((response) => response)
    .catch((error) => error);
}
function removeWishItem(id) {
  return axios
    .delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
      headers: headers,
    })
    .then((response) => response)
    .catch((error) => error);
}

export default function WishListContextProvider(props) {
  const [WishItems, setWishItems] = useState(null);
  return (
    <WishListContext.Provider
      value={{
        addToWish,
        getLoggedUserWish,
        removeWishItem,
        WishItems,
        setWishItems,
      }}
    >
      {props.children}
    </WishListContext.Provider>
  );
}
