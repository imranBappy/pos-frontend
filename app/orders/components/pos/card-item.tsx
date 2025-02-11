import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import Link from "next/link";

interface PROPS_TYPE {
    name: string;
    price: number;
    quantity: number;
    onPlusItem?: () => void
    discount?: number
    onMinusItem: () => void
}

const CardItem = ({ name, price, quantity, discount = 0, onPlusItem, onMinusItem }: PROPS_TYPE) => {
    return (
        <div className="flex justify-between items-center gap-1" >
            <div>
                <Link href='#' className=" block font-medium">{name}</Link>
                {
                    discount ? <div className='flex gap-2 items-center'>
                        <p className="text-sm text-muted-foreground ">{quantity} x {<span className='line-through'>${(price).toFixed(2)}</span>}</p>
                        <span>|</span>
                        <p className="text-sm  dark:text-gray-300  text-gray-500 ">{quantity} x ${(price - discount).toFixed(2)}</p>
                    </div> : <p className="text-sm   dark:text-gray-300 text-gray-500">{quantity} x ${(price - discount).toFixed(2)}</p>
                }
            </div>
            <div className='flex'>
                <div className='flex flex-col gap-[2px]'>
                    <Button onClick={onMinusItem} variant="destructive" className='hover:bg-red-500  rounded-none  h-5 hover:text-white' size="sm">
                        <Minus />
                    </Button>
                    <Button onClick={onPlusItem} variant="secondary" className='  hover:bg-green-700  rounded-none h-5 hover:text-white' size="sm">
                        <Plus />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CardItem;