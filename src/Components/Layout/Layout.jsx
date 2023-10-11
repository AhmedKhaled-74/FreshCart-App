import React, { useContext, useEffect, useState } from "react";
import Style from "./Layout.module.css";
import NavBar from "../NavBar/NavBar.jsx";
import Footer from "../Footer/Footer.jsx";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.js";

export default function Layout() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setUserToken(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    setShowStatus(false);

    const onlineHandler = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => {
        setShowStatus(false);
      }, 5000);
    };

    const offlineHandler = () => {
      setIsOnline(false);
      setShowStatus(true);
      setTimeout(() => {
        setShowStatus(false);
      }, 5000);
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  let { setUserToken } = useContext(UserContext);

  return (
    <>
      <NavBar></NavBar>
      <div className="mt-10 container">
        <Outlet />
        {showStatus && (
          <div
            className={`${
              isOnline ? "normal" : "warning"
            } p-2 detactor-stat rounded-2 bg-white d-inline`}
          >
            {isOnline ? (
              <i className="fas fa-wifi text-success"></i>
            ) : (
              <i className="fas fa-wifi text-danger"></i>
            )}{" "}
            &nbsp; You are currently {isOnline ? "online" : "offline"}
          </div>
        )}
      </div>
      <Footer></Footer>
    </>
  );
}
