import { FormEvent, useEffect, useState } from "react";
import "../../styles/ui/filter.scss";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import PlaceModal from "../common/PlaceModal";
import { City, toastMessage, useCityStore } from "@/lib";
import { formatPrice, handleKeyDown, pricelimit } from "@/lib/utils";

interface IFormInput {
  city?: string;
  type: string;
  property: string;
  bedroom: string;
  minPrice: string;
  maxPrice: string;
}

const validTypes = ["buy", "rent"];

export default function Filter() {
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState<City | null>(null);

  const [query, setQuery] = useState<IFormInput>({
    city: searchParams.get("city") || "",
    type: searchParams.get("type") || "",
    property: searchParams.get("property") || "",
    bedroom:
      (searchParams.get("bedroom") === "0"
        ? ""
        : searchParams.get("bedroom")) || "",
    minPrice: searchParams.get("minPrice") || "1000",
    maxPrice: searchParams.get("maxPrice") || "1000000000",
  });

  useEffect(() => {
    const cityParams: City = {
      city: searchParams.get("city") as string,
      coordinates: {
        lon: parseFloat(searchParams.get("lon") as string),
        lat: parseFloat(searchParams.get("lat") as string),
      },
    };

    if (
      cityParams.city &&
      cityParams.coordinates.lat &&
      cityParams.coordinates.lon &&
      !city
    ) {
      setCity(cityParams);
    }
  }, [city, searchParams]);

  const { setCityState } = useCityStore();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setQuery((prev) => ({
      ...prev,
      minPrice: validTypes.includes(e.target.value)
        ? (pricelimit[e.target.value as "buy" | "rent"].min.toFixed(
            0,
          ) as string)
        : "1000",
      maxPrice: validTypes.includes(e.target.value)
        ? (pricelimit[e.target.value as "buy" | "rent"].max.toFixed(
            0,
          ) as string)
        : "1000000000",
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: IFormInput = {
      type: query.type,
      property: query.property,
      bedroom: query.bedroom !== "0" ? query.bedroom : "",
      minPrice: (query.minPrice as string) === "" ? "1000" : query.minPrice,
      maxPrice:
        (query.maxPrice as string) === "" ? "1000000000" : query.maxPrice,
    };

    if (!city) {
      toastMessage(
        "alert",
        "Type in the city name to begin your property search 😅",
        4000,
      );
      return;
    }

    if (Number(data.minPrice) > Number(data.maxPrice)) {
      toastMessage(
        "alert",
        "The minimum price must be lower than the maximum price 😅",
        4000,
      );
      return;
    }

    if (city)
      setCityState({
        city: city.city,
        coordinates: { lat: city.coordinates.lat, lon: city.coordinates.lon },
      });

    navigate(
      `/list?city=${city.city}&type=${data.type}&property=${data.property}&bedroom=${data.bedroom !== "0" ? data.bedroom : ""}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&lat=${city ? city.coordinates.lat : ""}&lon=${city ? city.coordinates.lon : ""}`,
    );
  };

  return (
    <div className="filter">
      <h1 className=" text-2xl font-light">
        Search results for{" "}
        <b className="font-semibold">{searchParams.get("city")}</b>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className=" grid grid-flow-row grid-cols-2 gap-x-2 gap-y-5 md:grid-cols-3 md:gap-y-3">
          <div className="item">
            <label htmlFor="city">
              City <span className="text-rose-500">*</span>
            </label>
            <PlaceModal type="city" data={city} setData={setCity} />
          </div>

          <div className="item">
            <label htmlFor="type">Type</label>
            <select
              onChange={handleChange}
              defaultValue={query.type}
              name="type"
              id="type"
            >
              <option value="">any</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              onChange={handleChange}
              defaultValue={query.property}
              name="property"
              id="property"
            >
              <option value="">any</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>

          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              onChange={handleChange}
              type="number"
              min={0}
              max={10}
              name="bedroom"
              id="bedroom"
              autoComplete="off"
              placeholder="any"
              defaultValue={query.bedroom}
            />
          </div>

          <div className="item relative col-span-2 md:col-span-1">
            <label htmlFor="minPrice">Min Price</label>
            <input
              className="remove-arrow relative"
              onChange={handleChange}
              type="number"
              name="minPrice"
              id="minPrice"
              placeholder="any"
              min={1000}
              max={1000000000}
              autoComplete="off"
              value={query.minPrice}
              defaultValue={query.minPrice}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  query.type === ""
                    ? 1000000000
                    : pricelimit[query.type as "buy" | "rent"].max,
                )
              }
            />
            <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-zinc-400 shadow-xl">
              {query.minPrice === "" || query.minPrice === "0"
                ? ""
                : formatPrice(Number(query.minPrice))}
            </span>
          </div>

          <div className="item relative col-span-2 md:col-span-1">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              className="remove-arrow relative"
              onChange={handleChange}
              type="number"
              name="maxPrice"
              id="maxPrice"
              placeholder="any"
              min={1000}
              max={1000000000}
              autoComplete="off"
              value={query.maxPrice}
              defaultValue={query.maxPrice}
              onKeyDown={(e) =>
                handleKeyDown(
                  e,
                  query.type === ""
                    ? 1000000000
                    : pricelimit[query.type as "buy" | "rent"].max,
                )
              }
            />
            <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-zinc-400 shadow-xl">
              {query.maxPrice === "" || query.maxPrice === "0"
                ? ""
                : formatPrice(Number(query.maxPrice))}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-5 flex h-12 min-w-[100px] flex-grow cursor-pointer items-center justify-center gap-5 rounded-md border-none bg-blue-600 px-6 text-lg text-gray-50"
        >
          <MagnifyingGlassIcon className="inline-block h-5 w-5" />
          <span className="inline-block">Search</span>
        </button>
      </form>
    </div>
  );
}
