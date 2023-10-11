import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./counterSlice.js";
import { categoriesReducer } from "./categoriesSlice.js";

export let store = configureStore({
  reducer: {
    counter: counterReducer,
    categories: categoriesReducer,
  },
});
