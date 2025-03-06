import { Button } from "@/components/ui/button";
import useStore from "@/stores";
import { Minus, Plus} from "lucide-react";
import Link from "next/link";

interface PROPS_TYPE {
  id:string
}

const OrderCartItem = ({id}: PROPS_TYPE) => {
  const addItem = useStore((store) => store.addItem);
  const removeItem = useStore((store) => store.removeItem);
  const selectedItems = useStore((store) => store.items);
  const { name, price, quantity, vat } = selectedItems.get(id) || {};

  const handleClick = (value:number) => {
    if (value <= 0) {
      removeItem(id);
      return;
    }
    addItem(id, value, price || 1, undefined, name, vat || 0);
  }
  
  return (
      <div className="flex justify-between items-center gap-1">
          <div>
              <Link href="#" className=" block font-medium">
                  {name}
              </Link>
              <p className="text-sm   dark:text-gray-300 text-gray-500">
                  Quantity: {quantity}
              </p>
          </div>
          <div className="flex">
              <div className="flex">
                  <div className="flex flex-col gap-[2px]">
                      <Button
                          onClick={() => handleClick((quantity || 1) - 1)}
                          variant="destructive"
                          className="hover:bg-red-500  rounded-none  h-5 hover:text-white"
                          size="sm"
                      >
                          <Minus />
                      </Button>
                      <Button
                          onClick={() => handleClick((quantity || 1) + 1)}
                          variant="secondary"
                          className="  hover:bg-green-700  rounded-none h-5 hover:text-white"
                          size="sm"
                      >
                          <Plus />
                      </Button>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default OrderCartItem;
