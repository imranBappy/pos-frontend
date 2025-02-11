import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from "next/link";

interface PROPS_TYPE{
    name: string;
    price: number;
    quantity: number;
    onRemove?: () => void           
}

const CardItem = ({ name, price, quantity, onRemove     }: PROPS_TYPE) => {
    return (
        <div className="flex justify-between items-center gap-1" >
            <div>
                <Link href='#' className=" block font-medium">{name}</Link>
                <p className="text-sm text-muted-foreground">{quantity} x ${price}</p>
            </div>
            <Button onClick={onRemove} variant="secondary" className='hover:bg-red-500 hover:text-white'  size="sm">
                <X />
            </Button>
        </div>
    );
};

export default CardItem;