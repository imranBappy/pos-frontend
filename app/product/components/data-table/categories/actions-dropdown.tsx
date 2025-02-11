
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

import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { CATEGORY_TYPE } from "@/graphql/product";

interface ActionsDropdownProps {
    item: CATEGORY_TYPE;
}

export function ActionsDropdown({  item }: ActionsDropdownProps) {
    const { toast } = useToast()

    const handleUserIdCopy = () => {

        navigator.clipboard.writeText(item.id)
        toast({
            variant: "default",
            description: "Email Coppied!"
        })
    }
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
                <DropdownMenuItem onClick={handleUserIdCopy}>
                    Copy ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className="w-full" href={`/product/category/${item.id}`}>Edit</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 