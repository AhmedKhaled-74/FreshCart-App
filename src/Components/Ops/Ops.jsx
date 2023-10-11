import React, { useState } from "react";
import Style from "./Ops.module.css";
import OpsImg from "../../assets/How-to-Fix-500-Internal-Server-Error.png";

export default function Ops() {
  const [spin, setspin] = useState(false);
  return (
    <>
      <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex flex-column gap-5 justify-content-center align-items-center">
        <img src={OpsImg} alt="empty Wish List" className="w-50" />
        <h4 className="display-6 fw-bolder text-main">
          Something went wrong try reload
        </h4>
        <button
          className="btn reload"
          onClick={() => {
            setspin(true);
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
        >
          Reload <i className={`fas fa-spinner ${spin ? "fa-spin" : ""}`}></i>
        </button>
      </div>
    </>
  );
}
