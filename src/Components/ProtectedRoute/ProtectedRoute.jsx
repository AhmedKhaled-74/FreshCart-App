import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props) {
  if (!localStorage.getItem("userToken")) {
    return <Navigate to={"/login"}></Navigate>;
  } else {
    return props.children;
  }
}
