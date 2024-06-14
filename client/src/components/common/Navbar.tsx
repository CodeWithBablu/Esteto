import "../../styles/ui/navbar.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import Chat from "../Profile/Chat";
import Menu from "./Menu";
import { UserType, toastMessage, useNotificationStore } from "@/lib";
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import axios, { AxiosError } from "axios";

export default function Navbar() {
  const refs = useRef({
    chatRef: null as HTMLDivElement | null,
    chatTriggerRef: null as HTMLDivElement | null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currUser, updateUser } = useContext(AuthContext) as {
    currUser: UserType | null;
    updateUser: (data: UserType | null) => void;
  };
  const { count, fetch } = useNotificationStore();
  const { isChatOpen, isMessageOpen, setChatOpen, setMessageOpen } =
    useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (refs.current.chatRef && refs.current.chatTriggerRef)
        if (
          !refs.current.chatTriggerRef.contains(e.target as Node) &&
          !refs.current.chatRef.contains(e.target as Node)
        ) {
          setChatOpen(false);
          setMessageOpen(false);
        }
    }

    document.addEventListener("mousedown", handler);
    if (currUser && count === -1) fetch();

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [fetch, currUser, count, setChatOpen, setMessageOpen]);

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("user");
      updateUser(null);
      toastMessage("success", "Logout successfully", 4000);
      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        toastMessage("error", error.response?.data.message, 5000);
      } else toastMessage("error", "Failed to log out", 5000);
    }
  };

  const location = useLocation();

  return (
    <>
      <nav className=" z-30 w-full font-chillax">
        <div className="left">
          <div className="relative">
            <div
              className="animation-delay-4000 absolute bottom-0 left-16 h-10 w-10 animate-blob
      rounded-full bg-teal-500 opacity-100 blur-xl"
            ></div>

            <div
              className="animation-delay-2000 absolute -top-5 left-32 h-10 w-10 animate-blob
      rounded-full bg-indigo-600 opacity-100 blur-xl"
            ></div>

            <a
              href="/"
              className=" relative flex w-fit shrink-0 items-center bg-transparent md:w-12 lg:w-fit"
            >
              <img
                className="h-10 w-10 -rotate-90 rounded-full lg:h-12 lg:w-12"
                src={"/mountain.png"}
                alt="logo"
              />

              <span className="z-10 ml-2 font-chillax text-4xl font-semibold text-zinc-700">
                Esteto
              </span>
            </a>
          </div>

          <div className="navLinks flex items-center gap-[30px] text-[20px] font-medium text-gray-800">
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/list">Listings</a>
          </div>
        </div>

        <div
          className={clsx(`right bg-slate-100 text-[20px] font-medium`, {
            "bg-transparent": location.pathname === "/profile",
          })}
        >
          {currUser ? (
            <>
              <Menu />
              <div
                ref={(el) => (refs.current.chatTriggerRef = el)}
                onClick={() => {
                  setChatOpen(!isChatOpen);
                }}
                className="relative cursor-pointer"
              >
                <img
                  src="/assets/icons/message3.png"
                  alt="message"
                  className="relative mx-4 h-8 w-8 md:mx-4 md:h-10 md:w-10"
                />
                <div
                  className={clsx(
                    "absolute right-0 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/3 items-center justify-center rounded-full bg-rose-600 text-sm font-medium text-gray-100",
                    {
                      hidden: count <= 0,
                      "inline-block": count > 0,
                    },
                  )}
                >
                  {count}
                </div>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="mx-4 text-zinc-800">
                Sign in
              </a>
              <a
                href="/register"
                className="mx-4 bg-blue-500 px-6 py-3 text-gray-50"
              >
                Sign up
              </a>
            </>
          )}

          <Bars3Icon
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`z-30 inline w-8 cursor-pointer lg:hidden lg:w-10 ${isMenuOpen ? "text-gray-200" : "text-zinc-800"}`}
          />

          <div
            className={clsx(
              `z-10 flex flex-col items-center justify-center gap-5 text-2xl font-semibold text-slate-200`,
              {
                "menu active": isMenuOpen,
                menu: !isMenuOpen,
              },
            )}
          >
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Agents</a>
            {currUser ? (
              <>
                <a href="/profile">Profile</a>
                <span onClick={logout} className="mt-5 text-red-500">
                  Logout
                </span>
              </>
            ) : (
              <>
                <a href="/login">Sign in</a>
                <a href="/register">Sign up</a>
              </>
            )}
          </div>
        </div>
      </nav>
      <div
        className="z-30"
        ref={(el) => {
          refs.current.chatRef = el;
        }}
      >
        <Chat
          isOpen={isChatOpen}
          isMessageOpen={isMessageOpen}
          currUser={currUser}
          setMessageOpen={setMessageOpen}
        />
      </div>
    </>
  );
}
