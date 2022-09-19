import React from "react";
import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { paletteLight } from "theme";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { selectWalletUserProfile } from "features/walletUser/state/walletUserProfileSlice";
import { Status } from "redux/enum";
import {
  fetchAsyncUserCoinBalance,
  resetUserCoinBalance,
  selectUserCoinBalance,
} from "features/walletUser/state/userCoinBalanceSlice";
import { useEffectOnce, useUnmount } from "react-use";
import { balanceFormatter } from "utils/balanceFormatter";

const UserCoinBalance = () => {
  const dispatch = useAppDispatch();
  const { walletUserProfile, status: walletUserProfileStatus } = useAppSelector(selectWalletUserProfile);
  const { coinBalance, status: userCoinBalanceStatus } = useAppSelector(selectUserCoinBalance);
  useEffectOnce(() => {
    if (walletUserProfile && walletUserProfileStatus === Status.LOADED) {
      dispatch(fetchAsyncUserCoinBalance({ abcChainAccount: walletUserProfile.abcChainAccount + "" }));
    }
  });

  useUnmount(() => {
    dispatch(resetUserCoinBalance());
  });

  return (
    <Box
      sx={{
        border: "1px solid #E1E1E1",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        width: "fit-content",
        padding: "24px",
        minWidth: "220px",
      }}
    >
      <Typography id="lbl_balance" data-testid="lbl_balance" variant="h4" fontWeight="500">
        {userCoinBalanceStatus === Status.LOADING ? (
          <Skeleton id="progress" data-testid="progress" variant="text" height={42} width="100%" animation="wave" />
        ) : (
          `${balanceFormatter(coinBalance?.balance || "0")} ABC`
        )}
      </Typography>
      <Typography variant="body1" color={paletteLight.customColor.grey.accent2}>
        Balance
      </Typography>
    </Box>
  );
};

export default UserCoinBalance;
