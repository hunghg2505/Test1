import { ReactNode } from "react";
import { Paper, Typography, Box, Grid, Divider, Chip } from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { fullnameFormatter } from "utils/fullnameFormatter";
import { phoneNumberFormatter } from "utils/phoneNumberFormatter";
import { useAppSelector } from "../../../../redux/hooks";
import { selectWalletUserProfile } from "../../state/walletUserProfileSlice";

const getData = (data: string | number | undefined): string | number => {
  return data || "-";
};

const getDate = (date: string | undefined, withTime = true): string => {
  if (date) {
    return dayjs(date).format(withTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY");
  }
  return "-";
};

const getAddress = (
  address?: string,
  district?: string,
  subdistrict?: string,
  province?: string,
  postalCode?: string
): string => {
  return (
    [address, district, subdistrict, province, postalCode]
      .filter(Boolean)
      .join(" ") || "-"
  );
};

const getNationalData = (
  thaiId: string | undefined,
  passportId: string | undefined,
  nationality: string | undefined
): string => {
  let nationalId = thaiId || passportId || "-";
  if (nationalId === "-" && !nationality) {
    return "-";
  }
  return `${nationalId} | ${nationality || "-"}`;
};

const UserProfileDetail = () => {
  const { t } = useTranslation();
  const { walletUserProfile } = useAppSelector(selectWalletUserProfile);

  const ActiveChipItem = () => {
    return (
      <Box>
        <Box sx={{ mb: "8px" }}>
          <Typography id={"lbl_title_userStatus"} variant="body1">{`${t(
            "User status / Reason"
          )}:`}</Typography>
        </Box>
        <Box>
          {walletUserProfile?.deactivatedAt ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip
                id={"chip_userStatus"}
                label={"Inactive"}
                sx={{
                  height: "24px",
                  mr: "14px",
                }}
              />
              <Typography id={"lbl_deactivationReason"} variant="subtitle1">
                {walletUserProfile?.deactivationReason || "-"}
              </Typography>
            </Box>
          ) : (
            <Chip
              label={"Active"}
              sx={{
                height: "24px",
                backgroundColor: "customColor.green.main",
                color: "customColor.green.contrastText",
              }}
            />
          )}
        </Box>
      </Box>
    );
  };

  const DataItem = ({
    id,
    title,
    detail,
  }: {
    id: string;
    title: string;
    detail: string | number;
  }) => {
    return (
      <Box>
        <Box>
          <Typography id={`lbl_title_${id}`} variant="body1">
            {title}
          </Typography>
        </Box>
        <Box>
          <Typography id={`lbl_detail_${id}`} variant="subtitle1">
            {detail}
          </Typography>
        </Box>
      </Box>
    );
  };

  const RowItem = ({
    leftChildren,
    rightChildren,
  }: {
    leftChildren: ReactNode;
    rightChildren: ReactNode;
  }) => {
    return (
      <Box>
        <Box
          sx={{
            p: "16px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {leftChildren}
            </Grid>

            <Grid item xs={12} md={6}>
              {rightChildren}
            </Grid>
          </Grid>
        </Box>
        <Divider light sx={{ mx: "16px" }} />
      </Box>
    );
  };

  return (
    <Paper data-testid="user-profile-detail">
      <RowItem
        leftChildren={
          <DataItem
            id="nameTH"
            title={`${t("Name (TH)")}:`}
            detail={fullnameFormatter({
              firstName: walletUserProfile?.firstNameTH,
              middleName: walletUserProfile?.middleNameTH,
              lastName: walletUserProfile?.lastNameTH,
            })}
          />
        }
        rightChildren={
          <DataItem
            id="nameEN"
            title={`${t("Name (EN)")}:`}
            detail={fullnameFormatter({
              firstName: walletUserProfile?.firstNameEN,
              middleName: walletUserProfile?.middleNameEN,
              lastName: walletUserProfile?.lastNameEN,
            })}
          />
        }
      />
      <RowItem
        leftChildren={
          <DataItem
            id="abcId"
            title={`${t("ABC ID")}:`}
            detail={getData(walletUserProfile?.id)}
          />
        }
        rightChildren={<ActiveChipItem />}
      />
      <RowItem
        leftChildren={
          <DataItem
            id="mobileNo"
            title={`${t("Mobile no.")}:`}
            detail={getData(
              phoneNumberFormatter(walletUserProfile?.mobileNumber)
            )}
          />
        }
        rightChildren={
          <DataItem
            id="tmnId"
            title={`${t("TMN ID")}:`}
            detail={getData(walletUserProfile?.tmwID)}
          />
        }
      />
      <RowItem
        leftChildren={
          <DataItem
            id="abcWalletAddress"
            title={`${t("ABC Wallet Address")}:`}
            detail={getData(walletUserProfile?.abcChainAccount)}
          />
        }
        rightChildren={
          <DataItem
            id="abcWalletIndex"
            title={`${t("ABC Wallet Index")}:`}
            detail={getData(walletUserProfile?.walletIndex)}
          />
        }
      />
      <RowItem
        leftChildren={
          <DataItem
            id="dateOfBirth"
            title={`${t("Date of Birth")}:`}
            detail={getDate(walletUserProfile?.dateOfBirth, false)}
          />
        }
        rightChildren={
          <DataItem
            id="nationalId"
            title={`${t("National ID")}:`}
            detail={getNationalData(
              walletUserProfile?.thaiID,
              walletUserProfile?.passportNumber,
              walletUserProfile?.nationality
            )}
          />
        }
      />
      <RowItem
        leftChildren={
          <DataItem
            id="address"
            title={`${t("Address")}:`}
            detail={getAddress(
              walletUserProfile?.address,
              walletUserProfile?.district,
              walletUserProfile?.subDistrict,
              walletUserProfile?.province,
              walletUserProfile?.postalCode
            )}
          />
        }
        rightChildren={
          <DataItem
            id="contactEmail"
            title={`${t("Contact email")}:`}
            detail={getData(walletUserProfile?.email)}
          />
        }
      />
      <RowItem
        leftChildren={
          <DataItem
            id="createdAt"
            title={`${t("Created At")}:`}
            detail={getDate(walletUserProfile?.createdAt)}
          />
        }
        rightChildren={
          <DataItem
            id="updatedAt"
            title={`${t("Updated At")}:`}
            detail={getDate(walletUserProfile?.updatedAt)}
          />
        }
      />
    </Paper>
  );
};

export default UserProfileDetail;
