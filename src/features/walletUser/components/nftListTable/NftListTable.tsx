import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchAsyncNftList, selectNftList } from "features/walletUser/state/nftListSlice";
import { Status } from "redux/enum";
import GenericErrorImg from "assets/images/GenericErrorImg.svg";

type NftListTableType = {
  id: string;
  tokenID: string;
  nftName: string;
  thumbnail: string;
};

function createData(id: string, tokenID: string, nftName: string, thumbnail: string): NftListTableType {
  return { id, tokenID, nftName, thumbnail };
}

const NftListTable = ({ id }: { id: string }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { nft, status: nftListStatus } = useAppSelector(selectNftList);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchAsyncNftList(id));
  }, [dispatch, id]);

  const getRows = (): NftListTableType[] => {
    if (!nft) {
      return [] as NftListTableType[];
    }
    let tokenList = [] as NftListTableType[];
    nft.collections.forEach(collection => {
      collection.tokens.forEach(token => {
        tokenList = [
          ...tokenList,
          createData(
            `${collection.address}_${token.tokenID}`,
            token.tokenID,
            token.metadata.name,
            token.metadata.image,
          ),
        ];
      });
    });
    return tokenList;
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
  };

  if ((nftListStatus === Status.LOADED && !nft?.collections?.length) || nftListStatus === Status.ERROR) {
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
      {nftListStatus === Status.LOADING && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {nftListStatus === Status.LOADED && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow id="tbl_header_row">
                  <TableCell>{t("nftListTable.NFT NAME")}</TableCell>
                  <TableCell>{t("nftListTable.THUMBNAIL")}</TableCell>
                  <TableCell>{t("nftListTable.TOKEN ID")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRows()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: NftListTableType) => (
                    <TableRow
                      key={row.id}
                      id={`tbl_row_${row.id}`}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{row.nftName}</TableCell>
                      <TableCell>
                        <Box
                          alt="NFT image"
                          component="img"
                          src={row.thumbnail}
                          sx={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                          }}
                          onError={({ currentTarget }: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            currentTarget.onerror = null;
                            currentTarget.src = GenericErrorImg;
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.tokenID}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={nft?.totalToken || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={`${t("Rows per page")}:`}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
};

export default NftListTable;
