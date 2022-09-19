import { useState, useEffect } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import MainLayout from "../../layouts/MainLayout";
import {
  fetchAsyncWalletUserProfile,
  resetWalletUserProfile,
  selectWalletUserProfile,
} from "../../features/walletUser/state/walletUserProfileSlice";
import { Status } from "../../redux/enum";
import { fullnameFormatterWithLang } from "../../utils/fullnameFormatter";
import UserProfileDetail from "features/walletUser/components/userProfileDetail/UserProfileDetail";
import { Tab } from "features/walletUser/enums/Tab";
import NftListTable from "features/walletUser/components/nftListTable/NftListTable";
import UserVoucherTable from "features/walletUser/components/userVoucherTable/UserVoucherTable";
import UserCoinBalance from "features/walletUser/components/userCoinBalance/UserCoinBalance";
import UserTransactionTable from "features/walletUser/components/userTransactionTable/UserTransactionTable";

function WalletUserProfile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { walletUserProfile, status: walletUserProfileStatus } = useAppSelector(selectWalletUserProfile);
  const [currentTab, setCurrentTab] = useState(Tab.USER_INFO);

  useEffect(() => {
    return () => {
      dispatch(resetWalletUserProfile());
    };
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAsyncWalletUserProfile(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (searchParams.get("tab")) {
      setCurrentTab(searchParams.get("tab") as Tab);
    }
  }, [searchParams]);

  const isActiveTab = (tab: Tab) => {
    return tab === currentTab;
  };

  const handleChangeTab = (tab: Tab) => {
    navigate({
      pathname: "",
      search: createSearchParams({
        tab,
      }).toString(),
    });
  };

  const UserDetail = () => {
    return (
      <Paper sx={{ p: "16px 16px 16px 8px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: "8px",
          }}
        >
          <Box sx={{ width: "40px", height: "40px" }}>
            <Avatar id="img_avatar">{walletUserProfile?.firstNameEN?.charAt(0)}</Avatar>
          </Box>
          <Box sx={{ ml: "16px" }}>
            <Typography id="lbl_fullname_userDetail" variant="body1">
              {fullnameFormatterWithLang({
                firstNameEN: walletUserProfile?.firstNameEN,
                middleNameEN: walletUserProfile?.middleNameEN,
                lastNameEN: walletUserProfile?.lastNameEN,
                firstNameTH: walletUserProfile?.firstNameTH,
                middleNameTH: walletUserProfile?.middleNameTH,
                lastNameTH: walletUserProfile?.lastNameTH,
                lang: i18n.language,
              })}
            </Typography>
            <Typography id="lbl_abcWalletAddress_userDetail" variant="body2">
              {walletUserProfile?.abcChainAccount}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  };

  const DetailTab = () => {
    return (
      <>
        <Typography
          id="tab_userInfo"
          variant="body2"
          component="span"
          onClick={() => handleChangeTab(Tab.USER_INFO)}
          sx={{
            color: isActiveTab(Tab.USER_INFO) ? "text.primary" : "customColor.blue.accent2",
            cursor: "pointer",
          }}
        >
          {t("User info")}
        </Typography>
        <Typography variant="body2" component="span">
          {" | "}
        </Typography>
        <Typography
          id="tab_abcCoin"
          variant="body2"
          component="span"
          onClick={() => handleChangeTab(Tab.ABC_COIN)}
          sx={{
            color: isActiveTab(Tab.ABC_COIN) ? "text.primary" : "customColor.blue.accent2",
            cursor: "pointer",
          }}
        >
          {t("ABC Coin")}
        </Typography>
        <Typography variant="body2" component="span">
          {" | "}
        </Typography>
        <Typography
          id="tab_voucher"
          variant="body2"
          component="span"
          onClick={() => handleChangeTab(Tab.VOUCHER)}
          sx={{
            color: isActiveTab(Tab.VOUCHER) ? "text.primary" : "customColor.blue.accent2",
            cursor: "pointer",
          }}
        >
          {t("Voucher")}
        </Typography>
        <Typography variant="body2" component="span">
          {" | "}
        </Typography>
        <Typography
          id="tab_nft"
          variant="body2"
          component="span"
          onClick={() => handleChangeTab(Tab.NFT)}
          sx={{
            color: isActiveTab(Tab.NFT) ? "text.primary" : "customColor.blue.accent2",
            cursor: "pointer",
          }}
        >
          {t("NFT")}
        </Typography>
        <Typography variant="body2" component="span">
          {" | "}
        </Typography>
        <Typography
          id="tab_activityLog"
          variant="body2"
          component="span"
          onClick={() => {
            navigate({
              pathname: "/activity-log",
              search: createSearchParams({
                id: id as string,
              }).toString(),
            });
          }}
          sx={{
            color: "customColor.blue.accent2",
            cursor: "pointer",
          }}
        >
          {t("Activity log")}
        </Typography>
      </>
    );
  };

  const renderCurrentTab = () => {
    if (currentTab === Tab.USER_INFO) {
      return (
        <Box>
          <UserProfileDetail />
        </Box>
      );
    } else if (currentTab === Tab.NFT) {
      return (
        <Box>
          <NftListTable id={id as string} />
        </Box>
      );
    } else if (currentTab === Tab.VOUCHER) {
      return (
        <Box>
          <UserVoucherTable />
        </Box>
      );
    } else if (currentTab === Tab.ABC_COIN) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <UserCoinBalance />
          <UserTransactionTable />
        </Box>
      );
    }
    return <Box></Box>;
  };

  const UserNotFound = () => {
    return (
      <Box sx={{ mt: "32px", mb: "24px" }}>
        <Typography variant="body1">{t("Wallet user profile not found")}</Typography>
      </Box>
    );
  };

  const InitialComp = () => {
    if (id) {
      return <div data-testid="wallet-user-detail-loading"></div>;
    }
    return UserNotFound();
  };

  const ErrorComp = () => {
    return <Box sx={{ m: "32px" }}>{t("Oops. Please try again later.")}</Box>;
  };

  const LoadedComp = () => {
    if (walletUserProfile) {
      return (
        <>
          <Box sx={{ mt: "32px", mb: "24px" }}>{UserDetail()}</Box>
          <Box sx={{ mb: "24px" }}>{DetailTab()}</Box>
          {renderCurrentTab()}
        </>
      );
    }
    return UserNotFound();
  };

  return (
    <MainLayout pageTitle="ABC Wallet User">
      <Box sx={{ mt: "32px", mb: "32px" }}>
        <Typography variant="h6">{t("ABC Wallet User")}</Typography>
        {(walletUserProfileStatus === Status.INITIAL || walletUserProfileStatus === Status.LOADING) && InitialComp()}
        {walletUserProfileStatus === Status.ERROR && ErrorComp()}
        {walletUserProfileStatus === Status.LOADED && LoadedComp()}
      </Box>
    </MainLayout>
  );
}

export default WalletUserProfile;
