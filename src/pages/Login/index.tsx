import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

function Login() {
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  useEffect(() => {
    if (keycloak?.authenticated) {
      navigate("/");
    } else {
      keycloak?.login();
    }
  }, [navigate, keycloak]);

  return <div></div>;
}

export default Login;
