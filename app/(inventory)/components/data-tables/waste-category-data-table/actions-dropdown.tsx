
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ITEM_CATEGORY_TYPE } from "@/graphql/item-category/types";

interface ActionsDropdownProps {
    item: ITEM_CATEGORY_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
    // const { toast } = useToast()

    // const handleDelete = () => {

    //     toast({
    //         variant: "default",
    //         description: "Email Coppied!"
    //     })
    // }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {/* <DropdownMenuItem onClick={handleDelete}>
                    Delete Unit
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`/wastes/categories/${item.id}`}>
                        Edit Category
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 