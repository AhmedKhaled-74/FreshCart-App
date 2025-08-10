import { useQuery } from "react-query";
import axios from "axios";
import Slider from "react-slick";

export default function CategorySlider() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    swipeToSlide: true,
    className: "py-5",
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],

    dots: true,
    customPaging: (i) => (
      <button className="rounded-1 border-0 outline-none px-2 py-1 bg-secondary"></button>
    ),
    dotsClass:
      "list-unstyled d-flex justify-content-center gap-3 align-items-center",
    autoplay: true,
  };
  function getCategoriesData() {
    return axios.get("https://ecommerce.routemisr.com/api/v1/categories");
  }
  let { data } = useQuery("categorySliderImgs", getCategoriesData);
  let info = data?.data.data;
  return (
    <>
      <Slider {...settings}>
        {info
          ? info.map((cat) => (
              <img
                key={cat._id}
                src={cat.image}
                height={200}
                className="w-100 object-fit-cover "
                alt={cat.name}
              />
            ))
          : ""}
      </Slider>
    </>
  );
}
