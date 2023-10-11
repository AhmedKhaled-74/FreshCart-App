import React from "react";
import Style from "./NotFound.module.css";
import NotFoundImg from "../../assets/error.svg";
export default function NotFound() {
  return (
    <>
      <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex flex-column gap-5 justify-content-center align-items-center">
        <img src={NotFoundImg} alt="empty cart" className="w-50" />
      </div>
    </>
  );
}
