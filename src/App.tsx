import { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useRoutes } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Routes from "./routes";
import { CreateCustomTheme } from "./theme";
import NavBar from "./common/components/navBar/NavBar";

const theme = CreateCustomTheme({});

function Content({ authenticated }: { authenticated: boolean | undefined }) {
  const content = useRoutes(Routes(authenticated));

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<div></div>}>
        <>
          <NavBar />
          {content}
        </>
      </Suspense>
    </ThemeProvider>
  );
}

function App() {
  const { initialized, keycloak } = useKeycloak();

  if (keycloak?.token) {
    localStorage.setItem("token", keycloak.token);
  }

  if (!initialized) {
    return <div></div>;
  }

  return <Content authenticated={keycloak?.authenticated} />;
}

export default App;
