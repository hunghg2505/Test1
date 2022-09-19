import React, { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Button as MuiButton, Container, Typography, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

const menus = ["activity-log"];

const Button = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.customColor.blue.accent1,
  paddingLeft: "1rem",
  paddingRight: "1rem",
}));

const ActiveButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: theme.palette.customColor.blue.accent1,
  "&:hover": {
    backgroundColor: alpha(theme.palette.customColor.blue.accent1, 0.7),
  },
  color: "#ffffff",
  paddingLeft: "1rem",
  paddingRight: "1rem",
}));

type MenuButtonProps = {
  id: string;
  isActive: boolean;
  children: ReactNode;
};

const MenuButtom = ({ id, children, isActive }: MenuButtonProps) => {
  if (isActive) return <ActiveButton id={id}>{children}</ActiveButton>;

  return (
    <Button id={id} variant="text">
      {children}
    </Button>
  );
};

const MenuBar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const mainPath = location?.pathname?.split("/")?.[1];

  return (
    <Box bgcolor="customColor.grey.accent4">
      <Container fixed sx={{ display: "flex", alignItems: "center", height: "100%", gap: "0.5px", flexWrap: "wrap" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <MenuButtom id="btn_wallet_user" isActive={!menus.includes(mainPath)}>
            <Typography variant="button" sx={{ textTransform: "none" }}>
              {t("Search Wallet User")}
            </Typography>
          </MenuButtom>
        </Link>
        <Link to="/activity-log" style={{ textDecoration: "none" }}>
          <MenuButtom id="btn_activity_log" isActive={mainPath === "activity-log"}>
            <Typography variant="button" sx={{ textTransform: "none" }}>
              {t("Search Activity Logs")}
            </Typography>
          </MenuButtom>
        </Link>
      </Container>
    </Box>
  );
};
export default MenuBar;
