import { useContext, useEffect } from "react";
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts.jsx";
import CategorySlider from "../CategorySlider/CategorySlider.jsx";
import MainSlider from "../MainSlider/MainSlider.jsx";
import Ops from "../Ops/Ops.jsx";
import { Helmet } from "react-helmet";
import { CartContext } from "../../Context/CartContext.js";

export default function Home() {
  let {
    getLoggedUserCart,
    setCartOwner,
    setCartItems,
    cartOwner,
    getCartOwner,
  } = useContext(CartContext);
  async function getCartItems() {
    let response = await getLoggedUserCart();
    let resOwner = await getCartOwner();
    if (
      response?.data?.status === "success" &&
      resOwner?.data?.message === "verified"
    ) {
      setCartOwner(resOwner?.data?.decoded?.id);
      setCartItems(response?.data?.numOfCartItems);
      localStorage.setItem("cartOwner", resOwner?.data?.decoded?.id);
    } else {
      localStorage.removeItem("cartOwner");
      setCartOwner("");
    }
  }
  useEffect(() => {
    getCartItems();
    localStorage.removeItem("paymentMethod");
  }, [cartOwner]);
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
