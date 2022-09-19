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
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../redux/hooks";
import { selectWalletUserList } from "../../state/walletUserListSlice";
import { fullnameFormatterWithLang } from "../../../../utils/fullnameFormatter";

type UserTableType = {
  id: number;
  name: string;
  mobileNo: string;
  abcChainAccount: string;
  deactivatedAt: string;
};

function createData(
  id: number,
  name: string,
  mobileNo: string,
  abcChainAccount: string,
  deactivatedAt: string,
): UserTableType {
  return { id, name, mobileNo, abcChainAccount, deactivatedAt };
}

type UserTableProps = {
  page: number;
  rowsPerPage: number;
  onChangePage: (page: number, rowsPerPage: number) => void;
  onClickUserInfo: (id: number) => void;
  onClickAbcCoin: (id: number) => void;
  onClickVoucher: (id: number) => void;
  onClickNft: (id: number) => void;
  onClickActivityLog: (id: number) => void;
};

const UserTable = ({
  page,
  rowsPerPage,
  onChangePage,
  onClickUserInfo,
  onClickAbcCoin,
  onClickVoucher,
  onClickNft,
  onClickActivityLog,
}: UserTableProps) => {
  const { t, i18n } = useTranslation();
  const walletUserListState = useAppSelector(selectWalletUserList);

  const getRows = (): UserTableType[] => {
    if (!walletUserListState.walletUserList) {
      return [] as UserTableType[];
    }
    return walletUserListState.walletUserList.map(item => {
      const fullname = fullnameFormatterWithLang({
        firstNameEN: item.firstNameEN,
        middleNameEN: item.middleNameEN,
        lastNameEN: item.lastNameEN,
        firstNameTH: item.firstNameTH,
        middleNameTH: item.middleNameTH,
        lastNameTH: item.lastNameTH,
        lang: i18n.language,
      });
      return createData(item.id, fullname, item.mobileNumber, item.abcChainAccount, item.deactivatedAt);
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    onChangePage(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onChangePage(0, newRowsPerPage);
  };

  if (!walletUserListState.walletUserList?.length) {
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
          {t("Sorry, no matching records found")}
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
              <TableCell>{t("userListTable.ABC ID")}</TableCell>
              <TableCell>{t("userListTable.NAME")}</TableCell>
              <TableCell>{t("userListTable.MOBILE NO.")}</TableCell>
              <TableCell>{t("userListTable.ABC Wallet Address")}</TableCell>
              <TableCell>{t("userListTable.ACCOUNT STATUS")}</TableCell>
              <TableCell sx={{ minWidth: "350px" }}>...</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRows().map((row: UserTableType) => (
              <TableRow
                key={row.id}
                id={`tbl_row_${row.id}`}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.mobileNo}</TableCell>
                <TableCell>{row.abcChainAccount}</TableCell>
                <TableCell>
                  {row.deactivatedAt ? (
                    <Chip label={"Inactive"} />
                  ) : (
                    <Chip
                      label={"Active"}
                      sx={{
                        backgroundColor: "customColor.green.main",
                        color: "customColor.green.contrastText",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <>
                    <Typography
                      id={`btn_userInfo_${row?.id}`}
                      variant="body2"
                      component="span"
                      onClick={() => onClickUserInfo(row?.id)}
                      sx={{
                        color: "customColor.blue.accent2",
                        cursor: "pointer",
                      }}
                    >
                      {t("User info")}
                    </Typography>
                    <Typography variant="body2" component="span">
                      {" | "}
                    </Typography>
                    <Typography
                      id={`btn_abcCoin_${row?.id}`}
                      variant="body2"
                      component="span"
                      onClick={() => onClickAbcCoin(row?.id)}
                      sx={{
                        color: "customColor.blue.accent2",
                        cursor: "pointer",
                      }}
                    >
                      {t("ABC Coin")}
                    </Typography>
                    <Typography variant="body2" component="span">
                      {" | "}
                    </Typography>
                    <Typography
                      id={`btn_voucher_${row?.id}`}
                      variant="body2"
                      component="span"
                      onClick={() => onClickVoucher(row?.id)}
                      sx={{
                        color: "customColor.blue.accent2",
                        cursor: "pointer",
                      }}
                    >
                      {t("Voucher")}
                    </Typography>
                    <Typography variant="body2" component="span">
                      {" | "}
                    </Typography>
                    <Typography
                      id={`btn_nft_${row?.id}`}
                      variant="body2"
                      component="span"
                      onClick={() => onClickNft(row?.id)}
                      sx={{
                        color: "customColor.blue.accent2",
                        cursor: "pointer",
                      }}
                    >
                      {t("NFT")}
                    </Typography>
                    <Typography variant="body2" component="span">
                      {" | "}
                    </Typography>
                    <Typography
                      id={`btn_activityLog_${row?.id}`}
                      variant="body2"
                      component="span"
                      onClick={() => onClickActivityLog(row?.id)}
                      sx={{
                        color: "customColor.blue.accent2",
                        cursor: "pointer",
                      }}
                    >
                      {t("Activity log")}
                    </Typography>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={walletUserListState.total}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage={`${t("Rows per page")}:`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default UserTable;
