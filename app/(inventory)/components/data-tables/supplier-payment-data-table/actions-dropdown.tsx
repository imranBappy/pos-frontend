
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
import { useMutation } from "@apollo/client";
import { DELETE_SUPPLIER_MUTATION } from "@/graphql/supplier/mutations";
import { SUPPLIERS_QUERY } from "@/graphql/supplier/queries";
import { SUPPLIER_PAYMENT_TYPE } from "@/graphql/supplier-payment/types";

interface ActionsDropdownProps {
    item: SUPPLIER_PAYMENT_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
    const { toast } = useToast()
    const [deleteSupplier, { loading }] = useMutation(DELETE_SUPPLIER_MUTATION, {
        refetchQueries: [{
            query: SUPPLIERS_QUERY,
            variables: {
                offset: 0,
                first: 10,
            }
        }],
        awaitRefetchQueries: true
    });

    const handleDeleteSupplier = async (supplierId: string) => {
        try {
            const { data } = await deleteSupplier({ variables: { id: supplierId } });
            if (data.deleteSupplier.success) {
                toast({
                    variant: "default",
                    description: "Supplier deleted!"
                })
            } else {
                toast({
                    variant: "destructive",
                    description: "Error deleting supplier"
                });
            }
        } catch {
            toast({
                variant: "destructive",
                description: "Error deleting supplier"
            })
        }
    };

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
                <DropdownMenuItem disabled={loading} onClick={() => handleDeleteSupplier(item.id)}>
                    Delete Supplier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`/suppliers/${item.id}`}>Edit Supplier</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 