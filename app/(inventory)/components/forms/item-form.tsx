"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { useMutation, useQuery } from '@apollo/client'
import { useToast } from "@/hooks/use-toast"
import { OPTION_TYPE, SwitchItem, TextField } from "@/components/input"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"
import { ITEM_MUTATION } from "@/graphql/item/mutations"
import { ITEM_QUERY, ITEMS_QUERY } from "@/graphql/item/queries"
import { Separator } from "@radix-ui/react-separator"
import { ITEM_CATEGORY_TYPE } from "@/graphql/item-category/types"
import { ITEM_CATEGORES_QUERY } from "@/graphql/item-category/queries"
import { UNIT_TYPE } from "@/graphql/unit/types"
import { UNITS_QUERY } from "@/graphql/unit/queries"

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    category: z.string().optional(),
    unit: z.string(),
    alertStock: z.string().min(1, {
        message: "Alert quantity is required.",
    }),
    sku: z.string().min(1, {
        message: "SKU is required.",
    }),
})

export function ItemForm({ itemId }: { itemId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [itemMutation, { loading }] = useMutation(ITEM_MUTATION, {
        onCompleted: async () => {
            toast({
                variant: 'default',
                description: "Success!",
            })
            form.reset()
            router.push('/items')
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
            query: ITEMS_QUERY,
            variables: {
                offset: 0,
                first: 10,
                search: null,
                alertStock: null,
                stock: 0,
                price: null,
                category: null
            }
        }],
    })

    useQuery(ITEM_QUERY, {
        variables: {
            id: itemId,
        },
        onCompleted: (data) => {
            form.setValue("name", data.item.name)
            form.setValue("category", data.item.category?.id)
            form.setValue("unit", data.item.unit?.id)
            form.setValue("alertStock", String(data.item.alertStock))
            form.setValue("sku", data.item.sku)
        },
        skip: !itemId,
    })

    const { loading: category_loading, data: category_res } = useQuery(ITEM_CATEGORES_QUERY, {

        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );

    const itemCategories: OPTION_TYPE[] = category_res?.itemCategories?.edges?.map(({ node }: { node: ITEM_CATEGORY_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];

    const { loading: unit_loading, data: unit_res } = useQuery(UNITS_QUERY, {

        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );



    const units_options: OPTION_TYPE[] = unit_res?.units?.edges?.map(({ node }: { node: UNIT_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];


    async function onSubmit(data: z.infer<typeof formSchema>) {
        await itemMutation({
            variables: {
                id: itemId,
                name: data.name,
                category: data.category,
                unit: data.unit,
                alertStock: Number(data.alertStock),
                sku: data.sku,

            },
        })
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                    <Card className="border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl">{itemId ? "Update Item" : "Create New Item"}</CardTitle>
                            <CardDescription>
                                {itemId ? "Update the item information below." : "Enter the item information below."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold">Basic Information</h3>

                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <TextField
                                        form={form}
                                        name="name"
                                        label="Item Name"
                                        placeholder="Enter product name"
                                    />
                                    <TextField
                                        form={form}
                                        name="sku"
                                        label="SKU"
                                        placeholder="Enter SKU"
                                    />
                                    <TextField
                                        form={form}
                                        name="alertStock"
                                        label="Alert Stock"
                                        placeholder="Enter alert stock"
                                        type="number"
                                    />
                                </div>

                            </div>



                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Category & Unit</h3>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SwitchItem
                                        disabled={category_loading}
                                        form={form}
                                        name="category"
                                        label="Category"
                                        options={itemCategories}
                                        placeholder="Select category"
                                    />
                                    <SwitchItem
                                        disabled={unit_loading}
                                        form={form}
                                        name="unit"
                                        label="Unit"
                                        options={units_options}
                                        placeholder="Select category"
                                    />
                                </div>
                            </div>
                            <Button type="submit" isLoading={loading} >
                                {
                                    itemId ? "Update Item" : "Create Item"
                                }
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}

export default ItemForm