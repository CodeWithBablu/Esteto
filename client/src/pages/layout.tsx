import "../styles/global/layout.scss";

import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components";
import { Theme } from "@radix-ui/themes";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { UserType } from "@/lib";

export function Layout() {
  return (
    <Theme>
      <div className="layout">
        <Navbar />
        {/* <Toaster /> */}
        <div className="content">
          <Outlet />
        </div>
      </div>
      {/* <ThemePanel /> */}
    </Theme>
  );
}

export function RequireAuth() {
  const { currUser } = useContext(AuthContext) as {
    currUser: UserType | null;
    updateUser: (data: UserType | null) => void;
  };

  if (!currUser) <Navigate to={"/login"} />;

  return currUser ? (
    <Theme>
      <div className="layout">
        <Navbar />
        {/* <Toaster /> */}
        <div className="content">
          <Outlet />
        </div>
      </div>
      {/* <ThemePanel /> */}
    </Theme>
  ) : (
    <Navigate to={"/login"} />
  );
}

export default { Layout, RequireAuth };
