import { Dialog } from "@radix-ui/themes";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";
import clsx from "clsx";
import {
  Address,
  City,
  Country,
  GeoJSONFeature,
  toastMessage,
  useCityStore,
} from "@/lib";

interface Props<T> {
  type: "country" | "city" | "place";
  data: T | null;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export default function PlaceModal<T extends Country | City | Address>({
  type,
  data,
  setData,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<T[] | GeoJSONFeature[] | []>([]);

  const { city, setCityState } = useCityStore();

  const handleSearch = useDebouncedCallback(async (term: string) => {
    let query = "";
    if (type === "country")
      query = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/countries-codes/records?select=iso2_code%20as%20iso2%2C%20geo_point_2d%20as%20coordinates%2C%20%20label_en%20as%20country&where=search%28country%2C%22${term.toLowerCase()}%22%29%20AND%20coordinates%20is%20not%20null&limit=20&offset=0&lang=en&timezone=UTC&include_links=false&include_app_metas=false`;

    if (type === "place")
      query = `https://api.mapbox.com/search/geocode/v6/forward?q=${term}&country=in&proximity=ip&language=en&autocomplete=true&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`;

    if (type === "city")
      query = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?select=name%20as%20city%2C%20coordinates%2C%20country_code%20as%20country&where=search%28city%2C%22${term.toLowerCase()}%22%29%20AND%20country%20%3D%22IN%22%20AND%20coordinates%20is%20not%20null&limit=20&offset=0&lang=en&timezone=UTC&include_links=false&include_app_metas=false`;

    const res = await axios.get(query);
    if (type === "place") {
      if (res.data.features) {
        if (!city)
          return toastMessage(
            "alert",
            "select city to start your search",
            4000,
          );
        const pattern = term.split("").join("\\s*"); // \\s* account for zero or more spaces
        const regex = new RegExp(pattern, "i");

        const features = res.data.features as GeoJSONFeature[];

        const res1 = features.filter((place: GeoJSONFeature) =>
          regex.test(place.properties.context.district.name.toLowerCase()),
        );
        const res2 = features.filter((place: GeoJSONFeature) =>
          place.properties.context.district.name
            .toLowerCase()
            .includes(city.city.toLowerCase()),
        );
        const updatedResponse = [...res1, ...res2];
        setResponse(updatedResponse);
      }
    } else {
      if (res.data.results) setResponse(res.data.results);
    }
  }, 500);

  const handleClick = (data: T | GeoJSONFeature) => {
    if (type === "place") {
      const updatedData = {
        place: (data as GeoJSONFeature).properties.full_address,
        city: (
          data as GeoJSONFeature
        ).properties.context.district.name.toLowerCase(),
        latitude: (data as GeoJSONFeature).geometry.coordinates[1],
        longitude: (data as GeoJSONFeature).geometry.coordinates[0],
      };
      setData(updatedData as T);
    } else {
      if (type === "city") {
        setCityState(data as City);
      }
      setData(data as T);
    }
    setResponse([]);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <div
      className={clsx({
        "h-full": type !== "place",
        "absolute left-0 right-0 top-5 z-10 m-auto h-14 w-[95%] sm:left-5 sm:right-auto sm:w-80":
          type === "place",
      })}
    >
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Trigger>
          <div className="h-full">
            {type === "country" && (
              <label htmlFor="country">
                {type === "country" && "Country"}
                <span className="text-rose-500">*</span>
              </label>
            )}
            <input
              id="place"
              readOnly
              value={
                data
                  ? type === "place"
                    ? (data as Address).place
                    : (data as City).city
                  : type === "place"
                    ? "Search location"
                    : "City Location"
              }
              name="place"
              type="text"
              className={clsx("w-full select-none placeholder-gray-400", {
                "h-14 rounded-lg bg-zinc-950/80 px-6 text-lg text-gray-100 outline-none backdrop-blur-sm":
                  type === "place",
                "h-full w-full rounded-md border bg-transparent px-3 py-3 outline-none focus:border-blue-600 md:w-[200px] md:border-none":
                  type === "city",
                "text-gray-400": !data,
                "text-zinc-800": data && type !== "place",
                "text-gray-100": data && type === "place",
              })}
              placeholder={
                type === "place" ? "Search location" : "City Location"
              }
              autoComplete="off"
            />
          </div>
        </Dialog.Trigger>

        <Dialog.Content className=" relative w-[95%] max-w-[600px] bg-zinc-950/80 p-3 backdrop-blur-md sm:w-[450px]">
          <input
            id="search"
            onChange={(e) => handleSearch(e.target.value)}
            className="z-10 h-14 w-full rounded-lg border-2 border-zinc-700 bg-zinc-800 px-6 text-gray-100 outline-none focus:border-indigo-500"
            placeholder="search location"
            autoComplete="off"
            type="text"
          />

          <div className=" mt-2 flex max-h-[30dvh] w-full flex-col gap-2 overflow-y-scroll font-poppins ">
            {response.length === 0 && (
              <>
                <span className="my-3 text-indigo-400">*Nothing to show</span>
              </>
            )}
            {response.length > 0 && (
              <>
                {response.map((item: T | GeoJSONFeature, index) => (
                  <div
                    className="cursor-pointer rounded-md py-1 pl-6 text-gray-100 hover:bg-blue-500"
                    key={index}
                    onClick={() => handleClick(item)}
                  >
                    {type === "place" && (
                      <div className="flex w-full flex-col gap-1 border-b-[1px] border-gray-600 pb-1">
                        <h2 className="font-medium">
                          {(item as GeoJSONFeature).properties.name}
                        </h2>
                        <h3 className="text-gray-200">
                          {(item as GeoJSONFeature).properties.full_address}
                        </h3>
                      </div>
                    )}
                    {type !== "place" && type === "country"
                      ? `${(item as Country).country} (${(item as Country).iso2}) `
                      : (item as City).city}
                  </div>
                ))}
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
