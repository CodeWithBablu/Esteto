import { City, handleKeyDown, toastMessage, useCityStore } from "@/lib";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlaceModal from "../common/PlaceModal";
import { formatPrice, pricelimit } from "@/lib/utils";

const types = ["rent", "buy"];

interface IFormInput {
  type: "buy" | "rent";
  minPrice: string;
  maxPrice: string;
}

export default function Searchbar() {
  const [query, setQuery] = useState<IFormInput>({
    type: "rent",
    minPrice: "1000",
    maxPrice: "2000000",
  });

  const [city, setCity] = useState<City | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { setCityState } = useCityStore();

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setQuery((prev) => ({
      ...prev,
      minPrice: pricelimit[query.type].min.toFixed(0),
      maxPrice: pricelimit[query.type].max.toFixed(0),
      [e.target.name]: e.target.value,
    }));
  };

  const switchType = (val: string) => {
    setQuery((prev) => ({
      ...prev,
      type: val as "buy" | "rent",
      minPrice: pricelimit[val as "buy" | "rent"].min.toFixed(0),
      maxPrice: pricelimit[val as "buy" | "rent"].max.toFixed(0),
    }));
    if (formRef.current) formRef.current.reset();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: IFormInput = {
      type: query.type,
      minPrice:
        (query.minPrice as string) === ""
          ? pricelimit[query.type].min.toFixed(0)
          : query.minPrice,
      maxPrice:
        (query.maxPrice as string) === ""
          ? pricelimit[query.type].max.toFixed(0)
          : query.maxPrice,
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
      `/list?city=${city.city}&type=${data.type}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}&lat=${city ? city.coordinates.lat : ""}&lon=${city ? city.coordinates.lon : ""}`,
    );
  };

  return (
    <div className="searchbar font-poppins font-medium">
      <div className="type mb-2 flex w-fit gap-2 rounded-2xl bg-gray-100 p-2 text-lg shadow-md">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`cursor-pointer rounded-2xl px-8 py-4 capitalize transition-all duration-[0.5s] ease-linear ${type === query.type ? " bg-zinc-900 text-gray-100 ring-2 ring-zinc-700 ring-offset-2" : " text-zinc-900"}`}
          >
            {type}
          </button>
        ))}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        action="POST"
        className="flex h-auto flex-col justify-between gap-3 overflow-hidden rounded-md border-zinc-500 md:h-16 md:flex-row md:border"
      >
        <PlaceModal type="city" data={city} setData={setCity} />

        <div className="relative h-full">
          <input
            onChange={handleChange}
            className=" remove-arrow h-full w-full rounded-md border bg-transparent px-3 py-3 outline-none focus:border-blue-600 md:w-[140px] md:border-none xl:w-[180px]"
            type="number"
            name="minPrice"
            id="minPrice"
            min={1000}
            max={pricelimit[query.type].max}
            onKeyDown={(e) => handleKeyDown(e, pricelimit[query.type].max)}
            placeholder="Min Price"
          />
          <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2  font-medium text-blue-300 shadow-xl">
            {query.minPrice === "" || query.minPrice === "0"
              ? ""
              : formatPrice(Number(query.minPrice))}
          </span>
        </div>

        <div className="relative h-full">
          <input
            onChange={handleChange}
            className=" remove-arrow relative h-full w-full rounded-md border bg-transparent px-3 py-3 outline-none focus:border-blue-600 md:w-[140px] md:border-none xl:w-[180px]"
            type="number"
            name="maxPrice"
            id="maxPrice"
            min={1000}
            max={pricelimit[query.type].max}
            onKeyDown={(e) => handleKeyDown(e, pricelimit[query.type].max)}
            placeholder="Max Price"
          />
          <span className="absolute bottom-[1px] right-[1px] flex h-5 items-center rounded-l-[5px] border-none px-2 font-medium text-blue-300 shadow-xl">
            {query.maxPrice === "" || query.maxPrice === "0"
              ? ""
              : formatPrice(Number(query.maxPrice))}
          </span>
        </div>

        <button
          type="submit"
          className="flex h-14 w-full cursor-pointer items-center justify-center gap-5 rounded-md border-none bg-blue-600 text-xl text-gray-100 md:h-16 md:w-16 md:gap-0"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
          <span className="inline-block md:hidden">Search</span>
        </button>
      </form>
    </div>
  );
}
