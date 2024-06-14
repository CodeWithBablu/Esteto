import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global/index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </SocketContextProvider>
      <Toaster />
    </AuthContextProvider>
  </React.StrictMode>,
);
