import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import PulseLoader from "react-spinners/PulseLoader";
import Style from "./Orders.module.css";
import { CartContext } from "../../Context/CartContext.js";
import Slider from "react-slick";
import { Helmet } from "react-helmet";
import NoOrders from "../../assets/empty-bag.svg";

export default function Orders() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    swipeToSlide: true,

    slidesToScroll: 1,

    // fade: true,

    autoplay: true,
  };
  let {
    cartOwner,
    getLoggedUserCart,
    setCartItems,
    setCartOwner,
    getCartOwner,
  } = useContext(CartContext);
  async function getCart() {
    let response = await getLoggedUserCart();
    let resOwner = await getCartOwner();
    setCartItems(response?.data?.numOfCartItems);
    setCartOwner(resOwner?.data?.decoded?.id);
    localStorage.setItem("cartOwner", resOwner?.data?.decoded?.id);
  }
  useEffect(() => {
    getCart();
  });

  function getUserOrder(cartOwner) {
    return axios.get(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${cartOwner}`
    );
  }

  const { data } = useQuery(
    "userOrders", // Provide a unique query key
    () => getUserOrder(cartOwner),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Orders</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      {data ? (
        <div>
          {data?.data?.length === 0 ? (
            <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex flex-column gap-5 justify-content-center align-items-center">
              <img
                src={NoOrders}
                alt="No Orders yet"
                className={` ${Style?.noOrders} `}
              />
              <h4 className="display-6 fw-bolder text-main">
                You dont have any orders yet !
              </h4>
            </div>
          ) : (
            data?.data?.map((order) => (
              <div
                key={order._id}
                className="row mt-3 border-1 border-bottom border-black py-4 text-center align-items-center"
              >
                <div className="col-lg-2">
                  <p className="fs-6 fw-semibold">
                    Price: &nbsp;
                    <strong className="text-main">
                      {order.totalOrderPrice} EGP
                    </strong>
                  </p>
                </div>
                <div className="col-lg-2">
                  <p className="fs-6 fw-semibold">
                    Method: &nbsp;
                    {order.paymentMethodType === "card" ? (
                      <i className="fa-solid fa-credit-card text-main"></i>
                    ) : (
                      <i className="fa-solid fa-sack-dollar text-main"></i>
                    )}
                  </p>
                </div>

                <div className="col-lg-2">
                  <p className="fs-6 fw-semibold ">
                    Delivered: &nbsp;
                    {order.isDelivered ? (
                      <i className="fa-solid fa-truck text-danger"></i>
                    ) : (
                      <i className="fa-solid fa-truck text-main"></i>
                    )}
                  </p>
                </div>
                <div className="col-lg-2">
                  <p className="fs-6 fw-semibold px-2">
                    Paid: &nbsp;
                    {order.isPaid ? (
                      <i className="fa-solid fa-money-bill-wave text-danger"></i>
                    ) : (
                      <i className="fa-solid fa-money-bill-wave text-main"></i>
                    )}
                  </p>
                </div>
                <div className="col-lg-2">
                  <div>
                    <Slider {...settings}>
                      {order.cartItems.map((prod) => (
                        <img
                          key={prod?.product._id}
                          src={prod?.product.imageCover}
                          height={150}
                          className="object-fit-cover"
                          alt={prod?.product.title}
                        />
                      ))}
                    </Slider>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div>
                    Items: &nbsp;
                    {order?.cartItems?.reduce(
                      (totalCount, prod) => totalCount + prod.count,
                      0
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      )}
    </>
  );
}
