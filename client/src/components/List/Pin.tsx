import { Marker, Popup } from "react-leaflet";
import { Estate, EstateRaw } from "../../lib";
import { Link } from "react-router-dom";

export default function Pin({ estate }: { estate: Estate | EstateRaw }) {
  return (
    <Marker
      position={[parseFloat(estate.latitude), parseFloat(estate.longitude)]}
    >
      <Popup>
        <div className="popupContainer flex min-w-60 gap-5">
          <img
            className=" h-[48px] w-[60px] rounded-md object-cover"
            src={estate.images[0]}
            alt={estate.title}
          />

          <div className="textContainer flex flex-col justify-between whitespace-normal text-wrap">
            <Link to={`/estate/${estate._id}`}>{estate.title}</Link>
            <span>{estate.bedroom} bedroom</span>
            <b>$ {estate.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
