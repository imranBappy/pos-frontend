"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY, CATEGORY_MUTATION, CATEGORY_QUERY } from "@/graphql/product"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Loading,
    Input,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@/components/ui"
import { TextField } from "@/components/input/text-field"
import Button from "@/components/button"
import ItemAddForm from "./item-add-form"
import { ITEMS_QUERY } from "@/graphql/item/queries"
import { ITEM_TYPE } from "@/graphql/item/types"
import { SUPPLIERS_QUERY } from "@/graphql/supplier/queries"
import { SUPPLIER_TYPE } from "@/graphql/supplier/types"
import useStore from "@/stores"

const productFormSchema = z.object({
    invoiceNumber: z.string().min(2, "Name must be at least 2 characters"),
    amount: z.string(),
    supplier: z.string().optional(),
    image: z.instanceof(File).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function SupplierInvoiceForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const selectedItems = useStore((store) => store.items)
    const [createCategory, { loading: create_loading }] = useMutation(CATEGORY_MUTATION, {
        refetchQueries: [{
            query: CATEGORIES_QUERY, variables: {
                offset: 0,
                first: 10,
                search: ""
            }
        }],
        awaitRefetchQueries: true
    })
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),

    })
    const { loading: supplier_loading, data: res, } = useQuery(SUPPLIERS_QUERY, {
        variables: {
            first: 100,
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );

    const suppliers: OPTION_TYPE[] = res?.suppliers?.edges?.map(({ node }: { node: SUPPLIER_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];

    const { loading: category_loading, data: category_res } = useQuery(CATEGORY_QUERY, {
        variables: { id },
        skip: !id,
        onCompleted: (data) => {
            const category = {
                ...data.category,
                parent: data.category.parent?.id || '',
                image: undefined
            }
            setImagePreviewUrl(data.category.image || "")
            form.reset(category);
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(imagePreviewUrl)
        }
    }, [imagePreviewUrl])

    async function onSubmit(data: ProductFormValues) {
        try {

            // validation parchage items
            for (const [, value] of selectedItems) {
                if (value.quantity < 1) {
                    toast({ description: "Quantity can not be less 1", variant: 'destructive' })
                    return
                }
                if (value.price < 1) {
                    toast({ description: "Price can not be less 0", variant: 'destructive' })
                    return
                }
            }

            let uploadedFiles: string | undefined = undefined;

            if (data.image && category_res?.category?.image) {
                // delete old image
                const deleted = await deleteImageFromS3(category_res.category.image)
                if (!deleted) throw new Error("Failed to delete image")
            }
            if (data.image) {
                uploadedFiles = await uploadImageToS3(data.image)
                if (!uploadedFiles) throw new Error("Failed to upload image")
            }

            await createCategory({
                variables: {
                    ...data,
                    image: uploadedFiles,
                    id: id || undefined,
                    supplier: data.supplier || undefined
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                invoiceNumber: "",
                amount: "",
                supplier: "",
                image: undefined
            })

            setImagePreviewUrl("")
            router.push(`/product/category/`)

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue("image", e.target.files?.[0])
        if (e.target.files?.[0]) {
            setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]))
        }
    }
    const { data, loading } = useQuery(ITEMS_QUERY, {
        variables: {
            first: 100,
        },
    }
    );
    const items: OPTION_TYPE[] = data?.items?.edges?.map(({ node }: { node: ITEM_TYPE }) => ({
        value: node.id,
        label: node.name,
    })) || [];



    if (supplier_loading || category_loading || loading) return <Loading />


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {
                                id ? "Update " : "Create "
                            }
                        </CardTitle>
                        <CardDescription>
                            {
                                id ? "Update" : "Add a new category to your inventory"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField form={form} name="invoiceNumber" label="Invoice Number" placeholder="Enter invoice number" />
                                <TextField form={form} name="amount" label="Amount" placeholder="Enter amount" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SwitchItem
                                    disabled={supplier_loading || Boolean(form.watch('image'))}
                                    form={form}
                                    name="supplier"
                                    label="Supplier"
                                    options={suppliers}
                                    placeholder="Select supplier"
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={!!form.watch('supplier')}
                                                    {...field}
                                                    value=""
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleImageChange(e)
                                                    }}
                                                    className="flex items-center justify-center h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {imagePreviewUrl && (
                                                <div className="grid grid-cols-4 gap-4 mt-4">
                                                    <div className="relative aspect-square">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            src={imagePreviewUrl}
                                                            alt={`Preview`}
                                                            className="object-cover w-full h-full rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <ItemAddForm items={items} />
                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update " : "Create "
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
export default SupplierInvoiceForm