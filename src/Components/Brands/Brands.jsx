import { useQuery } from "react-query";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { Helmet } from "react-helmet";

export default function Brands() {
  function getBrands() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/brands");
  }
  let { data } = useQuery("featuredProducts", getBrands, {
    refetchInterval: 10000,
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>FreshCart-Categories</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      {data?.data.data ? (
        <div className="row pt-5 g-4">
          {data?.data.data.map((brand) => (
            <div key={brand._id} className="col-4 col-md-2">
              <div className="brand cursor-pointer">
                <a
                  href={`https://www.${brand.name
                    ?.split(" ")
                    ?.slice(0, 2)
                    ?.join("")}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-100 object-fit-cover"
                    src={brand.image}
                    alt={brand.name}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-100 vh-100 bg-white z-1  fixed-top d-flex justify-content-center align-items-center">
          <PulseLoader size={25} color="#0aad0a"></PulseLoader>
        </div>
      )}
    </>
  );
}
