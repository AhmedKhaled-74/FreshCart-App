import React, { useContext, useEffect, useState } from "react";

import Style from "./ForgetForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CartContext } from "../../Context/CartContext.js";
import { UserContext } from "../../Context/UserContext.js";

export default function ForgetForm() {
  let { setUserToken } = useContext(UserContext);
  let { setCartOwner } = useContext(CartContext);
  useEffect(() => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    setCartOwner(null);
    localStorage.removeItem("cartOwner");
    localStorage.removeItem("correct");
  }, []);
  let [error, setError] = useState(null);
  let [inputStatus, setInputStatus] = useState("enable");
  let [EmailForget, setEmailForget] = useState("enable");
  const [isLoading, setisLoading] = useState(false);
  let navigate = useNavigate();

  async function submitForget(values) {
    setisLoading(true);
    setInputStatus("disable");

    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        values
      );

      if (data.statusMsg === "success") {
        setInputStatus("enable");
        setisLoading(false);
        setEmailForget(values.email);
        localStorage.setItem("email", values.email);
        navigate("/verify");
      }
    } catch (error) {
      setError(error.response?.data?.statusMsg || "An error occurred");
      window.scrollTo(0, 0);
      setInputStatus("enable");
      setisLoading(false);
    }
  }

  let validationSchema = Yup.object({
    email: Yup.string().email("invalid mail").required("email is required"),
  });
  let formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: submitForget,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-ForgetPassword</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="w-75 mx-auto py-5">
        <h3 className="fw-bold">Forget Password ?</h3>
        {error ? (
          <div className="alert alert-danger text-center my-4 fs-6">
            {error}.
          </div>
        ) : (
          ""
        )}
        <form
          className={`${inputStatus == "disable" ? "disable" : ""} py-4`}
          onSubmit={formik.handleSubmit}
        >
          <div className=" d-flex flex-column gap-4">
            <div>
              <label className="small text-main" htmlFor="email">
                Enter your email :
              </label>
              <input
                className="form-control mt-1"
                type="email"
                name="email"
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="alert alert-danger p-2 mt-2">
                  {formik.errors.email}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="d-flex mt-4 justify-content-between align-items-center">
            {!isLoading ? (
              <button
                type="submit"
                disabled={!(formik.dirty && formik.isValid)}
                className={`btn ${
                  !(formik.dirty && formik.isValid) ? "not-allowed" : ""
                } bg-main text-white p-2 `}
              >
                Send Code
              </button>
            ) : (
              <button className="btn bg-main text-white d-flex justify-content-center align-items-center p-3  ">
                <PulseLoader
                  color="#fff"
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </button>
            )}
            <Link to={"/login"} className="text-decoration-none  ">
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
