import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import {
  fetchAsyncUserTransaction,
  resetUserTransaction,
  selectUserTransaction,
} from "features/walletUser/state/userTransactionSlice";
import { selectWalletUserProfile } from "features/walletUser/state/walletUserProfileSlice";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Status } from "redux/enum";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { KIND_TYPE } from "../../model/userTransaction";
import dayjs from "dayjs";
import { useEffectOnce, useUnmount } from "react-use";

const CURRENCY = "ABC";

export const getTransactionDetail = (kind: string, currency = CURRENCY) => {
  if (kind === KIND_TYPE.voucher) {
    return {
      title: `Redeem ${currency}`,
      symbol: "-",
    };
  }
  if (kind === KIND_TYPE.airdrop) {
    return {
      title: `Receive ${currency} Airdrop`,
      symbol: "+",
    };
  }
  if (kind === KIND_TYPE.swap) {
    return {
      title: `Convert loyalty point to ${currency}`,
      symbol: "+",
    };
  }
  if (kind === KIND_TYPE.send) {
    return {
      title: `Send ${currency}`,
      symbol: "-",
    };
  }
  if (kind === KIND_TYPE.receive) {
    return {
      title: `Receive ${currency}`,
      symbol: "+",
    };
  }
  return {
    title: "",
    symbol: "",
  };
};

const UserTransactionTable = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { walletUserProfile, status: walletUserProfileStatus } = useAppSelector(selectWalletUserProfile);
  const { transactionList, status: userTransactionStatus } = useAppSelector(selectUserTransaction);

  const handleChangePage = (_: unknown, newPage: number) => {
    if (!walletUserProfile) {
      return;
    }
    setPage(newPage);
    dispatch(
      fetchAsyncUserTransaction({
        profileID: walletUserProfile.id + "",
        skip: newPage * rowsPerPage,
        limit: rowsPerPage,
      }),
    );
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!walletUserProfile) {
      return;
    }
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    // if change the row perpage we should bring user back to first page
    dispatch(fetchAsyncUserTransaction({ profileID: walletUserProfile.id + "", skip: 0, limit: newRowsPerPage }));
  };

  useEffectOnce(() => {
    if (walletUserProfile && walletUserProfileStatus === Status.LOADED) {
      dispatch(fetchAsyncUserTransaction({ profileID: walletUserProfile.id + "", skip: 0, limit: rowsPerPage }));
    }
  });

  useUnmount(() => {
    dispatch(resetUserTransaction());
  });

  if (
    (userTransactionStatus === Status.LOADED && !transactionList?.items?.length) ||
    userTransactionStatus === Status.ERROR
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
        }}
      >
        <Typography variant="h6">{t("No available data")}</Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow id="tbl_header_row">
              <TableCell>{t("userTransactionTable.TRANSACTION AMOUNT")}</TableCell>
              <TableCell>{t("userTransactionTable.Date / TIME")}</TableCell>
              <TableCell>{t("userTransactionTable.TYPE")}</TableCell>
              <TableCell>{t("userTransactionTable.TRANSACTION ID")}</TableCell>
              <TableCell>{t("userTransactionTable.FROM")}</TableCell>
              <TableCell>{t("userTransactionTable.TO")}</TableCell>
              <TableCell>{t("userTransactionTable.POINT TYPE")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userTransactionStatus === Status.LOADED &&
              transactionList?.items?.map(({ amount, confirmedAt, from, to, kind, transactionHash, metadata }) => {
                const { title, symbol } = getTransactionDetail(kind, CURRENCY);
                return (
                  <TableRow key={transactionHash} id={`tbl_row_${transactionHash}`}>
                    <TableCell>{`${symbol} ${amount}`}</TableCell>
                    <TableCell>{dayjs(confirmedAt).format("YYYY/MM/DD HH:mm:ss")}</TableCell>
                    <TableCell>
                      {kind === KIND_TYPE.send || kind === KIND_TYPE.receive
                        ? t("userTransactionTable.Peer to peer transfer")
                        : title}
                    </TableCell>
                    <TableCell
                      sx={{
                        wordBreak: "break-all",
                      }}
                    >
                      {transactionHash}
                    </TableCell>
                    <TableCell
                      sx={{
                        wordBreak: "break-all",
                      }}
                    >
                      {from}
                    </TableCell>
                    <TableCell
                      sx={{
                        wordBreak: "break-all",
                      }}
                    >
                      {metadata?.mobileNumber || to}
                    </TableCell>
                    <TableCell>{kind === KIND_TYPE.swap && metadata?.from}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {userTransactionStatus === Status.LOADING && (
        <Skeleton id="progress" data-testid="progress" variant="text" height={42} width="100%" animation="wave" />
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={transactionList?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage={`${t("Rows per page")}:`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default UserTransactionTable;
