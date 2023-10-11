import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
let initialState = { categories: [], loading: false, isError: null };
export let getCategories = createAsyncThunk(
  "categoriesSlice/getCategories",
  async () => {
    let { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/categories"
    );
    return data?.data;
  }
);
export let getSepcificCategories = createAsyncThunk(
  "categoriesSlice/getCategories",
  async (category_Id) => {
    let { data } = await axios.get(
      `https://ecommerce.routemisr.com/api/v1/categories/${category_Id}`
    );
    return data?.data;
  }
);
let categoriesSlice = createSlice({
  name: "categoriesSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    });
    builder.addCase(getCategories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.isError = action.error.message; // Set isError to the error message
      state.loading = false;
    });
  },
});

export let categoriesReducer = categoriesSlice.reducer;
