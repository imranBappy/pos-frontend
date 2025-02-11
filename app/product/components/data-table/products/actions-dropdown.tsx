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
import { DELETE_PRODUCT_MUTATION, PRODUCT_TYPE, PRODUCTS_QUERY } from "@/graphql/product";
import { jsonToImages } from "@/lib/utils";
import { deleteImageFromS3 } from "@/lib/s3";

interface ActionsDropdownProps {
    item: PRODUCT_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
    const { toast } = useToast()
    const [deleteDelete, { loading }] = useMutation(DELETE_PRODUCT_MUTATION, {
        onCompleted: () => {
            toast({
                variant: "default",
                description: "Product Delete successfully!"
            })
        },
        refetchQueries: [{ query: PRODUCTS_QUERY }],
        awaitRefetchQueries: true
    })

    const handleDeleteProduct = async () => {
        await deleteDelete({
            variables: {
                id: item.id
            }
        })
        const deletedImage = item.images ? await jsonToImages(item.images) : []
        if (deletedImage.length) {
            const deletedPromises = deletedImage.map(async (prdImg: string) => await deleteImageFromS3(prdImg));
            await Promise.all(deletedPromises);
        }

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
                <DropdownMenuItem disabled={loading} onClick={handleDeleteProduct} className="text-red-600 cursor-pointer ">
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>
                    <Link className="w-full" href={`/product/${item.id}`}>Edit</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 