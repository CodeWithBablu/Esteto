import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { useEffect, useState } from "react";

interface UwConfigType {
  [key: string]: string | object | number | boolean;
}

interface Cloudinary {
  createUploadWidget: (
    config: UwConfigType,
    callback: (
      error: UploadApiErrorResponse | null,
      result: UploadApiResponse | null,
    ) => void,
  ) => { open: () => void };
}
declare global {
  interface Window {
    cloudinary: Cloudinary; // Adjust the type as needed
  }
}

// Create a context to manage the script loading state

function UploadWidget({
  uwConfig,
  setState,
}: {
  uwConfig: UwConfigType;
  setState: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  function initializeCloudinaryWidget() {
    if (loaded) {
      return window.cloudinary.createUploadWidget(uwConfig, (error, result) => {
        if (!error && result && result.event === "success") {
          setState((prev) => [...prev, result.info.secure_url as string]);
        }
      });
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const widget = initializeCloudinaryWidget();
    widget?.open();
  };

  return (
    <button
      id="upload_widget"
      className={`z-20 mt-5 rounded-md bg-indigo-600 px-6 py-2 font-poppins font-medium text-gray-100 
        ${loaded ? "opacity-100" : "pointer-events-none opacity-50"}`}
      disabled={!loaded}
      onClick={handleClick}
    >
      Upload
    </button>
  );
}

export default UploadWidget;
