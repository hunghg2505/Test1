import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ForgetMeState } from "../model/forgetMe";
import { defaultInitialState } from "../../../redux/constant";
import { Status } from "../../../redux/enum";
import { RootState } from "../../../redux/store";
import MainAPI from "../../../apiConfig/MainAPI";

export const initialState: ForgetMeState = {
  ...defaultInitialState,
  forgetMe: null,
};

export const fetchAsyncForgetMe = createAsyncThunk(
  "forgetMe/fetchAsyncForgetMe",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await MainAPI.delete(`profiles/${id}?hard=true`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
);

export const forgetMeSlice = createSlice({
  name: "forgetMe",
  initialState,
  reducers: {
    resetForgetMe: (state) => {
      state.forgetMe = null;
      state.status = Status.INITIAL;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncForgetMe.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncForgetMe.fulfilled, (state, action) => {
        state.status = Status.LOADED;
        state.forgetMe = "Success";
      })
      .addCase(fetchAsyncForgetMe.rejected, (state) => {
        state.status = Status.ERROR;
      });
  },
});

export const { resetForgetMe } = forgetMeSlice.actions;

export const selectForgetMe = (state: RootState) => state.forgetMe;

export default forgetMeSlice.reducer;
