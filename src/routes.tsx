import { lazy } from "react";
import { Outlet } from "react-router-dom";

const Login = lazy(() => import("./pages/Login"));
const WalletUser = lazy(() => import("./pages/WalletUser"));
const WalletUserProfile = lazy(() => import("./pages/WalletUserProfile"));
const ActivityLog = lazy(() => import("./pages/ActivityLog"));

const Routes = (isLoggedIn: boolean | undefined) => {
  if (isLoggedIn) {
    return [
      {
        path: "",
        element: <Outlet />,
        children: [
          { path: "/", element: <WalletUser /> },
          {
            path: "/wallet-user-profile",
            element: <Outlet />,
            children: [
              { path: "", element: <WalletUserProfile /> },
              { path: ":id", element: <WalletUserProfile /> },
            ],
          },
          {
            path: "/activity-log",
            element: <Outlet />,
            children: [{ path: "", element: <ActivityLog /> }],
          },
          { path: "/login", element: <Login /> },
          { path: "*", element: <WalletUser /> },
        ],
      },
    ];
  }

  return [
    {
      path: "",
      element: (
        <div>
          <Outlet />
        </div>
      ),
      children: [
        { path: "/", element: <Login /> },
        { path: "*", element: <Login /> },
      ],
    },
  ];
};

export default Routes;
