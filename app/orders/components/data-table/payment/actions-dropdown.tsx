
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ORDER_TYPE } from "@/graphql/product"
import Link from "next/link";
import PaymentModal from "../../order-payment/payment-modal";

interface ActionsDropdownProps {
    item: ORDER_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
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
                <DropdownMenuItem>
                    <Link className="w-full" href={`/orders/${item.id}`}>View details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    {/* <Link className="w-full" href={`/orders/${item.id}/payment`}>Payment</Link> */}
                    <PaymentModal
                        variant="outline"
                        openBtnName="Payment"
                        orderId={item.id}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 