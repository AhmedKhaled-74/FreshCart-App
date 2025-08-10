import slide1 from "../../assets/slider-image-1.jpeg";
import slide2 from "../../assets/slider-image-2.jpeg";
import slide3 from "../../assets/slider-image-3.jpeg";
import blog1 from "../../assets/blog-img-1.jpeg";
import blog2 from "../../assets/blog-img-2.jpeg";
import Slider from "react-slick";

export default function MainSlider() {
  var settings = {
    infinite: true,
    autoplay: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    customPaging: (i) => (
      <button className="rounded-1 border-0 outline-none px-2 py-1 bg-secondary"></button>
    ),
    dotsClass:
      "list-unstyled d-flex justify-content-center gap-3 align-items-center",
  };
  return (
    <>
      <div className="row g-0">
        <div className="col-md-9">
          {" "}
          <Slider {...settings}>
            <img
              className="w-100 object-fit-cover"
              height={400}
              src={slide1}
              alt=""
            />
            <img
              className="w-100 object-fit-cover"
              height={400}
              src={slide2}
              alt=""
            />
            <img
              className="w-100 object-fit-cover"
              height={400}
              src={slide3}
              alt=""
            />
          </Slider>
        </div>
        <div className="col-md-3">
          <img
            className="w-100 object-fit-cover"
            height={200}
            src={blog1}
            alt=""
          />
          <img
            className="w-100 object-fit-cover"
            height={200}
            src={blog2}
            alt=""
          />
        </div>
      </div>
    </>
  );
}
