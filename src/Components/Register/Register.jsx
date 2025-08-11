import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { CartContext } from "../../Context/CartContext.js";
import { UserContext } from "../../Context/UserContext.js";
export default function Register() {
  let [error, setError] = useState(null);
  let [inputStatus, setInputStatus] = useState("enable");
  const [isLoading, setisLoading] = useState(false);

  let { setUserToken } = useContext(UserContext);
  let { setCartOwner } = useContext(CartContext);
  let navigate = useNavigate();
  useEffect(() => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    setCartOwner(null);
    localStorage.removeItem("cartOwner");
  }, []);
  async function submitRegister(values) {
    setisLoading(true);
    setInputStatus("disable");
    let { data } = await axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signup", values)
      .catch(({ response }) => {
        setError(
          response?.data?.message +
            " - " +
            (response?.data?.errors?.msg ?? "try again")
        );

        window.scrollTo(0, 0);
        setisLoading(false);
        setInputStatus("enable");
      });
    if (data.message === "success") {
      navigate("/login");
      setisLoading(false);
      setInputStatus("enable");
    }
  }

  let validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "name minLength is 3")
      .max(11, "name minLength is 11")
      .required("name is required"),
    email: Yup.string().email("invalid mail").required("email is required"),
    phone: Yup.string()
      .matches(/^(002|\+2)?(01[0125])(\d{8})$/, "phone number isnt valid")
      .required("phone is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{7,15}$/,
        "password must contains uppercase letter , lowercase letter and numbers and be from 7 to 15 character"
      )
      .required("password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "password not match")
      .required("enter password again"),
  });
  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: submitRegister,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-SignUp</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="w-75 mx-auto py-5">
        <h3 className="fw-bold">Register Now</h3>
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
              <label className="small text-main" htmlFor="name">
                Enter your name :
              </label>
              <input
                className="form-control mt-1"
                type="text"
                name="name"
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="alert alert-danger p-2 mt-2">
                  {formik.errors.name}
                </div>
              ) : (
                ""
              )}
            </div>
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
            <div>
              <label className="small text-main" htmlFor="phone">
                Enter your phone :
              </label>
              <input
                className="form-control mt-1"
                type="tel"
                name="phone"
                id="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <div className="alert alert-danger p-2 mt-2">
                  {formik.errors.phone}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <label className="small text-main" htmlFor="password">
                Enter your password :
              </label>
              <input
                className="form-control mt-1"
                type="password"
                name="password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="alert alert-danger p-2 mt-2">
                  {formik.errors.password}
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
          {!isLoading ? (
            <button
              type="submit"
              disabled={!(formik.dirty && formik.isValid)}
              className={`btn ${
                !(formik.dirty && formik.isValid) ? "not-allowed" : ""
              } bg-main text-white p-2 mt-4`}
            >
              Register
            </button>
          ) : (
            <button className="btn bg-main text-white d-flex justify-content-center align-items-center p-3 mt-4">
              <PulseLoader
                color="#fff"
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </button>
          )}
        </form>
      </div>
    </>
  );
}
