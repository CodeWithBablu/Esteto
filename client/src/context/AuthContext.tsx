import { UserType } from "@/lib";
import { ReactNode, createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currUser, setCurrUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  );
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currUser));
  }, [currUser]);

  const updateUser = (data: UserType) => {
    setCurrUser(data);
  };

  return (
    <AuthContext.Provider value={{ currUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
