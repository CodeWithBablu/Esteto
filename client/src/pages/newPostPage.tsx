import "@/styles/pages/newPostPage.scss";
import "react-quill/dist/quill.snow.css";
import { AddressModal, PlaceModal, UploadWidget } from "@/components";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  ChevronDoubleUpIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import axios, { AxiosError } from "axios";
import {
  Address,
  City,
  UserType,
  Viewport,
  errorHandler,
  handleKeyDown,
  toastMessage,
} from "@/lib";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { AuthContext } from "@/context/AuthContext";
import { formatDistance, formatPrice, pricelimit } from "@/lib/utils";

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

interface IFormInput {
  title: string;
  price: number;
  images: [string];
  address: string;
  city: string;
  bedroom: number;
  bathroom: number;
  type: "buy" | "rent";
  property: "apartment" | "house" | "condo";
  latitude: string;
  longitude: string;

  // postdetail
  desc: string;
  utilities: string;
  pet: string;
  income?: string;
  size: number;
  school?: number;
  bus?: number;
  restaurant?: number;
}

interface Query {
  type: "buy" | "rent";
  price: string;
  school: string;
  bus: string;
  restaurant: string;
}

function NewPostPage() {
  const [images, setImages] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<Viewport | null>(null);

  const [viewport, setViewPort] = useState<Viewport>({
    latitude: 54.526,
    longitude: 15.2551,
    zoom: 8,
  });

  const [query, setQuery] = useState<Query>({
    type: "rent",
    price: "1000",
    school: "",
    bus: "",
    restaurant: "",
  });

  const [city, setCity] = useState<City | null>(null);
  const [address, setAddress] = useState<Address | null>(null);

  const { currUser } = useContext(AuthContext) as { currUser: UserType };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewPort((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Error getting user location:", error);
        },
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setQuery((prev) => ({
      ...prev,
      price: pricelimit[query.type].min.toFixed(0),
      [e.target.name]: e.target.value,
    }));
  };

  const onclick = () => {
    let errorMessage = "";
    let errorCount = 4;
    if (desc.length === 0 || desc === "<p><br></p>") {
      errorCount--;
      errorMessage += `description : No details? No listing magic!\n`;
    }

    if (images.length === 0) {
      errorCount--;
      errorMessage += `images : No pics? No property peek!\n`;
    }

    if (!city || !address) {
      errorCount--;
      errorMessage += `address : Address hidden, mystery location!\n`;
    }

    if (Object.entries(errors).length > 0) {
      for (const [key, value] of Object.entries(errors).slice(0, errorCount)) {
        errorMessage += `${key} : ${value.message}\n`;
      }
    }

    if (errorMessage.length > 0) toastMessage("error", errorMessage, 6000);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      if (desc.length === 0 || desc === "<p><br></p>")
        throw new Error("desc required");

      if (images.length === 0) throw new Error("upload images");

      if (!city || !address) throw new Error("address not specified");

      const {
        bedroom,
        bathroom,
        property,
        price,
        title,
        type,
        size,
        utilities,
        pet,
        income,
        school,
        bus,
        restaurant,
      } = data;
      const {
        city: cityName,
        place,
        latitude: lat,
        longitude: log,
      } = address as Address;

      const body = {
        post: {
          title,
          price,
          images: images,
          address: place,
          city: cityName.toLowerCase(),
          bedroom,
          bathroom,
          type,
          property,
          latitude: lat,
          longitude: log,
        },
        postdetail: {
          desc: desc,
          utilities,
          pet,
          income: income || "Not specified",
          size,
          school: school || 0,
          bus: bus || 0,
          restaurant: restaurant || 0,
        },
      };
      const res = await axios.post(`/api/post`, body);
      toastMessage("success", res.data.message, 4000);
      navigate("/profile");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else setError(errorHandler(error, "Failed to add post") as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1 className="mt-10 text-lg font-medium">Add New Post</h1>
        <div className="wrapper">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid w-full grid-cols-2 lg:grid-cols-3"
          >
            <div className="item">
              <label htmlFor="title">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("title", {
                  required: "title required. max: 40",
                  maxLength: 40,
                })}
                aria-invalid={errors.title ? "true" : "false"}
                maxLength={40}
                id="title"
                name="title"
                type="text"
                placeholder="title"
                autoComplete="title"
              />
            </div>

            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                {...register("type", { required: "type required" })}
                name="type"
                onChange={handleChange}
              >
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                {...register("property", { required: "property required" })}
                name="property"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
              </select>
            </div>

            <div className="item relative">
              <label htmlFor="price">
                Price <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("price", {
                  required: "price required. 1000-100Cr",
                })}
                aria-invalid={errors.price ? "true" : "false"}
                onChange={handleChange}
                className="remove-arrow"
                min={1000}
                max={pricelimit[query.type].max}
                id="price"
                name="price"
                type="number"
                placeholder="price"
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e, pricelimit[query.type].max)}
              />
              <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-indigo-400/90 shadow-xl">
                {query.price === "" || query.price === "0"
                  ? ""
                  : formatPrice(Number(query.price))}
              </span>
            </div>

            <div className="item">
              <label htmlFor="bedroom">
                Bedroom count <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("bedroom", { required: "bedroom required. 1-10" })}
                aria-invalid={errors.bedroom ? "true" : "false"}
                min={1}
                max={10}
                id="bedroom"
                name="bedroom"
                type="number"
                placeholder="bedroom"
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>

            <div className="item">
              <label htmlFor="bathroom">
                Bathroom count <span className="text-rose-500">*</span>
              </label>
              <input
                {...register("bathroom", {
                  required: "bathroom required. 1-10",
                })}
                aria-invalid={errors.bathroom ? "true" : "false"}
                min={1}
                max={10}
                id="bathroom"
                name="bathroom"
                type="number"
                placeholder="bathroom"
                autoComplete="off"
                onKeyDown={(e) => handleKeyDown(e)}
              />
            </div>

            <div className="item description">
              <label htmlFor="desc">
                Description <span className="text-rose-500">*</span>
              </label>
              <ReactQuill theme="snow" onChange={setDesc} value={desc} />
            </div>

            <div className="item h-full">
              <label htmlFor="city">
                City <span className="text-rose-500">*</span>
              </label>
              <PlaceModal type="city" data={city} setData={setCity} />
            </div>

            {currUser && (
              <AddressModal
                currUser={currUser}
                city={city}
                address={address}
                setAddress={setAddress}
                userLocation={userLocation}
                setUserLocation={setUserLocation}
                viewport={viewport}
                setViewPort={setViewPort}
              />
            )}

            <div className="item relative">
              <label htmlFor="size">
                Built up area <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex w-full items-center">
                <input
                  {...register("size", {
                    required: "Built up area required. 150-15000 sq.ft",
                  })}
                  min={150}
                  max={15000}
                  step={1}
                  className="remove-arrow"
                  id="size"
                  name="size"
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, 15000, "Sq.ft", 150)}
                />
                <span className="absolute bottom-[5px] right-[1px] flex h-5 flex-col items-center rounded-l-[5px] border-none px-2 font-medium text-indigo-400/90 shadow-xl">
                  Sq.ft
                </span>
              </div>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                {...register("utilities", { required: "utilities required" })}
                name="utilities"
              >
                <option value="Owner is responsible">
                  Owner is responsible
                </option>
                <option value="Tenant is responsible">
                  Tenant is responsible
                </option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select {...register("pet")} name="pet">
                <option value="Allowed">Allowed</option>
                <option value="Not allowed">Not Allowed</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                {...register("income")}
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>

            <div className="item relative">
              <label htmlFor="school">School</label>
              <div className="relative flex w-full items-center">
                <input
                  {...register("school")}
                  min={50}
                  max={20000}
                  className="remove-arrow"
                  onChange={handleChange}
                  id="school"
                  name="school"
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, 20000, "m", 50)}
                />
                <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-indigo-400/90 shadow-xl">
                  {query.school === "" || query.school === "0"
                    ? ""
                    : formatDistance(Number(query.school))}
                </span>
              </div>
            </div>

            <div className="item relative">
              <label htmlFor="bus">bus</label>
              <div className="relative flex w-full items-center">
                <input
                  {...register("bus")}
                  min={50}
                  max={20000}
                  className="remove-arrow"
                  onChange={handleChange}
                  id="bus"
                  name="bus"
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, 20000, "m", 50)}
                />
                <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-indigo-400/90 shadow-xl">
                  {query.bus === "" || query.bus === "0"
                    ? ""
                    : formatDistance(Number(query.bus))}
                </span>
              </div>
            </div>

            <div className="item relative">
              <label htmlFor="restaurant">Restaurant</label>
              <div className="relative flex w-full items-center">
                <input
                  {...register("restaurant")}
                  min={50}
                  max={20000}
                  className="remove-arrow"
                  onChange={handleChange}
                  id="restaurant"
                  name="restaurant"
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, 20000, "m", 50)}
                />
                <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-indigo-400/90 shadow-xl">
                  {query.restaurant === "" || query.restaurant === "0"
                    ? ""
                    : formatDistance(Number(query.restaurant))}
                </span>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              {isLoading && (
                <span className="absolute z-20 animate-spin text-zinc-800">
                  {Loader}
                </span>
              )}
              <button
                onClick={onclick}
                type="submit"
                className={clsx(
                  "relative h-fit w-full self-end rounded-md bg-blue-600 py-[10px] text-lg font-medium text-gray-50",
                  { "pointer-events-none opacity-50": isLoading },
                  { "opacity-100": !isLoading },
                )}
              >
                Add
              </button>
            </div>
          </form>

          {error && (
            <p
              role="alert"
              className="w-full text-center font-[400] text-rose-500"
            >
              <ExclamationCircleIcon className="mr-1 inline-block w-6" />
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="sideContainer relative flex flex-col items-center justify-center lg:bg-slate-100">
        <div className="absolute top-[20%] z-0 hidden h-[15rem] w-[15rem] animate-blob rounded-full bg-gradient-radial from-teal-500/40 blur-2xl filter lg:inline-block xl:top-[10%] xl:h-[25rem] xl:w-[25rem]"></div>
        <div className="animation-delay-7000 absolute left-[10%] top-[30%] z-0 hidden h-[15rem] w-[15rem] animate-blob rounded-full bg-gradient-radial from-indigo-500/50 blur-2xl filter lg:inline-block xl:h-[25rem] xl:w-[25rem]"></div>

        <div className="smallImages relative flex h-[200px] w-[300px] items-center sm:h-[250px] sm:w-[300px] sm:justify-center">
          <div
            className={clsx(
              "no-scrollbar relative flex h-[200px] flex-row gap-5 overflow-scroll sm:flex-col lg:h-[250px]",
            )}
          >
            {images.map((image, index) => (
              <img
                className="h-full w-full object-cover"
                key={index}
                src={image}
                alt="property"
              />
            ))}
          </div>

          <div
            className={clsx(
              "absolute right-0 flex w-20 rotate-90 items-center justify-center gap-3  rounded-md bg-gradient-radial from-blue-600 p-2 font-semibold text-gray-200 backdrop-blur-2xl sm:bottom-0 sm:right-auto sm:w-fit sm:rotate-0",
              {
                hidden: images.length <= 1,
                block: images.length > 1,
              },
            )}
          >
            <ChevronDoubleUpIcon className="w-6 animate-bounce ease-linear" />
            <span className="hidden sm:inline-block">scroll up</span>
          </div>
        </div>

        <UploadWidget
          uwConfig={{
            cloudName: "codewithbablu",
            uploadPreset: "esteto",
            multiple: true,
            maxImageFileSize: 20000000,
            folders: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
