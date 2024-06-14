import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { UserType } from "@/lib";

export const SocketContext = createContext({});

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currUser } = useContext(AuthContext) as { currUser: UserType | null };

  useEffect(() => {
    if (socket && currUser) {
      socket.emit("newUser", currUser?._id);
    }
    if (!socket) setSocket(io(import.meta.env.VITE_SOCKET_BASE_URL));
  }, [socket, currUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
