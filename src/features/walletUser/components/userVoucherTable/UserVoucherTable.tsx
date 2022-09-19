import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchAsyncWalletUserVoucher, resetWalletUserVoucher, selectWalletUserVoucherList } from 'features/walletUser/state/walletUserVoucherSlice';
import { selectWalletUserProfile } from 'features/walletUser/state/walletUserProfileSlice';
import { useEffectOnce, useUnmount } from 'react-use';
import { Status } from 'redux/enum';
import dayjs from "dayjs";
import { Box } from '@mui/system';

const UserVoucherTable = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const {
    walletUserVoucherList,
    status: walletUserVoucherStatus
  } = useAppSelector(selectWalletUserVoucherList)
  const {
    walletUserProfile
  } = useAppSelector(selectWalletUserProfile)
  

  useEffectOnce(() => {
    dispatch(fetchAsyncWalletUserVoucher({profileID: walletUserProfile?.id + ""}))
  })

  useUnmount(() => {
    dispatch(resetWalletUserVoucher())
  })

  if (walletUserVoucherStatus === Status.LOADING) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress id='progress' data-testid='progress' />
      </Box>
    )
  }

  return (
    <TableContainer
      component={Paper}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow id="tbl_header_row">
            <TableCell>{t("userVoucherTable.Purchased Date")}</TableCell>
            <TableCell>{t("userVoucherTable.Merchant")}</TableCell>
            <TableCell>{t("userVoucherTable.Deal Name")}</TableCell>
            <TableCell>{t("userVoucherTable.Voucher Code")}</TableCell>
            <TableCell>{t("userVoucherTable.Expiry Date")}</TableCell>
            <TableCell>{t("userVoucherTable.Transaction id")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            walletUserVoucherStatus === Status.LOADED && walletUserVoucherList
            ? walletUserVoucherList.map(({code, coinTransfer, deal, issuedAt}, index) => {
              return (
                <TableRow
                  key={`user-voucher-item-${code}`}
                  id={`tbl_row_${index}_${code}`}
                >
                  <TableCell>
                    { dayjs(issuedAt).format('YYYY/MM/DD HH:mm:ss') }
                  </TableCell>
                  <TableCell>
                    {deal.merchant.name}
                  </TableCell>
                  <TableCell>
                    {deal.title}
                  </TableCell>
                  <TableCell>
                    {code}
                  </TableCell>
                  <TableCell>
                    { dayjs(deal.endDateTime).format('YYYY/MM/DD') }
                  </TableCell>
                  <TableCell 
                    sx={{
                      width: '180px',
                      wordBreak: 'break-all'
                    }}>
                      {coinTransfer.transactionHash}
                  </TableCell>
                </TableRow>
              )
            })
            : null
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserVoucherTable