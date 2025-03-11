
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
import { useMutation } from "@apollo/client";
import { WASTE_TYPE } from "@/graphql/waste/types";
import { DELETE_WASTE } from "@/graphql/waste/mutations";
import { WASTES_QUERY } from "@/graphql/waste/queries";

interface ActionsDropdownProps {
    item: WASTE_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
    const { toast } = useToast()
    const [deleteSupplier, { loading }] = useMutation(DELETE_WASTE, {
        refetchQueries: [
            {
                query: WASTES_QUERY,
                variables: {
                    offset: 0,
                    first: 10,
                },
            },
        ],
        awaitRefetchQueries: true,
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
                    Delete Waste
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 