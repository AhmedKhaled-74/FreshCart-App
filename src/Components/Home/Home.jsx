import React, { useContext, useEffect } from "react";
import Style from "./Home.module.css";

import FeaturedProducts from "../FeaturedProducts/FeaturedProducts.jsx";
import CategorySlider from "../CategorySlider/CategorySlider.jsx";
import MainSlider from "../MainSlider/MainSlider.jsx";
import Ops from "../Ops/Ops.jsx";
import { Helmet } from "react-helmet";
import { CartContext } from "../../Context/CartContext.js";

export default function Home() {
  let { getLoggedUserCart, setCartOwner } = useContext(CartContext);
  async function getCartItems() {
    let response = await getLoggedUserCart();
    localStorage.setItem("cartOwner", response?.data?.data?.cartOwner);
    setCartOwner(response?.data?.data?.cartOwner);
  }
  useEffect(() => {
    getCartItems();
    localStorage.removeItem("paymentMethod");
  }, []);
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {localStorage.getItem("userToken") &&
      localStorage.getItem("cartOwner") == "undefined" ? (
        <Ops></Ops>
      ) : (
        <>
          <MainSlider></MainSlider>
          <CategorySlider></CategorySlider>
          <FeaturedProducts></FeaturedProducts>
        </>
      )}
    </div>
  );
}
