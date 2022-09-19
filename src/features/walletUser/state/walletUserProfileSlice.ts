import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  WalletUserProfile,
  WalletUserProfileState,
} from "../model/walletUserProfile";
import { defaultInitialState } from "../../../redux/constant";
import { Status } from "../../../redux/enum";
import { RootState } from "../../../redux/store";
import MainAPI from "../../../apiConfig/MainAPI";

export const initialState: WalletUserProfileState = {
  ...defaultInitialState,
  walletUserProfile: null,
};

export const fetchAsyncWalletUserProfile = createAsyncThunk(
  "walletUserProfile/fetchAsyncWalletUserProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await MainAPI.get(`profiles/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        status: error.response.status,
        data: error.response.data,
      });
    }
  }
);

export const walletUserProfileSlice = createSlice({
  name: "walletUserProfile",
  initialState,
  reducers: {
    resetWalletUserProfile: (state) => {
      state.walletUserProfile = null;
      state.status = Status.INITIAL;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncWalletUserProfile.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchAsyncWalletUserProfile.fulfilled, (state, action) => {
        state.status = Status.LOADED;
        state.walletUserProfile = action.payload as WalletUserProfile;
      })
      .addCase(fetchAsyncWalletUserProfile.rejected, (state) => {
        state.status = Status.ERROR;
      });
  },
});

export const { resetWalletUserProfile } = walletUserProfileSlice.actions;

export const selectWalletUserProfile = (state: RootState) =>
  state.walletUserProfile;

export default walletUserProfileSlice.reducer;
