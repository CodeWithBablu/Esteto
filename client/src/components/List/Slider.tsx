import "../../styles/ui/slider.scss";

import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";

export default function Slider({ images }: { images: string[] }) {
  const [currImage, setCurrImage] = useState(-1);

  const changeSlide = (direction: string) => {
    direction == "left"
      ? setCurrImage((prev) => (prev > 0 ? prev - 1 : prev))
      : setCurrImage((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="slider flex h-max flex-col sm:h-[350px] sm:flex-row">
      {currImage !== -1 && (
        <div className="fullSlider flex items-center bg-gradient-radial from-indigo-900 backdrop-blur-2xl">
          <div className=" flex flex-1 items-center justify-center">
            <ChevronLeftIcon
              onClick={() => changeSlide("left")}
              className={clsx(
                "arrow h-10 w-10 cursor-pointer md:h-20 md:w-20",
                { "pointer-events-none opacity-30": currImage <= 0 },
              )}
            />
          </div>

          <div className="imgContainer h-max flex-[10] rounded-xl p-2 md:h-screen md:py-10">
            <img
              className="object-cover"
              src={images[currImage]}
              alt="preview"
            />
          </div>

          <div className=" flex flex-1 items-center justify-center">
            <ChevronRightIcon
              onClick={() => changeSlide("right")}
              className={clsx(
                "arrow h-10 w-10 cursor-pointer sm:h-20 sm:w-20",
                {
                  "pointer-events-none opacity-30":
                    currImage >= images.length - 1,
                },
              )}
            />
          </div>

          <XMarkIcon
            onClick={() => setCurrImage(-1)}
            className="absolute right-5 top-5 h-10 w-10 cursor-pointer transition-all duration-300 ease-linear hover:scale-110"
          />
        </div>
      )}

      <div
        className={clsx(
          "bigImage",
          { "flex-[3]": images.length > 1 },
          { "flex-[1]": images.length == 1 },
        )}
      >
        <img src={images[0]} alt="preview" onClick={() => setCurrImage(0)} />
      </div>

      {images.length > 1 && (
        <div
          className={clsx(
            `smallImages relative flex h-full flex-1 items-center sm:justify-center`,
          )}
        >
          <div
            className={clsx(
              "no-scrollbar relative flex flex-row gap-5 overflow-scroll sm:flex-col",
              {
                "w-[90%] sm:h-80 sm:w-full": images.length > 4,
                "w-[90%] sm:w-full md:h-full": images && images.length <= 4,
              },
            )}
          >
            {images.slice(1).map((image, index) => (
              <img
                className="w- h-[50px] sm:min-w-[150px]"
                key={index}
                src={image}
                alt="preview"
                onClick={() => setCurrImage(index + 1)}
              />
            ))}
          </div>

          <div
            className={clsx(
              "absolute right-0 flex w-20 rotate-90 items-center justify-center gap-3  rounded-md bg-gradient-radial from-blue-600 p-2 font-semibold text-gray-200 backdrop-blur-2xl sm:bottom-0 sm:right-auto sm:w-fit sm:rotate-0",
              {
                hidden: images.length <= 4,
                block: images.length > 4,
              },
            )}
          >
            <ChevronDoubleUpIcon className="w-6 animate-bounce ease-linear" />
            <span className="hidden sm:inline-block">scroll up</span>
          </div>
        </div>
      )}
    </div>
  );
}
