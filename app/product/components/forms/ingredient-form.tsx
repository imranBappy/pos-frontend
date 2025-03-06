"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { OPTION_TYPE } from "@/components/input/switch-item"
import {
    Loading,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui"

import { ITEMS_QUERY } from "@/graphql/item/queries"
import { ITEM_TYPE } from "@/graphql/item/types"
import useStore from "@/stores"
import { SUPPLIER_INVOICE_ITEM_TYPE } from "@/graphql/supplier-invoice/types"
import { useRouter } from "next/navigation"
import ItemAddForm from "@/app/(inventory)/components/forms/item-add-form"
import Button from "@/components/button"
import { DELETE_INGREDIENT, INGREDIENT_MUTATION, INGREDIENT_QUERY, INGREDIENTS_QUERY } from "@/graphql/product"
import { ITEMS_TYPE } from "@/stores/slices"

const invoiceFormSchema = z.object({
    supplier: z.string().optional(),
    invoiceImage: z.instanceof(File).optional(),
})

type InvoiceFormSchema = z.infer<typeof invoiceFormSchema>

export function IngredientForm({ productId }: { productId?: string }) {

    const selectedItems = useStore((store) => store.items)
    const addItems = useStore((store) => store.addItems)
    const clearItems = useStore((store) => store.clearItems)

    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<InvoiceFormSchema>({
        resolver: zodResolver(invoiceFormSchema),
    })

    const { data: ingredientsRes, loading: ingredientsQueryLoading } = useQuery(INGREDIENTS_QUERY, {
        variables: { product: productId },
        onCompleted: (res) => {
            const newItems: ITEMS_TYPE = new Map()
            const ingredients = res?.ingredients?.edges;
            ingredients.forEach(({ node }: { node: INGREDIENT_QUERY }) => {
                newItems.set(node.item.id, { id: node.id, quantity: node.quantity, price: 0, vat:0 })
            })
            addItems(newItems)
        },
        skip: !productId
    });




    // ingredient Mutation
    const [ingredientMutation, { loading: itemCreate_loading }] = useMutation(INGREDIENT_MUTATION)

    // delete ingredient item
    const [deleteInvoiceItem, { loading: deleteInvoiceItemMutationLoading }] = useMutation(DELETE_INGREDIENT)

    // all item query
    const { data, loading } = useQuery(ITEMS_QUERY, {
        variables: { first: 100 },
    });
    const items: OPTION_TYPE[] = data?.items?.edges?.map(({ node }: { node: ITEM_TYPE }) => ({
        value: node.id,
        label: node.name,
        unit: node.unit?.name
    })) || [];


    async function onSubmit() {
        try {
            if (!productId) {
                form.setError('supplier', { message: "Product is not found." })
                return;
            }
            if (!selectedItems.size) {
                toast({ description: "Add Minimum 1 item", variant: 'destructive' })
                return
            }
            // validation purchase items
            for (const [, value] of selectedItems) {
                if (value.quantity < 0) {
                    toast({ description: "Quantity have to be more then 0", variant: 'destructive' })
                    return
                }
                // if (value.price < 1) {
                //     toast({ description: "Price can not be less 0", variant: 'destructive' })
                //     return
                // }
            }

            // ingredient query
            for (const [id, value] of selectedItems) {
                const itemVariable = {
                    id: value.id ? value.id : undefined,
                    item: id,
                    quantity: `${value.quantity}`,
                    product: productId,
                };
                await ingredientMutation({ variables: itemVariable })
            }

            // the delete existing invoice item
            if (productId) {
                const invoiceItemsDelete: string[] = []
                ingredientsRes?.ingredients?.edges?.forEach(({ node }: { node: SUPPLIER_INVOICE_ITEM_TYPE }) => {
                    if (!selectedItems.get(`${node.item.id}`)) {
                        invoiceItemsDelete.push(node.id)
                    }
                })
                await Promise.all(invoiceItemsDelete.map((itemId) => deleteInvoiceItem({
                    variables: {
                        id: itemId,
                    },
                })))
            }

            toast({
                title: "Success",
                description: "Ingredient added successfully",
            })

            clearItems()

            if (productId) {
                router.push('/product')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }



    const isLoading = loading || ingredientsQueryLoading
    if (isLoading) return <Loading />

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        {
                            productId ? "Update Ingredients" : "Add Ingredients"
                        }
                    </CardTitle>
                    <CardDescription>
                        {
                            productId ? "Update ingredients" : "Add  new ingredients "
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <ItemAddForm items={items} isForProduct={true} />

                    <Button onClick={onSubmit} isLoading={deleteInvoiceItemMutationLoading || itemCreate_loading}>
                        Submit
                    </Button>

                </CardContent>
            </Card>
        </div>
    )
}
export default IngredientForm