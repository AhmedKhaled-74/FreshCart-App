import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CounterContext } from "../../Context/CounterContext.js";
import { useQuery } from "react-query";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext.js";
import { WishListContext } from "../../Context/WishListContext.js";
import { UserContext } from "../../Context/UserContext.js";
import { toast } from "react-toastify";
export default function FeaturedProducts() {
  let { increase } = useContext(CounterContext);
  let { addToCart, getLoggedUserCart, setCartItems, setCartOwner } =
    useContext(CartContext);
  let { addToWish, getLoggedUserWish, removeWishItem, setWishItems } =
    useContext(WishListContext);

  const [List, setList] = useState([]);
  let navigate = useNavigate();
  let { userToken } = useContext(UserContext);
  const handleToastCartClick = () => {
    navigate("/cart");
  };
  const handleToastWishClick = () => {
    navigate("/wishlist");
  };

  async function getCartItems() {
    let response = await getLoggedUserCart();
    setCartItems(response?.data?.numOfCartItems);
    localStorage.setItem("cartOwner", response?.data?.data?.cartOwner);
    setCartOwner(response?.data?.data?.cartOwner);
  }
  async function getWishItems() {
    let response = await getLoggedUserWish();
    const wishData = await response?.data;
    setWishItems(wishData?.count);
    const wishItemIds = await wishData?.data.map((wish) => wish._id);
    setList(wishItemIds);
  }
  useEffect(() => {
    getWishItems();
    localStorage.removeItem("paymentMethod");
  }, []);
  const showToast = (res) => {
    toast(res?.message, {
      duration: 3000,
      position: "top-center",
      icon: `${res?.status === "success" ? "✔" : "✖"}`,

      style: {},
      className: "text-success small fw-bolder",
      onClick: () => {
        if (res?.message?.includes("cart")) {
          handleToastCartClick();
        } else {
          handleToastWishClick();
        }
      },
    });
  };
  async function addProductToCart(id) {
    let response = await addToCart(id);
    showToast(response?.data);
  }
  async function addProductToWish(id) {
    let response = await addToWish(id);
    showToast(response?.data);
  }
  async function removeProductFromWish(id) {
    let response = await removeWishItem(id);
    showToast(response?.data);
  }

  function getFeaturedProducts() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/products");
  }
  let { isLoading, data } = useQuery("featuredProducts", getFeaturedProducts, {
    refetchInterval: 10000,
  });

  return (
    <>
      {isLoading ? (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      ) : (
        <div className="row g-3 align-items-start">
          {data?.data.data.map((product) => (
            <div key={product._id} className="col-md-4 col-lg-2">
              <div className="product h-100 cursor-pointer overflow-hidden py-3 px-2">
                <Link to={`/productDetails/${product._id}`}>
                  <img
                    src={product.imageCover}
                    className="w-100 mb-4"
                    alt={product.title}
                  />
                  <span className="text-main small fw-bolder">
                    {product?.category?.name}
                  </span>
                  <h3 className="h6 mt-2 fw-bold">
                    {product?.title?.split(" ").slice(0, 2).join(" ")}
                  </h3>
                  <div className="d-flex justify-content-between  align-items-center">
                    <span>{product.price} EGP</span>
                    <span>
                      <i className="fas fa-star rating-color"></i>
                      {product.ratingsAverage}
                    </span>
                  </div>
                </Link>
                <div className="d-flex gap-1">
                  <button
                    onClick={async () => {
                      if (userToken) {
                        increase();
                        await addProductToCart(product._id);
                        getCartItems();
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="btn bg-main btn-hover text-white w-100 btn-sm mt-2"
                  >
                    add to cart
                  </button>
                  <button
                    onClick={async () => {
                      if (userToken && !List?.includes(product._id)) {
                        await addProductToWish(product._id);
                        getWishItems();
                      } else if (userToken && List?.includes(product._id)) {
                        await removeProductFromWish(product._id);
                        getWishItems();
                      } else {
                        navigate("/login");
                      }
                    }}
                    className={`${List?.includes(product._id) ? "InWish" : ""}
                    btn bg-main btn-hover text-white w-25 btn-sm mt-2 wish`}
                  >
                    <i className={`fa-solid fa-heart wish`}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
