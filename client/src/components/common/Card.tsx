import "../../styles/ui/card.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapIcon } from "@heroicons/react/24/outline";
import { Estate, EstateRaw, UserType, toastMessage } from "../../lib";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import clsx from "clsx";
import { AuthContext } from "@/context/AuthContext";
import { formatPrice, truncateText } from "@/lib/utils";
import { ChatContext } from "@/context/ChatContext";

const Loader = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-8 w-8"
    fill="currentColor"
  >
    <path d="M3.05469 13H5.07065C5.55588 16.3923 8.47329 19 11.9998 19C15.5262 19 18.4436 16.3923 18.9289 13H20.9448C20.4474 17.5 16.6323 21 11.9998 21C7.36721 21 3.55213 17.5 3.05469 13ZM3.05469 11C3.55213 6.50005 7.36721 3 11.9998 3C16.6323 3 20.4474 6.50005 20.9448 11H18.9289C18.4436 7.60771 15.5262 5 11.9998 5C8.47329 5 5.55588 7.60771 5.07065 11H3.05469Z"></path>
  </svg>
);

export default function Card({
  item,
  btnDisabled,
}: {
  item: EstateRaw | Estate;
  btnDisabled: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(item.isSaved || false);

  const { currUser } = useContext(AuthContext) as {
    currUser: UserType | null;
    updateUser: (data: UserType | null) => void;
  };

  const { setChatOpen } = useContext(ChatContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSave = async () => {
    setIsLoading(true);
    if (!currUser) navigate("/login");
    try {
      const res = await axios.post("/api/post/save", { postId: item._id });
      toastMessage("success", res.data.message, 4000);
      setIsSaved((prev) => !prev);
      if (location.pathname === "/profile") navigate(0);
    } catch (error) {
      if (error instanceof AxiosError) {
        toastMessage("error", error.response?.data.message, 4000);
      } else toastMessage("error", "error occured. Try again", 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    setIsLoading(true);
    if (!currUser) navigate("/login");
    try {
      await axios.post("/api/chat/addchat", {
        recieverId: typeof item.user === "string" ? item.user : item.user._id,
        postId: item._id,
      });
      setChatOpen(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        toastMessage("error", error.response?.data.message, 4000);
      } else
        toastMessage(
          "error",
          "Unable to open chat. Please refresh the page and try again.",
          4000,
        );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card relative flex w-full flex-col rounded-2xl border-[1px] bg-transparent p-2 md:flex-row">
      <Link to={`/estate/${item._id}`} className="imgContainer h-[250px]">
        <img src={item.images[0]} alt={item.title} />
      </Link>

      {item.city && (
        <span className="absolute -right-[1px] -top-[1px] rounded-bl-lg rounded-tr-2xl bg-zinc-950 px-2 py-1 text-sm text-gray-50">
          {item.city}
        </span>
      )}

      <div className="textContainer flex flex-col gap-3 md:justify-between">
        <h2 className="cardTitle">
          <Link to={`/estate/${item._id}`}>{truncateText(item.title, 30)}</Link>
        </h2>

        <p className="address">
          <MapIcon className="h-5 w-5 shrink-0" />
          <span>{truncateText(item.address, 100)}</span>
        </p>

        <div className="flex w-full items-center justify-between">
          <span className="price font-chillax">
            ₹ {formatPrice(item.price)}
          </span>

          <div className=" flex gap-3">
            <span className="rounded-md bg-slate-100 px-3 py-1 text-gray-500">
              {item.property}
            </span>

            <span
              className={clsx("rounded-md px-3 py-1", {
                "bg-pink-100 text-pink-400": item.type === "buy",
                "bg-indigo-100 text-indigo-400": item.type === "rent",
              })}
            >
              {item.type}
            </span>
          </div>
        </div>

        <div className="bottom flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="features">
            <div className="feature">
              <div className="flex items-center gap-2">
                <img src="/assets/icons/bed.png" alt="bed" />
                <span>{item.bedroom}</span>
              </div>
              <span className="">bedroom</span>
            </div>

            <div className="feature">
              <div className="flex items-center gap-2">
                <img src="/assets/icons/bath.png" alt="bath" />
                <span>{item.bathroom}</span>
              </div>
              <span className="">bathroom</span>
            </div>
          </div>

          <div
            className={clsx("icons gap-3", {
              "gap-0": btnDisabled,
              hidden: currUser && currUser._id === item.user,
              "flex items-center":
                (currUser && currUser._id !== item.user) || !currUser,
            })}
          >
            <div className="relative flex items-center justify-center">
              {isLoading && (
                <span className="absolute z-20 animate-spin text-zinc-800">
                  {Loader}
                </span>
              )}
              <img
                onClick={handleSave}
                className={clsx(
                  "icon relative",
                  { hidden: btnDisabled },
                  { "pointer-events-none opacity-50": isLoading },
                  { "opacity-100": !isLoading },
                )}
                src={`${isSaved ? "/assets/icons/save.png" : "/assets/icons/unsaved.png"}`}
                alt="save"
              />
            </div>

            <img
              onClick={handleChat}
              className={clsx(`icon`, { hidden: btnDisabled })}
              src="/assets/icons/chat.png"
              alt="chat"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
