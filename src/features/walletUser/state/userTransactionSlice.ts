import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MainAPI from "apiConfig/MainAPI";
import { defaultInitialState } from "redux/constant";
import { Status } from "redux/enum";
import { RootState } from "redux/store";
import { UserTransactionParams, UserTransactionState } from "../model/userTransaction";

export const initialState: UserTransactionState = {
  ...defaultInitialState,
  transactionList: null
}

export const fetchAsyncUserTransaction = createAsyncThunk(
  "userTransaction/fetchAsyncUserTransaction",
  async ({profileID, skip, limit}: UserTransactionParams, {rejectWithValue}) => {
    try {
      const response = await MainAPI.get('/abc-coin-transactions/v1/transactions', {
        params: {
          profileID, 
          skip, 
          limit
        }
      })
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

export const userTransactionSlice = createSlice({
  name: 'userTransaction',
  initialState,
  reducers: {
    resetUserTransaction: (state) => {
      state.errorMessage = null
      state.status = Status.INITIAL
      state.transactionList = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncUserTransaction.pending, (state) => {
        state.status = Status.LOADING
      })
      .addCase(fetchAsyncUserTransaction.fulfilled, (state, action) => {
        state.status = Status.LOADED
        state.transactionList = action.payload
      })
      .addCase(fetchAsyncUserTransaction.rejected, (state) => {
        state.status = Status.ERROR
      })
  }
})

export const {resetUserTransaction} = userTransactionSlice.actions

export const selectUserTransaction = (state: RootState) => state.userTransaction

export default userTransactionSlice.reducer