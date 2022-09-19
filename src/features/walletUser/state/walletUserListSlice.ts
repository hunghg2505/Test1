import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ProfilesParams,
  WalletUser,
  WalletUserListState,
} from "../model/walletUserList";
import { defaultInitialState } from "../../../redux/constant";
import { Status } from "../../../redux/enum";
import { RootState } from "../../../redux/store";
import MainAPI from "../../../apiConfig/MainAPI";
import { SearchType } from "../enums/Search";
import { phoneNumberURIEncodedWithThaiCountryCode } from "utils/phoneNumberFormatter";

export const initialState: WalletUserListState = {
  ...defaultInitialState,
  walletUserList: null,
  total: 0,
};

export const fetchAsyncWalletUserList = createAsyncThunk(
  "walletUserList/fetchAsyncWalletUserList",
  async (
    { searchValue, searchType, limit, page }: ProfilesParams,
    { rejectWithValue }
  ) => {
    try {
      let params = `?limit=${limit}&skip=${limit * page}`;
      if (searchValue) {
        if (searchType === SearchType.ABC_PROFILE_ID) {
          params = `/${searchValue}`;
        } else if (searchType === SearchType.MOBILE_NUMBER) {
          params = params + `&${searchType}=${phoneNumberURIEncodedWithThaiCountryCode(searchValue)}`;
        } else if (searchType) {
          params = params + `&${searchType}=${searchValue}`;
        }
      }
      const response = await MainAPI.get(`profiles${params}`);

      if (searchValue && searchType === SearchType.ABC_PROFILE_ID) {
        return {
          items: [response.data],
          total: 1,
        };
      }
      return response.data;
    } catch (error: any) {
      if (error.response.status === 400 || error.response.status === 404) {
        return {
          items: [],
          total: 0,
        };
      }
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
);

export const walletUserListSlice = createSlice({
  name: "walletUserList",
  initialState,
  reducers: {
    resetWalletUserList: (state) => {
      state.walletUserList = null;
      state.status = Status.INITIAL;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncWalletUserList.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncWalletUserList.fulfilled, (state, action) => {
        state.status = Status.LOADED;
        state.walletUserList = action.payload?.items as WalletUser[];
        state.total = action.payload?.total;
      })
      .addCase(fetchAsyncWalletUserList.rejected, (state) => {
        state.status = Status.ERROR;
      });
  },
});

export const { resetWalletUserList } = walletUserListSlice.actions;

export const selectWalletUserList = (state: RootState) => state.walletUserList;

export default walletUserListSlice.reducer;
