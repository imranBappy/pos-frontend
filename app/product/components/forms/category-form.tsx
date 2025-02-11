"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY, CATEGORY_MUTATION, CATEGORY_QUERY, CATEGORY_TYPE } from "@/graphql/product"
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
    Switch,
    Input,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@/components/ui"
import { TextField } from "@/components/input/text-field"
import { TextareaField } from "@/components/input/textarea-field"
import Button from "@/components/button"

const productFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    parent: z.string().optional(),
    image: z.instanceof(File).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function CategoryForm({ id }: { id?: string }) {
    const { toast } = useToast()
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
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            isActive: true,
        },
    })
    const { data: categories_res, loading: categories_loading } = useQuery(CATEGORIES_QUERY, {
        variables: {
            isCategory: true
        }
    })
    const categories: OPTION_TYPE[] = categories_res?.categories.edges.map((edge: { node: CATEGORY_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))

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
                    parent: data.parent || undefined
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                isActive: true,
                name: "",
                description: "",
                parent: "",
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




    if (categories_loading || category_loading) return <Loading />


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
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">Basic Information</h3>
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">Active</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator />
                            <TextField form={form} name="name" label="Name" placeholder="Enter name" />
                            <TextareaField form={form} name="description" label="Description" placeholder="Enter description" />
                        </div>
                        <div className="space-y-4">
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SwitchItem
                                    disabled={categories_loading}
                                    form={form}
                                    name="parent"
                                    label="Parent"
                                    options={categories}
                                    placeholder="Select parent"
                                />

                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <Input
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
export default CategoryForm