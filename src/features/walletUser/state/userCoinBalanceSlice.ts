import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MainAPI from "apiConfig/MainAPI";
import { defaultInitialState } from "redux/constant";
import { Status } from "redux/enum";
import { RootState } from "redux/store";
import { UserCoinBalanceParams, UserCoinBalanceState } from "../model/userCoinBalance";

export const initialState: UserCoinBalanceState = {
  ...defaultInitialState,
  coinBalance: null
}

export const fetchAsyncUserCoinBalance = createAsyncThunk(
  "userCoinBalance/fetchAsyncUserCoinBalance",
  async ({abcChainAccount}: UserCoinBalanceParams, {rejectWithValue}) => {
    try {
      const response = await MainAPI.get(`/abc-token/balances/${abcChainAccount}`)
      return response.data
    } catch (error: any) {
      console.error(error)
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
)

export const userCoinBalanceSlice = createSlice({
  name: 'userCoinBalance',
  initialState,
  reducers: {
    resetUserCoinBalance: (state) => {
      state.coinBalance = null
      state.errorMessage = null
      state.status = Status.INITIAL
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncUserCoinBalance.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncUserCoinBalance.fulfilled, (state, action) => {
        state.status = Status.LOADED
        state.coinBalance = action.payload
      })
      .addCase(fetchAsyncUserCoinBalance.rejected, (state) => {
        state.status = Status.ERROR
      })
  }
})

export const {resetUserCoinBalance} = userCoinBalanceSlice.actions

export const selectUserCoinBalance = (state: RootState) => state.userCoinBalance

export default userCoinBalanceSlice.reducer