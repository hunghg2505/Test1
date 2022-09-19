import { useState, useEffect } from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  fetchAsyncWalletUserList,
  resetWalletUserList,
  selectWalletUserList,
} from "../../features/walletUser/state/walletUserListSlice";
import MainLayout from "../../layouts/MainLayout";
import Search from "../../features/walletUser/components/search/Search";
import UserTable from "../../features/walletUser/components/userTable/UserTable";
import {
  ProfilesParams,
  SearchInput,
} from "../../features/walletUser/model/walletUserList";
import { Status } from "../../redux/enum";
import { useTranslation } from "react-i18next";
import { Tab } from "features/walletUser/enums/Tab";

interface SnackBarState {
  open: boolean;
  message: string;
}

const defaultRowsPerPage = 10;

function WalletUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locationState = useLocation().state as { isForgetMe: string };
  const dispatch = useAppDispatch();
  const walletUserListState = useAppSelector(selectWalletUserList);
  const [searchValueParam, setSearchValueParam] = useState<string>("");
  const [searchTypeParam, setSearchTypeParam] = useState<string>("");
  const [tablePage, setTablePage] = useState(0);
  const [rowsTablePerPage, setTableRowsPerPage] = useState(defaultRowsPerPage);
  const [searchInputError, setSearchInputError] = useState<string>("");

  const [snackBarState, setSnackBarState] = useState<SnackBarState>({
    open: false,
    message: "",
  });

  useEffect(() => {
    return () => {
      dispatch(resetWalletUserList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (locationState?.isForgetMe) {
      setSnackBarState({
        open: true,
        message: t("Successfully forget this user."),
      });
    }
  }, [locationState?.isForgetMe, t]);

  const handleCloseSnackBar = () => {
    setSnackBarState({
      open: false,
      message: "",
    });
  };

  const dispatchWalletUserList = ({
    searchValue,
    searchType,
    limit,
    page,
  }: ProfilesParams) => {
    dispatch(
      fetchAsyncWalletUserList({ searchValue, searchType, limit, page })
    );
  };

  const handleOnClickSearch = ({ searchValue, searchType }: SearchInput) => {
    setSearchInputError("");
    if (!searchValue) {
      setSearchInputError(t("Required fields must be filled in."));
      return;
    }
    setSearchValueParam(searchValue);
    setSearchTypeParam(searchType);
    setTablePage(0);
    setTableRowsPerPage(defaultRowsPerPage);
    dispatchWalletUserList({
      searchValue,
      searchType,
      limit: defaultRowsPerPage,
      page: 0,
    });
  };

  const handleOnClickReset = () => {
    setSearchInputError("");
  };

  const handleOnChangePage = (page: number, rowsPerPage: number) => {
    setTablePage(page);
    setTableRowsPerPage(rowsPerPage);
    dispatchWalletUserList({
      searchValue: searchValueParam,
      searchType: searchTypeParam,
      limit: rowsPerPage,
      page,
    });
  };

  const handleOnClickUserProfile = (id: number, tab: Tab) => {
    navigate({
      pathname: `/wallet-user-profile/${id}`,
      search: createSearchParams({ tab }).toString(),
    });
  };

  const handleOnClickActivityLog = (id: number) => {
    navigate({
      pathname: `/activity-log`,
      search: createSearchParams({ id: id.toString() }).toString(),
    });
  };

  return (
    <MainLayout pageTitle="Wallet User">
      <Box sx={{ mt: "63px" }}>
        <Typography id="lbl_title_searchWallerUser" variant="h6">
          {t("Search Wallet User")}
        </Typography>
        <Box sx={{ mt: "24px", mb: "40px" }}>
          <Search
            errorMessage={searchInputError}
            onClickSearch={handleOnClickSearch}
            onClickReset={handleOnClickReset}
          />
        </Box>
        <Box>
          {walletUserListState.status === Status.LOADING && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {walletUserListState.status === Status.LOADED && (
            <UserTable
              page={tablePage}
              rowsPerPage={rowsTablePerPage}
              onChangePage={handleOnChangePage}
              onClickUserInfo={(id) =>
                handleOnClickUserProfile(id, Tab.USER_INFO)
              }
              onClickAbcCoin={(id) =>
                handleOnClickUserProfile(id, Tab.ABC_COIN)
              }
              onClickVoucher={(id) => handleOnClickUserProfile(id, Tab.VOUCHER)}
              onClickNft={(id) => handleOnClickUserProfile(id, Tab.NFT)}
              onClickActivityLog={(id) => handleOnClickActivityLog(id)}
            />
          )}
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackBarState.open}
        onClose={handleCloseSnackBar}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackBarState.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}

export default WalletUser;
