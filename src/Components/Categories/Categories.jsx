import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../Redux/categoriesSlice.js";
import PulseLoader from "react-spinners/PulseLoader";
import { Helmet } from "react-helmet";

export default function Categories() {
  let { loading, categories } = useSelector(
    (state) => state.categories
  );
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Categories</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {loading ? (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      ) : (
        <div className="row pt-5 g-3">
          {categories.map((category) => (
            <div key={category._id} className="col-md-2">
              <div className="category cursor-pointer">
                <img
                  className="w-100 object-fit-cover"
                  height={200}
                  src={category.image}
                  alt={category.name}
                />
                <h4 className="h6 my-2 text-center">
                  {category.name.split(" ").slice(0, 3).join(" ")}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
