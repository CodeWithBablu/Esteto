import {
  UserType,
  errorHandler,
  formatLastSeen,
  formatMessageDate,
  formatTime,
  toastMessage,
  useNotificationStore,
} from "@/lib";
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import axios, { AxiosError } from "axios";
import clsx from "clsx";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatSkeleton } from "../ui/skeletons";
import { MessageType } from "@/lib/definations";
import { Socket } from "socket.io-client";
import { SocketContext } from "@/context/SocketContext";

export default function Message({
  isMessageOpen,
  setMessageOpen,
  chatInfo,
}: {
  isMessageOpen: boolean;
  setMessageOpen: (state: boolean) => void;
  chatInfo: { sender: string; receiver: UserType | null; chatId: string };
}) {
  const [stickyDate, setStickyDate] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useContext(SocketContext) as { socket: Socket };

  const ref = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { dec } = useNotificationStore();
  const { sender, receiver, chatId } = chatInfo;

  useEffect(() => {
    const read = async () => {
      try {
        await axios.post(`/api/chat/read/${chatId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          toastMessage("error", error.response?.data.message, 4000);
        } else toastMessage("error", "Failed to read message", 4000);
      }
    };

    const fetchChat = async (chatId: string) => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/chat/${chatId}`);
        setMessages(res.data.value.messages);
      } catch (error) {
        if (error instanceof AxiosError) {
          toastMessage("error", error.response?.data.message, 4000);
        } else toastMessage("error", "Coundn't fetch chat", 4000);
      } finally {
        setIsLoading(false);
      }
    };

    if (socket) {
      socket.on("getMessage", async (data) => {
        if (isMessageOpen && chatId === data.chatId) {
          setMessages((prev) => [...prev, data]);
          read();
        }
      });

      socket.on("userStatus", ({ online }: { online: boolean }) => {
        setIsOnline(online);
      });

      if (isMessageOpen && receiver) {
        socket.emit("getUserStatus", receiver._id as string);
      }
    }

    if (chatId && isMessageOpen) {
      fetchChat(chatId);
    }

    return () => {
      if (socket) socket.off("getMessage");
    };
  }, [chatId, isMessageOpen, socket, receiver, dec]);

  useEffect(() => {
    if (messageEndRef.current && isMessageOpen) {
      messageEndRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }

    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const parentRect = container.getBoundingClientRect();
        const chatDividers =
          container.querySelectorAll<HTMLDivElement>(".date-divider");

        chatDividers.forEach((divider) => {
          const rect = divider.getBoundingClientRect();
          const top = rect.top - parentRect.top;

          if (top <= 20) {
            setStickyDate(divider.dataset.date || "");
          }
        });
      }
    };

    const container = containerRef.current;
    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [messages, isMessageOpen]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length === 0 && ref.current) {
      ref.current.style.height = `60px`;
    }

    if (e.target.value.length > 0 && ref.current) {
      if (
        e.target.scrollHeight - 16 >
        parseInt(ref.current.style.height.toString())
      ) {
        ref.current.style.height = `${e.target.scrollHeight}px`;
      }
    }

    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/message/${chatId}`, {
        text: message,
      });
      const updatedMessages = [...messages, res.data.value];
      socket.emit("sendMessage", {
        receiverId: receiver?._id,
        data: res.data.value,
      });
      setMessages(updatedMessages);
      setMessage("");
      if (ref.current) {
        ref.current.style.height = `60px`;
      }
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
  };

  return (
    <div
      className={clsx(
        "messageContainer absolute left-0 top-0 z-50 flex h-full w-full shrink-0 flex-col overflow-hidden bg-zinc-900/90 transition-all duration-300 ease-linear",
        {
          "translate-x-0": isMessageOpen,
          "translate-x-full": !isMessageOpen,
        },
      )}
    >
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <ChatSkeleton />
        </div>
      ) : (
        <>
          {receiver && (
            <div className="flex h-[70px] w-full items-center gap-5 self-start bg-zinc-900 px-2 font-chillax shadow-2xl sm:h-[80px] sm:px-5 sm:py-4">
              <ChevronLeftIcon
                onClick={() => {
                  setStickyDate("");
                  setMessageOpen(false);
                }}
                className="mr-2 w-8 cursor-pointer text-gray-200"
              />

              {receiver.avatar ? (
                <>
                  {!receiver.avatar.includes("<svg") && (
                    <img
                      src={receiver.avatar}
                      className="h-12 w-12 rounded-full object-cover"
                      alt="avatar"
                    />
                  )}
                  {receiver.avatar.includes("<svg") && (
                    <div
                      className=" h-12 w-12"
                      dangerouslySetInnerHTML={{
                        __html: receiver?.avatar as string,
                      }}
                    />
                  )}
                </>
              ) : (
                <UserCircleIcon className="mx-2 h-10 w-10 text-zinc-400 md:h-12 md:w-12" />
              )}

              <div className="flex flex-col">
                <h2 className="text-[20px] font-medium capitalize text-gray-50">
                  {receiver.username}
                </h2>
                <span className="flex items-center gap-2 font-poppins text-sm text-gray-300">
                  <span
                    className={clsx(
                      "h-2 w-2 animate-pulse rounded-full bg-green-500",
                      {
                        "inline-block": isOnline,
                        hidden: !isOnline,
                      },
                    )}
                  ></span>
                  {isOnline ? "online" : formatLastSeen(receiver.lastSeenAt)}
                </span>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className="conversationContainer flex h-full flex-1 flex-col overflow-x-hidden overflow-y-scroll scroll-smooth bg-zinc-900 bg-zinc-950/80 px-5 pb-10 font-poppins text-sm font-medium sm:px-10 sm:text-base"
          >
            <div className=" sticky top-5 z-20 my-3 flex w-full justify-center transition-all duration-300">
              <span className="rounded-full bg-zinc-900/60 px-3 font-poppins text-[12px] text-orange-500 shadow-lg shadow-orange-500/20 backdrop-blur-xl">
                {stickyDate}
              </span>
            </div>

            {messages.map((message, index) => {
              const messageDate = formatMessageDate(message.createdAt);
              const prevMessage =
                index > 0
                  ? formatMessageDate(messages[index - 1].createdAt)
                  : null;
              const showDateDivider = messageDate !== prevMessage;

              return (
                <React.Fragment key={index}>
                  {showDateDivider && (
                    <div
                      className={clsx(
                        "date-divider my-3 flex w-full justify-center transition-all duration-100 ease-in-out",
                        {
                          invisible: stickyDate === messageDate,
                          visible: stickyDate !== messageDate,
                        },
                      )}
                      data-date={messageDate}
                    >
                      <span className="rounded-full bg-zinc-900/60 px-3 font-poppins text-[12px] text-orange-500 shadow-lg shadow-orange-500/20 backdrop-blur-xl">
                        {messageDate}
                      </span>
                    </div>
                  )}

                  <div
                    className={clsx(
                      "mb-2 flex w-fit max-w-[90%] flex-col gap-1 self-start px-3 py-2 text-left text-sm sm:max-w-[80%] sm:text-base",
                      {
                        "self-start rounded-b-xl rounded-r-xl rounded-tl-none bg-zinc-700/30 text-gray-300 backdrop-blur-xl":
                          message.sender !== sender,
                        "self-end rounded-b-xl rounded-l-xl rounded-tr-none bg-indigo-600 text-zinc-100":
                          message.sender === sender,
                      },
                    )}
                  >
                    <span className="w-full whitespace-pre-wrap">
                      {message.text}
                      {message.text.length <= 30 && (
                        <span
                          className={clsx(
                            " ml-3 shrink-0 text-sm text-stone-400",
                          )}
                        >
                          {formatTime(message.createdAt)}
                        </span>
                      )}
                    </span>

                    {message.text.length > 30 && (
                      <span
                        className={clsx(
                          " shrink-0 self-end text-sm text-stone-400",
                        )}
                      >
                        {formatTime(message.createdAt)}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            <div className="mt-5" ref={messageEndRef} />
          </div>

          <div className=" flex h-[100px] w-full items-center justify-center self-end bg-zinc-900/50">
            <form
              onSubmit={handleSubmit}
              className="inputContainer relative flex h-full w-[95%] items-center sm:w-[80%]"
            >
              <textarea
                ref={ref}
                onKeyDown={handleKeyDown}
                onChange={handleInput}
                value={message}
                placeholder="Start new chat here..."
                className="no-scrollbar absolute bottom-[20px] left-0 flex h-auto max-h-[120px] min-h-[60px] w-full resize-none items-center rounded-3xl border 
            border-zinc-700 bg-zinc-900 py-3 pl-6 pr-14 text-[16px] leading-7 text-gray-300 outline-none transition-all
            duration-150 ease-in-out focus:border-indigo-700 sm:w-[80%] sm:px-6"
                name="message"
                id="message"
                rows={1}
              ></textarea>

              <button
                type="submit"
                className="absolute bottom-[] right-[5px] flex h-[50px] w-[50px] items-center justify-center rounded-3xl bg-lime-400 sm:bottom-[20px] sm:right-5 sm:h-14 sm:w-14"
              >
                <PaperAirplaneIcon className="h-6 w-6 -rotate-45 sm:h-8 sm:w-8" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
