import { useContext, useEffect, useState } from "react";
import { HomeModernIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  ChatType,
  UserType,
  errorHandler,
  toastMessage,
  truncateText,
  useNotificationStore,
} from "@/lib";
import Message from "./Message";
import axios, { AxiosError } from "axios";
import { SocketContext } from "@/context/SocketContext";
import { Socket } from "socket.io-client";
import { Tooltip } from "@radix-ui/themes";
// import { ChatContext } from "@/context/ChatContext";

export default function Chat({
  isOpen,
  currUser,
  isMessageOpen,
  setMessageOpen,
}: {
  isOpen: boolean;
  currUser: UserType | null;
  isMessageOpen: boolean;
  setMessageOpen: (isOpen: boolean) => void;
}) {
  const [chatInfo, setChatInfo] = useState<{
    sender: string;
    receiver: UserType | null;
    chatId: string;
  }>({
    sender: "",
    receiver: null,
    chatId: "",
  });

  const [chats, setChats] = useState<ChatType[]>([]);
  const { socket } = useContext(SocketContext) as { socket: Socket };
  const { fetch, dec } = useNotificationStore();

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", () => {
        if (!isMessageOpen) {
          fetch();
          fetchChats();
        }
      });
    }

    if (isOpen) fetchChats();

    return () => {
      if (socket) socket.off("getMessage");
    };
  }, [isOpen, isMessageOpen, socket, fetch]);

  async function fetchChats() {
    try {
      const res = await axios.get("/api/chat/");
      setChats(res.data.value);
    } catch (error) {
      if (error instanceof AxiosError) {
        toastMessage("error", error.response?.data.message, 5000);
      } else
        toastMessage(
          "error",
          errorHandler(error, "Failed to sent message") as string,
          5000,
        );
    }
  }

  const handleClick = (
    sender: string,
    receiver: UserType | null,
    chatId: string,
    seenBy: string[],
  ) => {
    if (!seenBy.includes(sender)) {
      const updatedChats = chats.map((chat) => {
        if (chat._id === chatId) {
          chat.seenBy.push(sender);
          dec();
        }
        return chat;
      });
      setChats(updatedChats);
    }
    setChatInfo({
      sender,
      receiver,
      chatId,
    });
    setMessageOpen(true);
  };

  return (
    <div
      className={clsx(
        "absolute left-0 top-[70px] z-50 flex h-[calc(100dvh-70px)] w-full max-w-[600px] overflow-hidden bg-zinc-950/90 font-poppins backdrop-blur-2xl transition-all duration-200 ease-in-out sm:left-auto sm:right-10 sm:h-[calc(100dvh-80px)] sm:rounded-2xl",
        {
          "translate-x-0": isOpen,
          "translate-x-[calc(100%+2.5rem)]": !isOpen,
        },
      )}
    >
      {currUser && (
        <>
          {/* //// contactContainer started */}
          <div
            className={clsx(
              "contactContainer sticky top-0 z-40 h-full w-full shrink-0 transition-all duration-500 ease-linear",
              { "blur-sm": isMessageOpen },
            )}
          >
            <div className="flex w-full items-center justify-between px-2 pt-3 sm:px-5">
              <div className="flex items-center gap-5 sm:gap-8">
                {currUser.avatar ? (
                  <>
                    {!currUser.avatar.includes("<svg") && (
                      <img
                        src={currUser.avatar}
                        className="h-12 w-12 rounded-full object-cover"
                        alt="avatar"
                      />
                    )}
                    {currUser.avatar.includes("<svg") && (
                      <div
                        className=" h-12 w-12"
                        dangerouslySetInnerHTML={{
                          __html: currUser?.avatar as string,
                        }}
                      />
                    )}
                  </>
                ) : (
                  <UserCircleIcon className="mx-2 h-10 w-10 text-zinc-600 md:h-12 md:w-12" />
                )}

                <div className="flex items-center gap-2 sm:flex-col sm:items-start">
                  <span className="text-gray-300/90">hey!</span>
                  <h2 className="text-[20px] font-medium text-gray-50">
                    {currUser.username}
                  </h2>
                </div>
              </div>

              {/* <XMarkIcon className="w-8 hidden text-gray-300 mr-4" /> */}
            </div>

            <div className="flex items-center gap-5 px-2 pb-3 pt-2 sm:px-5">
              <hr className=" w-[60px] border-orange-400" />
              <h2 className=" font-chillax text-[20px] font-medium text-orange-600">
                Messages
              </h2>
              <hr className=" w-full border-orange-400" />
            </div>

            <div
              className={clsx(
                "cardContainer h-full overflow-y-scroll px-2 pb-44 sm:px-5",
                {
                  "overflow-hidden": isMessageOpen,
                },
              )}
            >
              {chats && chats.length > 0 ? (
                <>
                  {chats.map((chat, index) => {
                    const receiver = chat.participants.filter(
                      (user) => user._id !== currUser._id,
                    )[0] as UserType;
                    return (
                      <div key={index}>
                        <Tooltip
                          className="rounded-lg border-2 border-orange-600/50 fill-orange-500 stroke-orange-500 px-2 py-2 font-poppins shadow-lg shadow-orange-500/20"
                          content={
                            <div className="flex items-center gap-3">
                              {receiver.avatar ? (
                                <>
                                  {!receiver.avatar.includes("<svg") && (
                                    <img
                                      src={receiver.avatar}
                                      className="h-8 w-8 rounded-full object-cover"
                                      alt="avatar"
                                    />
                                  )}
                                  {receiver.avatar.includes("<svg") && (
                                    <div
                                      className="h-8 w-8"
                                      dangerouslySetInnerHTML={{
                                        __html: receiver.avatar,
                                      }}
                                    />
                                  )}
                                </>
                              ) : (
                                <UserCircleIcon className="mx-2 h-10 w-10 text-zinc-600 md:h-12 md:w-12" />
                              )}

                              <div className="flex flex-col gap-1">
                                <span className=" font-poppins text-sm">
                                  {receiver.username}
                                </span>
                                <span className=" font-poppins text-sm text-indigo-300">
                                  {receiver.email}
                                </span>
                              </div>
                            </div>
                          }
                        >
                          <div
                            onClick={() =>
                              handleClick(
                                currUser._id as string,
                                receiver,
                                chat._id,
                                chat.seenBy,
                              )
                            }
                            className={clsx(
                              "user relative flex cursor-pointer items-center gap-5 border-b py-3 sm:gap-8",
                              {
                                "border-pink-500":
                                  !chat.seenBy.includes(currUser._id) &&
                                  chat.messages.length > 0,
                                "border-zinc-600":
                                  chat.seenBy.includes(currUser._id) ||
                                  chat.messages.length === 0,
                              },
                            )}
                          >
                            {chat.post.images ? (
                              <>
                                {chat.post.images[0] && (
                                  <img
                                    src={chat.post.images[0]}
                                    className="h-12 w-12 rounded-full object-cover"
                                    alt="property"
                                  />
                                )}
                              </>
                            ) : (
                              <HomeModernIcon className="mx-2 h-10 w-10 text-zinc-400 md:h-12 md:w-12" />
                            )}

                            <div className="w-full">
                              <h2 className="font-chillax text-[16px] font-medium text-gray-50 sm:text-[18px]">
                                {chat.post.title}
                              </h2>
                              <div className="flex w-full justify-between">
                                <span
                                  className={clsx(
                                    "font-chillax text-[14px] font-medium sm:text-[16px]",
                                    {
                                      "text-pink-500":
                                        !chat.seenBy.includes(currUser._id) &&
                                        chat.messages.length > 0,
                                      "text-gray-400":
                                        chat.seenBy.includes(currUser._id) ||
                                        chat.messages.length === 0,
                                    },
                                  )}
                                >
                                  {chat.latestMessage &&
                                    truncateText(chat.latestMessage, 20)}
                                  {!chat.latestMessage && "Hey! I am on esteto"}
                                </span>

                                <span className="font-chillax text-sm text-orange-100">
                                  {chat.post.address.split(",")[0] &&
                                    truncateText(
                                      chat.post.address.split(",")[0],
                                      20,
                                    )}
                                  {chat.post.city}
                                </span>
                              </div>
                            </div>

                            <span
                              className={clsx(
                                "absolute right-2 top-4 h-2 w-2 animate-pulse rounded-full bg-pink-500 ease-in",
                                {
                                  "inline-block":
                                    !chat.seenBy.includes(currUser._id) &&
                                    chat.messages.length > 0,
                                  hidden:
                                    chat.seenBy.includes(currUser._id) ||
                                    chat.messages.length === 0,
                                },
                              )}
                            ></span>
                          </div>
                        </Tooltip>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center text-gray-400">
                  <span className="text-lg">
                    Chat room's on vacation, empty vibes!!
                  </span>
                  <img
                    src="/assets/icons/notification.png"
                    className="h-[50%] w-[50%] object-contain"
                    alt="chat"
                  />
                </div>
              )}
            </div>
          </div>
          {/* //// contactContainer ended */}

          {/* //// messageContainer*/}
          <Message
            isMessageOpen={isMessageOpen}
            setMessageOpen={setMessageOpen}
            chatInfo={chatInfo}
          />
        </>
      )}
    </div>
  );
}
