import { Input } from "@/components/ui";
import { Button } from "@/components/ui/button";
import useStore from "@/stores";
import { X } from "lucide-react";
import Link from "next/link";

interface PROPS_TYPE {
  id:string
}

const OrderCartItem = ({id}: PROPS_TYPE) => {
  const addItem = useStore((store) => store.addItem);
  const remoteItem = useStore((store) => store.removeItem);
  const selectedItems = useStore((store) => store.items);
  const { name, price, quantity, vat } = selectedItems.get(id) || {};

  
  return (
    <div className="flex justify-between items-center gap-1">
      <div>
        <Link href="#" className=" block font-medium">
          {name}
        </Link>
        <p className="text-sm   dark:text-gray-300 text-gray-500 w-52 flex  ">
          <Input
            className="px-2 text-center  !py-0 h-5 border-none rounded-none w-12"
            id={`quantity-${id}`}
            onChange={(e) => {
              addItem(
                id,
                Number(e.target.value),
                price || 1,
                undefined,
                name,
                vat || 0
              );
            }}
            value={selectedItems.get(id)?.quantity || ""}
            disabled={selectedItems.get(id) === undefined}
            type="number"
            min={1}
            placeholder="Quantity"
            name="quantity"
          />
          <span className=" w-10 flex items-center">
            <X size={16} /> <span className=" ml-3 text-sm">$</span>{" "}
          </span>
          <Input
            className="p-0 !py-0 h-5 border-none rounded-none w-20"
            size={1}
            onChange={(e) =>
              addItem(
                id,
                quantity || 1,
                Number(e.target.value),
                undefined,
                name,
                vat || 0
              )
            }
            value={selectedItems.get(id)?.price || ""}
            min={1}
          />
        </p>
      </div>
      <div className="flex">
        <div className="flex flex-col gap-[2px]">
          <Button
            onClick={() => remoteItem(id)}
            variant="destructive"
            className="hover:bg-red-500  rounded   hover:text-white"
            size="sm"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCartItem;
