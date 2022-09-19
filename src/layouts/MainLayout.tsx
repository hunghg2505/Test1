import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Container } from "@mui/material";
import MenuBar from "../common/components/menuBar";

type MainLayoutProps = {
  pageTitle: string;
  children: ReactNode;
};

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <MenuBar />
      <Container fixed>{children}</Container>
    </>
  );
};

export default MainLayout;
