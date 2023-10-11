import React, { useContext, useEffect, useState } from "react";

import Style from "./NewPasswordForm.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

export default function NewPasswordForm() {
  let [error, setError] = useState(null);
  let [inputStatus, setInputStatus] = useState("enable");
  const [isLoading, setisLoading] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/forget");
    }
    return () => {
      localStorage.removeItem("email");
    };
  }, []);
  async function submitResetPassword(values) {
    setisLoading(true);
    setInputStatus("disable");

    try {
      const { data } = await axios.put(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          email: `${localStorage.getItem("email")}`,
          newPassword: `${formik.values.newPassword}`,
        }
      );
      if (data.token) {
        setInputStatus("enable");
        setisLoading(false);
        toast("Password Changed Successfully", {
          duration: 1000,
          position: "top-center",
          icon: "✔",
          className: "text-success small fw-bolder",
        });
        navigate("/login");
        localStorage.removeItem("email");
      }
    } catch (error) {
      setError(error.response?.data?.statusMsg || "An error occurred");
      window.scrollTo(0, 0);
      setInputStatus("enable");
      setisLoading(false);
    }
  }

  let validationSchema = Yup.object({
    newPassword: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{7,15}$/,
        "password must contains uppercase letter , lowercase letter and numbers and be from 7 to 15 character"
      )
      .required("password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "password not match")
      .required("enter password again"),
  });
  let formik = useFormik({
    initialValues: {
      newPassword: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: submitResetPassword,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-NewPassword</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="w-75 mx-auto py-5">
        <h3 className="fw-bold">Reset Password </h3>
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
              <input
                className="btn w-100 mt-1 mb-4 bg-main text-white"
                type="email"
                id="email"
                disabled={true}
                value={localStorage.getItem("email")}
              />
              <div>
                <label className="small text-main" htmlFor="newPassword">
                  Enter your new Password :
                </label>
                <input
                  className="form-control mt-1"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                />
                {formik.errors.newPassword && formik.touched.newPassword ? (
                  <div className="alert alert-danger p-2 mt-2">
                    {formik.errors.newPassword}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label className="small text-main" htmlFor="repassword">
                  Enter your repassword :
                </label>
                <input
                  className="form-control mt-1"
                  type="password"
                  name="rePassword"
                  id="repassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.rePassword}
                />
                {formik.errors.rePassword && formik.touched.rePassword ? (
                  <div className="alert alert-danger p-2 mt-2">
                    {formik.errors.rePassword}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="d-flex mt-4 justify-content-between align-items-center">
            {!isLoading ? (
              <button
                type="submit"
                disabled={!(formik.dirty && formik.isValid)}
                className={`btn ${
                  !(formik.dirty && formik.isValid) ? "" : ""
                } bg-main text-white p-2 `}
              >
                Reset
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
