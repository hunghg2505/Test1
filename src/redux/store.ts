import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import walletUserListReducer from "../features/walletUser/state/walletUserListSlice";
import walletUserProfileReducer from "../features/walletUser/state/walletUserProfileSlice";
import forgetMeReducer from "../features/walletUser/state/forgetMeSlice";
import nftListReducer from "../features/walletUser/state/nftListSlice";
import userCoinBalanceReducer from "features/walletUser/state/userCoinBalanceSlice";
import userTransactionReducer from "features/walletUser/state/userTransactionSlice";
import activityLogReducer from "../features/activityLog/state/activityLogSlice";
import walletUserVoucherReducer from "features/walletUser/state/walletUserVoucherSlice";

export const store = configureStore({
  reducer: {
    walletUserList: walletUserListReducer,
    walletUserProfile: walletUserProfileReducer,
    walletUserVoucherList: walletUserVoucherReducer,
    forgetMe: forgetMeReducer,
    nftList: nftListReducer,
    userCoinBalance: userCoinBalanceReducer,
    userTransaction: userTransactionReducer,
    activityLog: activityLogReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
