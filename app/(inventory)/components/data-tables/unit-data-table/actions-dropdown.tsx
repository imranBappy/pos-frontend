
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
import { UNIT_TYPE } from "@/graphql/unit/types";
import { DELETE_UNIT_MUTATION } from "@/graphql/unit/mutations";
import { useMutation } from "@apollo/client";
import { UNITS_QUERY } from "@/graphql/unit/queries";

interface ActionsDropdownProps {
    unit: UNIT_TYPE;
}

export function ActionsDropdown({ unit }: ActionsDropdownProps) {
    const { toast } = useToast()
    const [deleteUnit, { loading }] = useMutation(DELETE_UNIT_MUTATION, {
        refetchQueries: [{
            query: UNITS_QUERY, variables: {
                offset: 0,
                first: 10,
            }
        }],
        awaitRefetchQueries: true
    });

    const handleDeleteUnit = async (unitId: string) => {
        try {
            const { data } = await deleteUnit({ variables: { id: unitId } });
            if (data.deleteUnit.success) {
                console.log("Unit deleted:", unitId);
                toast({
                    variant: "default",
                    description: "Deleted Successfully!"
                })
            } else {
                toast({
                    variant: "destructive",
                    description: "Error deleting unit"
                })
            }
        } catch {
            toast({
                variant: "destructive",
                description: "Error deleting unit"
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
                <DropdownMenuItem disabled={loading} onClick={() => handleDeleteUnit(unit.id)}>
                    Delete Unit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href={`/units/${unit.id}`}>Edit Unit</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 