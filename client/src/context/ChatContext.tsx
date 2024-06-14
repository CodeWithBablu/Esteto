// import { ChatType } from "@/lib";
import { ReactNode, createContext, useState } from "react";

interface ChatContextProps {
  isChatOpen: boolean;
  isMessageOpen: boolean;
  setChatOpen: (isOpen: boolean) => void;
  setMessageOpen: (isOpen: boolean) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  isChatOpen: false,
  isMessageOpen: false,
  setChatOpen: () => {},
  setMessageOpen: () => {},
});

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [isMessageOpen, setMessageOpen] = useState<boolean>(false);

  return (
    <ChatContext.Provider
      value={{ isChatOpen, isMessageOpen, setChatOpen, setMessageOpen }}
    >
      {children}
    </ChatContext.Provider>
  );
};
