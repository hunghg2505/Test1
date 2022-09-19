import React, { useState, useCallback, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./NavBar.module.scss";

const pages = [{ name: "BUSINESS CARE", path: "/", id: "btn_home" }];

const NavBar = () => {
  const { t } = useTranslation();
  const [anchorIsOpen, setAnchorIsOpen] = useState<boolean>(false);

  const { keycloak } = useKeycloak();
  const location = useLocation();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (keycloak?.tokenParsed) {
      const name = keycloak.tokenParsed.name as string;
      setFullName(name);
    }
  }, [keycloak]);

  const logout = useCallback(() => {
    keycloak?.logout();
  }, [keycloak]);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setAnchorIsOpen(open);
    };

  const Logo = () => {
    return (
      <>
        <Link to={"/"}>
          <Box
            id="img_abcLogo_upper"
            display={{ xs: "none", md: "flex" }}
            component="img"
            sx={{
              height: 24,
            }}
            alt="Logo"
            src={"/assets/logo/logo.png"}
          />
        </Link>

        <Link to={"/"}>
          <Box
            display={{ xs: "flex", md: "none" }}
            component="img"
            sx={{
              width: 64,
            }}
            alt="Logo"
            src={"/assets/logo/logo.png"}
          />
        </Link>
      </>
    );
  };
  const MenuList = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex" },
          mx: "10px",
        }}
      >
        {pages.map((page) => (
          <Button
            id={page.id}
            key={page.id}
            component={NavLink}
            to={page.path}
            onClick={toggleDrawer(false)}
            variant="text"
          >
            <Typography
              variant="h6"
              className={
                location.pathname !== page.path ? styles.unactiveNav : ""
              }
            >
              {page.name}
            </Typography>
          </Button>
        ))}
      </Box>
    );
  };

  const DrawerComp = () => {
    return (
      <Box
        sx={{
          flexGrow: 0,
          display: { xs: "flex", md: "none" },
        }}
        marginLeft="auto"
        marginRight="0"
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor={"right"}
          open={anchorIsOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: "200px" }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              <ListItem
                button
                sx={{ justifyContent: "end" }}
                onClick={toggleDrawer(false)}
              >
                <ListItemIcon sx={{ justifyContent: "end" }}>
                  <CloseIcon />
                </ListItemIcon>
              </ListItem>
              {pages.map((page) => (
                <ListItem
                  id={page.id}
                  key={page.id}
                  component={NavLink}
                  to={page.path}
                >
                  <ListItemText
                    primary={page.name}
                    className={
                      location.pathname !== page.path
                        ? styles.unactiveNav
                        : styles.activeNav
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    );
  };

  const RightSection = () => {
    return (
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
        <Box sx={{ mr: "16px" }}>
          <Avatar> {fullName?.charAt(0)}</Avatar>
        </Box>
        <Box sx={{ mr: "32px" }}>
          <Typography variant="body1" sx={{ color: "#000000" }}>
            {fullName}
          </Typography>
        </Box>
        <Button variant="text" onClick={logout}>
          <LogoutIcon
            style={{ width: "18px", height: "18px", marginRight: "8px" }}
          />
          <Typography variant="body1">{t("LOG OUT")}</Typography>
        </Button>
      </Box>
    );
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: "1px solid #E5E5E5", height: "67px" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Logo />
            <MenuList />
            <RightSection />
            <DrawerComp />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
