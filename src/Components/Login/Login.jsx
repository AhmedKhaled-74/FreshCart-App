import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.js";
import { CartContext } from "../../Context/CartContext.js";
import { Helmet } from "react-helmet";

export default function Register() {
  let { setUserToken } = useContext(UserContext);
  let { setCartOwner } = useContext(CartContext);
  let [error, setError] = useState(null);
  let [inputStatus, setInputStatus] = useState("enable");
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setUserToken(null);
    localStorage.removeItem("userToken");
    setCartOwner(null);
    localStorage.removeItem("cartOwner");
    localStorage.removeItem("correct");
  }, []);
  let navigate = useNavigate();

  async function submitLogin(values) {
    setisLoading(true);
    setInputStatus("disable");

    try {
      // Send the login request
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/signin",
        values
      );

      if (data?.message === "success") {
        localStorage.setItem("userToken", data?.token);
        setUserToken(data?.token);

        // Set the headers for the new token
        const authHeaders = { token: data?.token };

        // 1️⃣ Refresh the cart for the logged-in user
        const cartRes = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/cart",
          { headers: authHeaders }
        );
        // Store the cart owner if needed
        setCartOwner(cartRes?.data?.data?.cartOwner || null);
        localStorage.setItem("cartOwner", cartRes?.data?.data?.cartOwner || "");

        // 2️⃣ (Optional) Refresh wishlist/orders the same way
        // await refreshWishlist(authHeaders);
        // await refreshOrders(authHeaders);

        setInputStatus("enable");
        setisLoading(false);

        // 3️⃣ Navigate home with updated data
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
      window.scrollTo(0, 0);
      setInputStatus("enable");
      setisLoading(false);
    }
  }

  let validationSchema = Yup.object({
    email: Yup.string().email("invalid mail").required("email is required"),

    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{7,15}$/,
        "password must contains uppercase letter , lowercase letter and numbers and be from 7 to 15 character"
      )
      .required("password is required"),
  });
  let formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: submitLogin,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Login</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <div className="w-75 mx-auto py-5">
        <h3 className="fw-bold">Login Now</h3>
        {error ? (
          <div className="alert alert-danger text-center my-4 fs-6">
            {error}.
          </div>
        ) : (
          ""
        )}
        <form
          className={`${inputStatus === "disable" ? "disable" : ""} py-4`}
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
          </div>
          <div className="d-flex mt-4 justify-content-center  align-items-center flex-column flex-md-row gap-4">
            {!isLoading ? (
              <button
                type="submit"
                disabled={!(formik.dirty && formik.isValid)}
                className={`btn ${
                  !(formik.dirty && formik.isValid) ? "not-allowed" : ""
                } bg-main text-white p-2 `}
              >
                Login
              </button>
            ) : (
              <button className="btn bg-main text-white d-flex  justify-content-center align-items-center p-3 ">
                <PulseLoader
                  color="#fff"
                  size={10}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </button>
            )}
            <Link
              to={"/register"}
              className="text-decoration-none d-inline-block  text-center"
            >
              Register Now ?
            </Link>
            <Link to={"/forget"} className="text-decoration-none ms-lg-auto  ">
              Forget Password ?
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
