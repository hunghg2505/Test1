import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MainAPI from "apiConfig/MainAPI";
import { defaultInitialState } from "redux/constant";
import { Status } from "redux/enum";
import { RootState } from "redux/store";
import {UserVoucher, UserVoucherListState, UserVoucherParams} from '../model/walletUserVoucher'

export const initialState: UserVoucherListState = {
  ...defaultInitialState,
  walletUserVoucherList: null
}

export const fetchAsyncWalletUserVoucher = createAsyncThunk(
  "walletUserVoucherList/fetchAsyncWalletUserVoucher",
  async (
    { profileID }: UserVoucherParams, { rejectWithValue }
  ) => {
    try {
      const response = await MainAPI.get('/wallet-vouchers-service/v1/vouchers', {
        params: {
          profileID
        }
      })
      return response.data.items
    } catch (error: any) {
      console.error(error)
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data
      })
    }
  }
)

export const walletUserVoucherSlice = createSlice({
  name: 'walletUserVoucher',
  initialState,
  reducers: {
    resetWalletUserVoucher: (state) => {
      state.status = Status.INITIAL
      state.errorMessage = null
      state.walletUserVoucherList = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncWalletUserVoucher.pending, (state) => {
        state.status = Status.LOADING
      })
      .addCase(fetchAsyncWalletUserVoucher.fulfilled, (state, action) => {
        state.status = Status.LOADED
        state.walletUserVoucherList = action.payload as UserVoucher[]
      })
      .addCase(fetchAsyncWalletUserVoucher.rejected, (state, {payload}) => {
        state.status = Status.ERROR
        state.errorMessage = payload + ''
      })
  }
})

export const {resetWalletUserVoucher} = walletUserVoucherSlice.actions
export const selectWalletUserVoucherList = (state: RootState) => state.walletUserVoucherList
export default walletUserVoucherSlice.reducer