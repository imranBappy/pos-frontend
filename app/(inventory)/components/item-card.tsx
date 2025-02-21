import { Card } from "@/components/ui";
import Image from "@/components/ui/image";
import { ITEM_TYPE } from "@/graphql/item/types";
import { cn, itemStockStatus } from "@/lib/utils";
import Link from "next/link";
import { getThumblain } from '@/lib/utils';
import ItemStockStatus from "@/components/item-stock-status";
interface PROPS_TYPE {
    selected?: boolean
    onClick?: () => void,
    item:ITEM_TYPE
}

const ItemCard = ({  onClick, selected, item }: PROPS_TYPE) => {
    const {
        image="",
        name,
        stock,
        unit,
        safetyStock,
        currentStock
    }:ITEM_TYPE  = item
 
    
    return (
        <Card
            onClick={onClick}
            className={cn(
                'p-3 w-[150px] cursor-pointer dark:hover:bg-slate-100/20 hover:bg-slate-100 ',
                selected && 'dark:bg-slate-100/20 bg-slate-100'
            )}
        >
            <Image
                src={getThumblain(image || '')}
                className="rounded-lg"
                width={200}
                height={200}
                alt={name || 'Product image'}
            />
            <Link href={'#'} className="line-clamp-1  block font-medium mt-1">
                <p className="line-clamp-2  ">{name}</p>
            </Link>
            <p className="text-sm text-muted-foreground flex  gap-2 items-center">
                {' '}
                <span>{`${stock} ${unit.name}`}</span>
                <ItemStockStatus
                    status={itemStockStatus(currentStock, safetyStock)}
                />
            </p>
        </Card>
    );
};

export default ItemCard;