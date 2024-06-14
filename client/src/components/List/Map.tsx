import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";
import { Estate, EstateRaw, useCityStore } from "../../lib";
import Pin from "./Pin";

export default function Map({ data }: { data: Estate[] | EstateRaw[] }) {
  const { city } = useCityStore();
  return (
    <MapContainer
      className="z-10 h-full w-full bg-zinc-900"
      center={
        city?.coordinates
          ? [city.coordinates.lat, city.coordinates.lon]
          : [parseFloat(data[0].latitude), parseFloat(data[0].longitude)]
      }
      zoom={10}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((estate) => (
        <Pin key={estate._id} estate={estate} />
      ))}
    </MapContainer>
  );
}
