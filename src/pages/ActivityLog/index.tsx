import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import MainLayout from "../../layouts/MainLayout";
import { Status } from "../../redux/enum";
import { useTranslation } from "react-i18next";
import SearchActivityLog from "features/activityLog/components/searchActivityLog/SearchActivityLog";
import { SearchActivityLogInput } from "features/activityLog/model/activityLog";
import ActivityLogTable from "features/activityLog/components/activityLogTable/ActivityLogTable";
import {
  fetchAsyncActivityLog,
  resetActivityLog,
  selectActivityLog,
} from "features/activityLog/state/activityLogSlice";

const defaultRowsPerPage = 10;

function ActivityLog() {
  const { t } = useTranslation();
  const [searchProfileIDParam, setSearchProfileIDParam] = useState<string>("");
  const [searchStartDateParam, setSearchStartDateParam] = useState<string>("");
  const [searchEndDateParam, setSearchEndDateParam] = useState<string>("");
  const dispatch = useAppDispatch();
  const { status: activityLogStatus, nextToken } = useAppSelector(selectActivityLog);
  const [tablePage, setTablePage] = useState(0);
  const [rowsTablePerPage, setTableRowsPerPage] = useState(defaultRowsPerPage);
  const [maxFetchPage, setMaxFetchPage] = useState(0);

  useEffect(() => {
    return () => {
      dispatch(resetActivityLog());
    };
  }, [dispatch]);

  const dispatchActivityLog = ({ profileId, startDate, endDate, limit, nextToken }: SearchActivityLogInput) => {
    dispatch(fetchAsyncActivityLog({
      profileId,
      startDate,
      endDate,
      limit,
      nextToken
    }));
  };

  const handleOnClickSearch = ({ profileId, startDate, endDate }: SearchActivityLogInput) => {
    setSearchProfileIDParam(profileId);
    setSearchStartDateParam(startDate);
    setSearchEndDateParam(endDate);
    setTablePage(0);
    setMaxFetchPage(0);
    dispatch(resetActivityLog());
    setTableRowsPerPage(rowsTablePerPage);
    dispatchActivityLog({
      profileId,
      startDate,
      endDate,
      limit: rowsTablePerPage,
      nextToken: null,
    });
  };

  const handleOnChangePage = (page: number, rowsPerPage: number) => {
    setTablePage(page);

    if (page <= maxFetchPage && rowsTablePerPage === rowsPerPage)
      return
    
    if (rowsTablePerPage !== rowsPerPage) {
      setMaxFetchPage(0);
      dispatch(resetActivityLog());
    } else
      setMaxFetchPage(page);
    
    setTableRowsPerPage(rowsPerPage);
    dispatchActivityLog({
      profileId: searchProfileIDParam,
      startDate: searchStartDateParam,
      endDate: searchEndDateParam,
      limit: rowsPerPage,
      nextToken: page === 0 ? null : nextToken,
    });
  };

  return (
    <MainLayout pageTitle="Wallet User">
      <Box sx={{ mt: "63px" }}>
        <Typography id="lbl_title_searchWallerUser" variant="h6">
          {t("Search Activity Logs")}
        </Typography>
        <Box sx={{ mt: "24px", mb: "40px" }}>
          <SearchActivityLog profileId={searchProfileIDParam} onClickSearch={handleOnClickSearch} />
        </Box>
        <Box>
          {activityLogStatus === Status.LOADING && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {activityLogStatus === Status.LOADED && (
            <ActivityLogTable page={tablePage} rowsPerPage={rowsTablePerPage} onChangePage={handleOnChangePage} />
          )}
        </Box>
      </Box>
    </MainLayout>
  );
}

export default ActivityLog;
