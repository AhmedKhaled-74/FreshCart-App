import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CartContext } from "../../Context/CartContext.js";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { Helmet } from "react-helmet";

export default function Address() {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cartId, setcartId] = useState(null);
  const {
    onlinePayment,
    cashPayment,
    getLoggedUserCart,
    paymentMethod,
    setPaymentMethod,
  } = useContext(CartContext);

  useEffect(() => {
    function handleResize() {
      setWindowSize(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getLoggedUserCart();
        if (!data) {
          setIsLoading(false);
          navigate("/cart");
        } else {
          setIsLoading(false);
          setcartId(data?.data?._id);
          setPaymentMethod(localStorage.getItem("paymentMethod"));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [cartId, getLoggedUserCart, navigate, setPaymentMethod]);

  async function handleAddressSubmit(cartId, values) {
    if (paymentMethod === "visa") {
      let response = await onlinePayment(
        cartId,
        "http://localhost:3000",
        values
      );
      window.location.href = response?.data?.session.url;
    } else if (paymentMethod === "cash") {
      let response = await cashPayment(cartId, values);
      if (response?.data?.status === "success") {
        navigate("/allorders");
      }
    }
  }
  let validationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^(002|\+2)?(01[0125])(\d{8})$/, "phone number isnt valid")
      .required("phone is required"),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces")
      .min(2, "City must be at least 2 characters long")
      .max(50, "City can be at most 50 characters long")
      .required("city is required"),
  });
  let formik = useFormik({
    initialValues: {
      name: "",
      details: "",
      phone: "",
      city: "",
    },
    validationSchema,
    onSubmit: () => {
      handleAddressSubmit(cartId);
    },
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Address</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {isLoading ? (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      ) : (
        <div
          className={`container ${windowSize > 764 ? "w-50" : ""} mx-auto pt-5`}
        >
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name :</label>
            <input
              className="form-control mb-2"
              id="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="name"
              value={formik.values.name}
            />
            <label htmlFor="details">Details :</label>
            <input
              className="form-control mb-2"
              id="details"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="details"
              value={formik.values.details}
            />
            <label htmlFor="phone">Phone :</label>
            <input
              className="form-control mb-2"
              id="phone"
              type="tel"
              inputMode="numeric"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="phone"
              value={formik.values.phone}
            />
            {formik.errors.phone && formik.touched.phone ? (
              <div className="alert alert-danger p-2 mt-2">
                {formik.errors.phone}
              </div>
            ) : (
              ""
            )}
            <label htmlFor="city">City :</label>
            <input
              className="form-control mb-2"
              id="city"
              type="text"
              autoComplete="home city"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="city"
              value={formik.values.city}
            />
            {formik.errors.city && formik.touched.city ? (
              <div className="alert alert-danger p-2 mt-2">
                {formik.errors.city}
              </div>
            ) : (
              ""
            )}
            <button type="submit" className="btn bg-main text-white mt-5">
              Check Out
            </button>
          </form>
        </div>
      )}
    </>
  );
}
