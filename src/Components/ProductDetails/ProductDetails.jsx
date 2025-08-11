import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Slider from "react-slick";
import axios from "axios";
import { Helmet } from "react-helmet";
import { CounterContext } from "../../Context/CounterContext.js";
import { CartContext } from "../../Context/CartContext.js";
import { toast } from "react-toastify";
import { UserContext } from "../../Context/UserContext.js";
import { WishListContext } from "../../Context/WishListContext.js";
export default function ProductDetails() {
  let { increase } = useContext(CounterContext);
  let { addToCart, getLoggedUserCart, setCartItems } = useContext(CartContext);
  let { addToWish, getLoggedUserWish, removeWishItem, setWishItems } =
    useContext(WishListContext);
  let { userToken } = useContext(UserContext);
  const [List, setList] = useState([]);
  let navigate = useNavigate();
  const handleToastCartClick = () => {
    navigate("/cart");
  };
  const handleToastWishClick = () => {
    navigate("/wishlist");
  };
  async function getCartItems() {
    let response = await getLoggedUserCart();
    setCartItems(response?.data?.numOfCartItems);
  }
  async function getWishItems() {
    let response = await getLoggedUserWish();
    const wishData = await response?.data;
    setWishItems(wishData?.count);
    const wishItemIds = await wishData?.data?.map((wish) => wish._id);
    setList(wishItemIds);
  }
  useEffect(() => {
    getWishItems();
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

  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let { id } = useParams();
  function getProductDetails(id) {
    return axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }
  let { data } = useQuery("productDetails", () => getProductDetails(id));
  let info = data?.data?.data;
  return (
    <>
      {info ? (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{info?.title}</title>
            <link rel="canonical" href="http://mysite.com/example" />
          </Helmet>
          <div className="row py-2 g-4 align-items-center">
            <div className="col-md-4">
              <Slider {...settings}>
                {info?.images.map((img, index) => (
                  <img
                    src={img}
                    key={index}
                    className="w-100"
                    alt={info?.title}
                  ></img>
                ))}
              </Slider>
            </div>
            <div className="col-md-8 d-flex flex-column gap-1">
              <h2 className="h4 fw-bolder mb-4">{info?.title}</h2>
              <p className="mb-4">{info?.description}</p>
              <h6 className="fw-bolder">{info?.category?.name}</h6>
              <div className="d-flex justify-content-between  align-items-center">
                <h6 className="fw-bolder">Price: {info?.price} EGP</h6>
                <span>
                  <i className="fas fa-star rating-color"></i>
                  {info?.ratingsAverage} &nbsp;
                  <span className="small">({info?.ratingsQuantity} Rated)</span>
                </span>
              </div>
              <div className="d-flex gap-1">
                <button
                  onClick={async () => {
                    if (userToken) {
                      increase();
                      await addProductToCart(info?._id);
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
                    if (userToken && !List.includes(info?._id)) {
                      increase();
                      await addProductToWish(info?._id);
                      getWishItems();
                    } else if (userToken && List.includes(info?._id)) {
                      await removeProductFromWish(info?._id);
                      getWishItems();
                    } else {
                      navigate("/login");
                    }
                  }}
                  className={`${List.includes(info?._id) ? "InWish" : ""}
                    btn bg-main btn-hover text-white w-25 btn-sm mt-2 wish`}
                >
                  <i className={`fa-solid fa-heart wish`}></i>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
