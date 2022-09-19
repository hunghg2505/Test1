import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../redux/hooks";
import { selectWalletUserProfile } from "../../state/walletUserProfileSlice";

type UserProfileTableType = {
  title: string;
  value: string;
};

function createData(title: string, value: string): UserProfileTableType {
  return {
    title,
    value,
  };
}

const UserProfileTable = () => {
  const { t } = useTranslation();
  const { walletUserProfile } = useAppSelector(selectWalletUserProfile);

  const rows = [
    createData(t("Mobile No."), walletUserProfile?.mobileNumber || "-"),
    createData(t("Citizen ID"), walletUserProfile?.thaiID || "-"),
    createData(t("True money ID"), walletUserProfile?.tmwID || "-"),
    createData(t("Date of birth"), walletUserProfile?.dateOfBirth || "-"),
    createData(t("Nationality"), walletUserProfile?.nationality || "-"),
    createData(t("IAL level"), walletUserProfile?.ialLevel || "-"),
    createData(t("KYC level"), walletUserProfile?.kycLevel || "-"),
  ];

  return (
    <Paper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ width: { xs: "120px", sm: "180px", md: "240px" } }}
              >
                {t("FIELD")}
              </TableCell>
              <TableCell>{t("VALUE")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.title}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserProfileTable;
