import React from "react";
import Style from "./Footer.module.css";

export default function Footer() {
  return (
    <>
      <footer className="py-5 bg-main-light mt-5">
        <div className="container">
          <h1>Get the FreshCart app</h1>
          <p>We share this link Lorem ipsum dolor sit. </p>
          <div className="row">
            <div className="col-md-9">
              <input
                type="text"
                placeholder="Share Link"
                className="form-control"
              />
            </div>
            <div className="col-md-3">
              <button className="btn bg-main text-white form-control">
                Share Link
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
