import { createSlice } from "@reduxjs/toolkit";
let initialState = { counter: 0, userName: "" };
let counterSlice = createSlice({
  name: "counterSlice",
  initialState,
  reducers: {
    increase: (state, actions) => {
      state.counter += 1;
    },
    decrease: (state) => {
      state.counter -= 1;
    },
    increaseByAmount: (state, actions) => {
      state.counter += actions.payload;
    },
  },
});
export let counterReducer = counterSlice.reducer;

export let { increase, decrease, increaseByAmount } = counterSlice.actions;
