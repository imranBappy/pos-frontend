import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Users, Table } from 'lucide-react';

interface PROPS_TYPE {
    name: string,
    onClick?: () => void,
    selected?: boolean,
    isBooked?: boolean,
    floor?: string | undefined
}

const TableCard = ({ name, floor, onClick, selected, isBooked }: PROPS_TYPE) => {
    function getBgColor() {
        if (isBooked) {
            return "bg-yellow-500/20";
        } else if (selected) {
            return "bg-blue-500/20";
        } else {
            return "bg-green-500/20";
        }
    }
    return (
        <Card
            onClick={onClick}
            className={cn("px-3 py-5 w-[200px]  h-36 cursor-pointer flex-col flex items-center justify-center gap-4 dark:hover:bg-slate-100/20 hover:bg-slate-100 ", getBgColor())}>
            <div className="flex items-center justify-between gap-5">

                {
                    isBooked ?
                        <div>
                            <Users width={30} height={30} />
                        </div>
                        : <div>
                            <Table width={30} height={30} />
                        </div>
                }


            </div>
            {/* Table Name and Floor Name */}
            <div className="flex flex-col items-center justify-center gap-1 ">
                <p className="text-muted-foreground text-xl">{floor}</p>
                <p className="text-muted-foreground text-lg">{name}</p>
            </div>
        </Card>
    );
};

export default TableCard;