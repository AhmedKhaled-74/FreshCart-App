import React, { useContext, useEffect, useState } from "react";
import Style from "./WishList.module.css";
import { WishListContext } from "../../Context/WishListContext.js";
import PulseLoader from "react-spinners/PulseLoader";
import ClearWishListImg from "../../assets/empty-wishlist.png";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet";
export default function WishList() {
  let { getLoggedUserWish, removeWishItem, WishItems, setWishItems } =
    useContext(WishListContext);
  let [WishList, setWishList] = useState(null);
  let [emptyWishList, setEmptyWishList] = useState(false);
  let [loadingDU, setLoadingDU] = useState(false);

  async function getWishList() {
    let response = await getLoggedUserWish();
    if (response?.data?.status === "success" && response?.data.count != 0) {
      setWishList(response?.data);
      setWishItems(response.data.count);
    } else {
      setEmptyWishList(true);
    }
  }

  async function removeProductFromWish(id) {
    setLoadingDU(true);
    let response = await removeWishItem(id);
    if (response?.data?.status === "success") {
      await getWishList();
    }
    setLoadingDU(false);
  }
  useEffect(() => {
    const fetchData = async () => {
      await getWishList();
    };
    fetchData();
  });
  function clearingWishList() {
    setWishList(null);
    setWishItems(null);
    setEmptyWishList(true);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-WishList</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {WishList ? (
        <div className="container mx-auto my-3 p-3 bg-main-light">
          <div className="d-flex align-items-center py-3 justify-content-between gap-3">
            <div>
              <h3>Wishing List</h3>
            </div>
            <h4 className="h6">
              Wished Items: <strong>{WishList?.count}</strong>{" "}
            </h4>
          </div>

          {WishList?.data.map((prod) => (
            <div
              className="row border-bottom g-4 py-4 px-2 align-items-center"
              key={prod._id}
            >
              <div className="col-md-2 col-xl-1">
                <Link to={`/productDetails/${prod._id}`}>
                  <img
                    src={prod.imageCover}
                    className="w-100"
                    alt={prod.title}
                  />
                </Link>
              </div>
              <div className="col-md-10 col-xl-11">
                <div className="d-flex justify-content-between gap-5 align-items-center">
                  <Link to={`/productDetails/${prod._id}`} className="w-75">
                    <div>
                      {prod.title && (
                        <h3 className="h6">
                          {prod.title.split(" ").slice(0, 2).join(" ")}
                        </h3>
                      )}
                      <h6 className="text-main">{prod.price} EGP</h6>
                      <p className="small">
                        {prod.description.split(" ").slice(0, 21).join(" ")}
                      </p>
                    </div>
                  </Link>

                  <button
                    disabled={loadingDU ? true : false}
                    onClick={async () => {
                      if (WishList.count === 1) {
                        await removeProductFromWish(prod._id);
                        clearingWishList();
                      } else {
                        removeProductFromWish(prod._id);
                      }
                    }}
                    className={`InWish btn bg-main btn-hover text-white w-25 btn-sm mt-2 wish`}
                  >
                    <i className={`fa-solid fa-heart wish`}></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : emptyWishList ? (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex flex-column gap-5 justify-content-center align-items-center">
          <img src={ClearWishListImg} alt="empty Wish List" className="w-50" />
          <h4 className="display-6 fw-bolder text-main">
            Your wish list is now empty !
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
