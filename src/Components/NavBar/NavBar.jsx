import React, { useContext, useEffect, useRef, useState } from "react";
import Style from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/freshcart-logo.svg";
import { UserContext } from "../../Context/UserContext.js";
import { CartContext } from "../../Context/CartContext.js";
import { WishListContext } from "../../Context/WishListContext.js";
export default function NavBar() {
  let { getLoggedUserCart, CartItems, setCartOwner, setCartItems } =
    useContext(CartContext);
  let { getLoggedUserWish, setWishItems, WishItems } =
    useContext(WishListContext);
  let { userToken, setUserToken } = useContext(UserContext);
  let token = localStorage.getItem("userToken");
  let navigate = useNavigate();
  const myButtonRef = useRef(null);
  useEffect(() => {
    if (userToken) {
      async function fetchData() {
        const cartResponse = await getLoggedUserCart();
        const wishResponse = await getLoggedUserWish();

        setCartItems(cartResponse?.data?.numOfCartItems);
        setWishItems(wishResponse?.data?.count);
      }
      fetchData();
    } else {
      setCartItems([]);
      setWishItems([]);
    }
  }, [userToken]);

  const [navOpen, setNavOpen] = useState(false);
  const closeNav = () => {
    if (navOpen && window.innerWidth < 992) {
      setTimeout(() => {
        myButtonRef.current.click();
      }, 150);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);
  };
  function logOut() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("cartOwner");
    setUserToken(null);
    setCartOwner(null);
    setCartItems([]);
    setWishItems([]);

    if (
      /\/cart|\/allorders|\/wishlist|\/address/.test(window.location.pathname)
    ) {
      navigate("/login");
    }
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg z-big fixed-top bg-white shadow">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="fresh market logo" />
          </Link>
          <button
            ref={myButtonRef}
            onClick={() => setNavOpen((prevNavOpen) => !prevNavOpen)}
            className="navbar-toggler px-3 py-1"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            {navOpen ? (
              <span className="fas fa-x fa-lg"></span>
            ) : (
              <span className="navbar-toggler-icon"></span>
            )}
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mt-2 mt-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={closeNav}>
                  Home
                </Link>
              </li>
              {userToken ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart" onClick={closeNav}>
                      Cart
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/allorders"
                      onClick={closeNav}
                    >
                      Orders
                    </Link>
                  </li>
                </>
              ) : (
                ""
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/categories" onClick={closeNav}>
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/brands" onClick={closeNav}>
                  Brands
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
              {userToken ? (
                <div className="d-flex mb-4 mb-lg-0 gap-1">
                  <li
                    style={{ width: "40px", height: "40px" }}
                    className="nav-item bg-black  rounded-3 d-flex align-items-center justify-content-center me-3"
                  >
                    <Link className="nav-link" to="/cart" onClick={closeNav}>
                      <i
                        className={`${
                          !CartItems ? "text-white" : "text-main"
                        } fa-solid position-relative fa-cart-shopping icon fa-lg lh-1`}
                      >
                        <span
                          className={`${
                            CartItems === "Max"
                              ? "max text-danger"
                              : "text-white"
                          } all-cart ${!CartItems ? "opacity-0" : ""}`}
                        >
                          {CartItems}
                        </span>
                      </i>
                    </Link>
                  </li>

                  <li
                    style={{ width: "40px", height: "40px" }}
                    className="nav-item bg-black  rounded-3 d-flex align-items-center justify-content-center me-3"
                  >
                    <Link
                      className="nav-link"
                      to="/wishlist"
                      onClick={closeNav}
                    >
                      <i
                        className={`${
                          !WishItems ? "text-white" : "text-main"
                        } fa-solid position-relative fa-heart text-main icon fa-lg lh-1`}
                      >
                        <span
                          className={`${
                            WishItems === "Max"
                              ? "max text-danger"
                              : "text-white"
                          } all-cart ${!WishItems ? "opacity-0" : ""}`}
                        >
                          {WishItems}
                        </span>
                      </i>
                    </Link>
                  </li>
                </div>
              ) : (
                ""
              )}

              <li className="nav-item d-flex align-items-center">
                <i className="fab fa-facebook mx-2"></i>
                <i className="fab fa-x-twitter mx-2"></i>
                <i className="fab fa-instagram mx-2"></i>
                <i className="fab fa-tiktok mx-2"></i>
                <i className="fab fa-youtube mx-2"></i>
              </li>
              {!userToken ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login" onClick={closeNav}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/register"
                      onClick={closeNav}
                    >
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <span
                    className="nav-link cursor-pointer"
                    onClick={() => {
                      logOut();
                      closeNav();
                    }}
                  >
                    Logout
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
