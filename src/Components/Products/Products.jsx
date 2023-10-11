import React from "react";
import Style from "./Products.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  decrease,
  increase,
  increaseByAmount,
} from "../../Redux/counterSlice.js";

export default function Products() {
  let { counter } = useSelector((state) => state.counter);
  let dispatch = useDispatch();

  return (
    <div>
      <h2>Products counter:{counter}</h2>
      <div className="d-flex gap-4">
        <button className="btn btn-info" onClick={() => dispatch(increase())}>
          increase
        </button>
        <button
          className="btn btn-warning"
          onClick={() => dispatch(decrease())}
        >
          decrease
        </button>
        <button
          className="btn btn-success"
          onClick={() => dispatch(increaseByAmount(15))}
        >
          increaseByAmount
        </button>
      </div>
    </div>
  );
}
