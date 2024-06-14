import { AlertSvg, WarningSvg } from "@/components";
import toast from "react-hot-toast";

type MessageType = "success" | "error" | "warn" | "alert";

export const toastMessage = (
  type: MessageType,
  message: string,
  duration: number,
) => {
  if (type == "success") {
    toast.success(`${message}`, {
      duration,
      style: {
        maxWidth: "1000px",
        borderRadius: "10px",
        border: "1px solid #bbf7d0",
        background: "rgba(240, 253, 244, 0.5)",
        backdropFilter: "blur(10px)",
        color: "#16a34a",
        fontSize: 18,
        fontWeight: 400,
      },
    });
  }

  if (type == "error") {
    toast.error(`${message}`, {
      duration,
      style: {
        maxWidth: "1000px",
        borderRadius: "10px",
        border: "1px solid #fecaca",
        background: "rgba(254, 242, 242, 0.5)",
        backdropFilter: "blur(10px)",
        color: "#dc2626",
        fontSize: 18,
        fontWeight: 400,
      },
    });
  }

  if (type == "warn") {
    toast(`${message}`, {
      icon: <WarningSvg className={"h-6 w-6 stroke-amber-500 stroke-[1px]"} />,
      duration,
      style: {
        maxWidth: "1000px",
        borderRadius: "10px",
        border: "1px solid #fde68a",
        background: "rgba(254, 252, 232, 0.5)",
        backdropFilter: "blur(10px)",
        color: "#ca8a04",
        fontSize: 18,
        fontWeight: 400,
      },
    });
  }

  if (type == "alert") {
    toast(`${message}`, {
      icon: <AlertSvg className={"h-6 w-6"} />,
      duration,
      style: {
        maxWidth: "1000px",
        borderRadius: "10px",
        border: "1px solid #bfdbfe",
        background: "rgba(239, 246, 255, 0.5)",
        backdropFilter: "blur(10px)",
        color: "#2563eb",
        fontSize: 18,
        fontWeight: 400,
      },
    });
  }
};
