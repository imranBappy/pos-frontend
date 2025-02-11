import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Users } from 'lucide-react';

interface PROPS_TYPE {
    image: string,
    name: string,
    price: number,
    onClick?: () => void,
    selected?: boolean
}

const ProductCard = ({ name, price, onClick, selected }: PROPS_TYPE) => {
    return (
        <Card
            onClick={onClick}
            className={cn("p-3 w-[200px] h-32 cursor-pointer flex items-center justify-center gap-4 dark:hover:bg-slate-100/20 hover:bg-slate-100 ", selected && "dark:bg-slate-100/20 bg-slate-100")}>
            <Users />
            <Link href={"#"} className="line-clamp-1  block font-medium mt-1">
                <p className="line-clamp-2">{name}</p>
            </Link>
            <p className="text-sm text-muted-foreground">${price.toFixed(2)}</p>
        </Card>
    );
};

export default ProductCard;