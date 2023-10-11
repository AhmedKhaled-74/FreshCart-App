import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout/Layout.jsx";
import Home from "./Components/Home/Home.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import Brands from "./Components/Brands/Brands.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import WishList from "./Components/WishList/WishList.jsx";
import VerifyForm from "./Components/VerifyForm/VerifyForm.jsx";

import NotFound from "./Components/NotFound/NotFound.jsx";
import CounterContextProvider from "./Context/CounterContext.js";
import UserContextProvider from "./Context/UserContext.js";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";
import ProductDetails from "./Components/ProductDetails/ProductDetails.jsx";
import CartContextProvider from "./Context/CartContext.js";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store } from "./Redux/Store.js";
import Address from "./Components/address/address.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import WishListContextProvider from "./Context/WishListContext.js";
import ForgetForm from "./Components/ForgetForm/ForgetForm.jsx";
import NewPasswordForm from "./Components/NewPasswordForm/NewPasswordForm.jsx";

const routers = createBrowserRouter([
  {
    path: "",
    element: <Layout></Layout>,
    children: [
      { index: true, element: <Home></Home> },
      { path: "home", element: <Home></Home> },
      { path: "login", element: <Login></Login> },

      {
        path: "Cart",
        element: (
          <ProtectedRoute>
            <Cart></Cart>
          </ProtectedRoute>
        ),
      },
      {
        path: "address",
        element: (
          <ProtectedRoute>
            <Address></Address>
          </ProtectedRoute>
        ),
      },
      {
        path: "allorders",
        element: (
          <ProtectedRoute>
            <Orders></Orders>
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <WishList></WishList>
          </ProtectedRoute>
        ),
      },
      { path: "verify", element: <VerifyForm></VerifyForm> },
      { path: "forget", element: <ForgetForm></ForgetForm> },
      { path: "newpassword", element: <NewPasswordForm></NewPasswordForm> },
      { path: "Register", element: <Register></Register> },
      { path: "Brands", element: <Brands></Brands> },
      { path: "Categories", element: <Categories></Categories> },
      {
        path: "productDetails/:id",
        element: <ProductDetails></ProductDetails>,
      },
      { path: "*", element: <NotFound></NotFound> },
    ],
  },
]);
function App() {
  return (
    <div className="overflow-x-hidden">
      <WishListContextProvider>
        <CartContextProvider>
          <UserContextProvider>
            <CounterContextProvider>
              <Provider store={store}>
                <RouterProvider router={routers}></RouterProvider>
                <ToastContainer className={"foo"} />
              </Provider>
            </CounterContextProvider>
          </UserContextProvider>
        </CartContextProvider>
      </WishListContextProvider>
    </div>
  );
}

export default App;
