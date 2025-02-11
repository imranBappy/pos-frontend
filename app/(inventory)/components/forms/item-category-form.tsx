"use client"
import {
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
import { TextareaField, TextField } from "@/components/input"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"
import { ITEM_CATEGORY_QUERY } from "@/graphql/item-category/queries"
import { ITEM_CATEGORY_MUTATION } from "@/graphql/item-category/mutations"

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    image: z.string().url({
        message: "Invalid image URL.",
    }).optional(),
    description: z.string().optional(),
})

function ItemCategoryForm({ itemCategoryId }: { itemCategoryId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [itemCategoryMutation, { loading }] = useMutation(ITEM_CATEGORY_MUTATION, {
        onCompleted: async () => {
            toast({
                variant: 'default',
                description: "Success!",
            })
            form.reset()
            router.push('/item-categories')
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
    })

    useQuery(ITEM_CATEGORY_QUERY, {
        variables: {
            id: itemCategoryId,
        },
        onCompleted: (data) => {
            form.setValue("name", data.itemCategory.name)
            form.setValue("description", data.itemCategory.description)
        },
        skip: !itemCategoryId,
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await itemCategoryMutation({
            variables: {
                id: itemCategoryId,
                name: data.name,
                image: data.image,
                description: data.description,
            },
        })
    }

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl">{itemCategoryId ? "Update Item Category" : "Create New Item Category"}</CardTitle>
                <CardDescription>
                    {itemCategoryId ? "Update the item category information below." : "Enter the item category information below."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField
                                form={form}
                                name="name"
                                label="Name"
                                placeholder="Item Category Name"
                            />
                            <TextareaField
                                form={form}
                                name="description"
                                label="Description"
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <Button className="w-[150px]" isLoading={loading}>
                                {itemCategoryId ? "Update Item Category" : "Create Item Category"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    )
}

export default ItemCategoryForm
