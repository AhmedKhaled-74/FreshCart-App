import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Style from "./VerifyForm.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyForm() {
  const [isCorrect, setisCorrect] = useState(false);
  const [otp, setOtp] = useState("");
  const [resend, setresend] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/forget");
    }
    return () => {
      if (!localStorage.getItem("correct")) {
        localStorage.removeItem("email");
      }
    };
  }, [navigate, isCorrect]);

  async function resendCode(email) {
    setresend(true);
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          email: email,
        }
      );

      if (data.statusMsg === "success") {
        setresend(false);
      }
    } catch (error) {
      console.log(error);
      window.scrollTo(0, 0);
    }
  }
  async function reSetPassword(otp) {
    try {
      const response = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          resetCode: otp,
        }
      );

      if (response?.data?.status === "Success") {
        setisCorrect(true);
        localStorage.setItem("correct", "true");
        navigate("/newpassword");
      }
    } catch (error) {
      setisCorrect(false);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className="text-center mt-10 pt-5">
      <h2 className="mt-4">Verify Your Account</h2>
      <p className="mt-4 textsm">
        We send you the six digit code to{" "}
        <strong className="text-main">{localStorage.getItem("email")}</strong>{" "}
        <br /> Enter the code below to reset your password (valid for 10 mins).
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span></span>}
          placeholder="------"
          containerStyle="code-container"
          inputStyle="code"
          inputType="tel"
          shouldAutoFocus={true}
          skipDefaultStyles={true}
          renderInput={(props) => <input {...props} />}
        />
        <div className="d-flex justify-content-center gap-3">
          <button
            type="submit"
            className="btn bg-main text-white mt-5"
            onClick={() => {
              reSetPassword(otp);
            }}
          >
            {" "}
            Done
          </button>
          <button
            className="btn mt-5"
            onClick={() => {
              resendCode(localStorage.getItem("email"));
            }}
          >
            <i
              className={`fa-solid fa-rotate-right icon ${
                resend ? "fa-spin text-main" : ""
              }`}
            ></i>{" "}
            &nbsp;Resend
          </button>
        </div>
      </form>
    </div>
  );
}
