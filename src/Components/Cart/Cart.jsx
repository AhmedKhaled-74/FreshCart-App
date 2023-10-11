import React, { useContext, useEffect, useState } from "react";
import Style from "./Cart.module.css";
import { CartContext } from "../../Context/CartContext.js";
import PulseLoader from "react-spinners/PulseLoader";
import ClearCartbtn from "../../assets/7841420_buy_cart_delete_trash_icon.svg";
import ClearCartImg from "../../assets/png-clipart-shopping-cart-online-shopping-shopping-centre-bag-empty-cart-angle-retail.png";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";
export default function Cart() {
  let {
    getLoggedUserCart,
    removeCartItem,
    updateProductQuantity,
    ClearCart,
    setPaymentMethod,
    setCartItems,
    CartItems,
  } = useContext(CartContext);
  let [cart, setCart] = useState(null);
  let [emptyCart, setEmptyCart] = useState(false);
  let [loadingDU, setLoadingDU] = useState(false);

  async function getCart() {
    let response = await getLoggedUserCart();
    setCartItems(response?.data?.numOfCartItems);
    setCart(response?.data);
    if (!cart) {
      setEmptyCart(true);
    } else {
      setEmptyCart(false);
    }
  }

  async function removeItem(id) {
    setLoadingDU(true);
    let response = await removeCartItem(id);
    setLoadingDU(false);
    setCart(response?.data);
    setCartItems(response?.data?.numOfCartItems);
  }
  async function updateItemCount(id, count) {
    setLoadingDU(true);
    let response = await updateProductQuantity(id, count);
    setCart(response?.data);
    setLoadingDU(false);
    setCartItems(response?.data?.numOfCartItems);
  }

  useEffect(() => {
    getCart();
  }, []);

  async function clearingCart() {
    await ClearCart();
    await getCart();
    setEmptyCart(true);
    setCartItems(null);
    localStorage.removeItem("cartOwner");
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Cart</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {cart ? (
        <div className="container mx-auto my-3 p-3 bg-main-light">
          <div className="d-flex align-items-start justify-content-between gap-3">
            <div>
              <h3>Shopping Cart</h3>

              <h4 className="h6">Cart Items: {cart.numOfCartItems}</h4>
              <h4 className="h6 fw-bolder text-main mb-4">
                Total Cart Price: {cart.data.totalCartPrice} EGP
              </h4>
            </div>
            <button
              className="btn btn-outline-danger d-flex align-items-center fw-bolder btn-clrCart gap-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <img src={ClearCartbtn} alt="empty cart" width={32} />
              Clear Cart
            </button>
          </div>
          <div
            className="modal fade p-5 mt-10"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Are you sure you want clear your cart?
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={clearingCart}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {cart.data.products.map((prod) => (
            <div className="row border-bottom py-2 px-2" key={prod._id}>
              <div className="col-md-1">
                <img
                  src={prod.product.imageCover}
                  className="w-100"
                  alt={prod.title}
                />
              </div>
              <div className="col-md-11">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="h6">
                      {prod.product.title.split(" ").slice(0, 2).join(" ")}
                    </h3>
                    <h6 className="text-main">{prod.price} EGP</h6>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      disabled={loadingDU ? true : false}
                      onClick={async () => {
                        if (prod.count > 1) {
                          await updateItemCount(
                            prod.product._id,
                            prod.count - 1
                          );
                        } else if (cart.numOfCartItems === 1) {
                          clearingCart();
                        } else {
                          removeItem(prod.product._id);
                        }
                      }}
                      className="btn btn-outline-danger btn-actCart"
                    >
                      -
                    </button>
                    <span className="fw-bolder fs-5">{prod.count}</span>
                    <button
                      disabled={loadingDU ? true : false}
                      onClick={async () => {
                        await updateItemCount(prod.product._id, prod.count + 1);
                      }}
                      className="btn btn-outline-success btn-actCart"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  disabled={loadingDU ? true : false}
                  onClick={() => {
                    if (cart.numOfCartItems === 1) {
                      clearingCart();
                    } else {
                      removeItem(prod.product._id);
                    }
                  }}
                  className="btn border-0 p-0 small"
                >
                  <i className="fas fa-trash-can text-danger me-1"></i> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="fasel mt-5"></div>

          <div className="d-flex align-items-center gap-3 mt-5">
            <Link
              to={"/address"}
              type="button"
              className="btn btn-main "
              onClick={() => {
                setPaymentMethod("visa"); // or any other method
                localStorage.setItem("paymentMethod", "visa"); // Update localStorage
              }}
            >
              Online Payment
            </Link>

            <Link
              to={"/address"}
              type="button"
              className="btn btn-main"
              onClick={() => {
                setPaymentMethod("cash"); // or any other method
                localStorage.setItem("paymentMethod", "cash"); // Update localStorage
              }}
            >
              Cash Payment
            </Link>
          </div>
        </div>
      ) : emptyCart ? (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex flex-column gap-5 justify-content-center align-items-center">
          <img src={ClearCartImg} alt="empty cart" className="w-25" />
          <h4 className="display-6 fw-bolder text-main">
            Your cart is now empty !
          </h4>
        </div>
      ) : (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      )}
    </>
  );
}
