import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../redux/hooks";
import { selectActivityLog } from "../../state/activityLogSlice";
import ActivityLogRow from "./ActivityLogRow";
import { Meta } from "features/activityLog/model/activityLog";

export type ActivityLogTableType = {
  dateTime: string;
  track: string;
  logCategory: string;
  logName: string;
  status: string;
  description: string;
  meta: Meta[] | null;
};

type ActivityLogTableProps = {
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number, rowsPerPage: number) => void;
};

const ActivityLogTable = ({ page, rowsPerPage, onChangePage }: ActivityLogTableProps) => {
  const { t } = useTranslation();
  const { activityLogs, nextToken, totalRows } = useAppSelector(selectActivityLog);

  const getRows = (): ActivityLogTableType[] => {
    if (!activityLogs) {
      return [] as ActivityLogTableType[];
    }
    return activityLogs.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(item => {
      return {
        dateTime: item.at,
        track: item.track,
        logCategory: item.log_category,
        logName: item.log_name,
        status: item.status,
        description: item.scenario,
        meta: item.meta,
      };
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onChangePage(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onChangePage(0, newRowsPerPage);
  };

  if (!activityLogs?.length) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "customColor.grey.accent2" }}>
          {t("No available data")}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow id="tbl_header_row">
              <TableCell>{t("activityLogTable.DATE / TIME")}</TableCell>
              <TableCell>{t("activityLogTable.TRACK")}</TableCell>
              <TableCell>{t("activityLogTable.LOG CATERGORY")}</TableCell>
              <TableCell>{t("activityLogTable.LOG NAME")}</TableCell>
              <TableCell>{t("activityLogTable.STATUS")}</TableCell>
              <TableCell>{t("activityLogTable.DESCRIPTION")}</TableCell>
              <TableCell sx={{ minWidth: "50px" }}>...</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRows().map((row: ActivityLogTableType) => (
              <ActivityLogRow key={row.dateTime} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage={`${t("Rows per page")}:`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ActivityLogTable;
