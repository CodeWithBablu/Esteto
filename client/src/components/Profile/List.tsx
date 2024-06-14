import { Estate, EstateRaw } from "@/lib";
import Card from "../common/Card";

export default function List({
  listData,
  btnDisabled,
}: {
  listData: Estate[] | EstateRaw[];
  btnDisabled: boolean;
}) {
  return (
    <div className="list mb-10 flex flex-col items-center gap-10">
      {listData.map((item) => (
        <Card key={item._id} item={item} btnDisabled={btnDisabled} />
      ))}
    </div>
  );
}
