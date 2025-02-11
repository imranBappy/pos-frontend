"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY, CATEGORY_TYPE, PRODUCT_MUTATION, PRODUCT_QUERY, PRODUCTS_QUERY, SUBCATEGORIES_QUERY } from "@/graphql/product"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import { KITCHEN_QUERY } from "@/graphql/kitchen"
import uploadImageToS3, { deleteImageFromS3, uploadImagesToS3 } from "@/lib/s3"
import { useState } from "react"
import Loading from "@/components/ui/loading"
import { FileInput } from "@/components/ui/file-input"
import ProductImages from "./product-images"
import { renamedFile, jsonToImages, randomId, findVat, findProductPrice } from "@/lib/utils"
import { TextareaField, TextField } from "@/components/input"
import { useRouter } from "next/navigation"
import { TAGS_CHOOSE } from "@/constants/product.constants"


const productFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.string().refine((val) => parseFloat(val) > 0, {
        message: "Price must be positive",
    }).default('0'),
    sku: z.string().min(1, "SKU is required"),
    vat: z.string().refine(val => parseInt(val) >= 0, {
        message: "Vat must be positive",
    }).default('0'),
    cookingTime: z.string().refine((val) => parseInt(val) >= 0, {
        message: "Cooking time must be positive",
    }).default('0'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    kitchen: z.string().optional(),
    tag: z.string().optional(),
    images: z.any().optional(),
    video: z.string().url("Please enter a valid URL").optional(),
    sellingPrice: z.string().optional()
})

type ProductFormValues = z.infer<typeof productFormSchema>

export interface IMAGE_TYPE {
    id?: string;
    file: File;
    url: string;
}
const VAT = process.env.NEXT_PUBLIC_VAT || '5'
export function ProductForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            isActive: true,
            vat: VAT,
            cookingTime: '0',
            sku: `product-${randomId()}`,
            price: '0',

        },
    })

    const [imagePreviewUrls, setImagePreviewUrls] = useState<IMAGE_TYPE[]>([])
    const [createProduct, { loading: create_loading }] = useMutation(PRODUCT_MUTATION, {
        refetchQueries: [{
            query: PRODUCTS_QUERY,
            variables: {
                offset: 0,
                first: 10,
                search: "",
                category: null,
                subcategory: null,
                kitchen: null,
                tag: "",
                price: 0,
                priceLte: null,
                orderBy: ""
            }
        }]
    })
    const router = useRouter()


    const { loading: product_loading, data: product_res } = useQuery(PRODUCT_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: async (data) => {
            const images = await jsonToImages(data?.product?.images).map((item: string) => ({
                id: randomId(),
                file: null,
                url: item
            }))
            const product = {
                ...data.product,
                category: data.product.category?.id || '',
                subcategory: data.product.subcategory?.id || '',
                kitchen: data.product.kitchen?.id || '',
                price: `${data.product.price}`,
                sellingPrice: `${data.product.price + findVat(data.product.price, data.product.vat)}`,
                vat: String(data.product.vat),
                cookingTime: String(data.product.cookingTime),
                video: data?.product?.video || undefined,
                tag: data?.product?.tag || undefined,
                images: undefined
            }

            setImagePreviewUrls(images)
            form.reset(product);
        },
        onError: (error) => {
            console.error(error);
            router.push('/product')
        }
    })

    const { data: categories_res, loading: categories_loading } = useQuery(CATEGORIES_QUERY, {
        variables: {
            isCategory: true
        },

    })

    const categories: OPTION_TYPE[] = categories_res?.categories.edges.map((edge: { node: CATEGORY_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))
    const { data: subcategories_res, } = useQuery(SUBCATEGORIES_QUERY,
        {
            variables: {
                parentId: form.watch('category')
            },
            skip: !form.watch('category')
        }
    )
    const subcategories: OPTION_TYPE[] = subcategories_res?.subcategories.edges.map((edge: { node: CATEGORY_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))
    const { data: kitchen_res, loading: kitchen_loading } = useQuery(KITCHEN_QUERY)
    const kitchens: OPTION_TYPE[] = kitchen_res?.kitchens?.edges.map((edge: { node: CATEGORY_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))

    const handlePriceInput = (price: string) => {
        const vat = findVat(parseFloat(price), parseFloat(form.watch('vat')))
        const sellingPrice = parseFloat(price) + vat
        form.setValue('sellingPrice', sellingPrice.toFixed(5))
    }
    const handleSellingPriceInput = (price: string) => {
        const productPrice = findProductPrice(parseFloat(price), parseFloat(form.watch('vat')))
        form.setValue('price', productPrice.toFixed(5))
    }

    const handleInputVat = (vat: string) => {
        form.setValue('vat', vat)
        handlePriceInput(form.watch('price'))
    }


    const handleChangeFiles = (files: FileList) => {
        const newUrls = Array.from(files).map(file => ({
            id: randomId(),
            file: file,
            url: ""
        })
        );
        setImagePreviewUrls((preState) => [...preState, ...newUrls]);
    };

    async function onSubmit(data: ProductFormValues) {
        try {

            console.log(data);

            let uploadedFiles: string[] = [];
            const images: File[] = data.images ? Array.from(data.images) : [];

            if (images.length && !imagePreviewUrls.length) {
                // Case 1: Only new images are present
                const renamedImages = images.map(renamedFile)
                uploadedFiles = await uploadImagesToS3(renamedImages);
            } else if (!images.length && imagePreviewUrls.length) {
                // Case 2: Only preview URLs are present
                uploadedFiles = imagePreviewUrls.map(item => item.url);
            } else if (images.length && imagePreviewUrls.length) {
                // Case 3: Both new images and preview URLs are present
                const uploadPromises = imagePreviewUrls.map(async (item) => {
                    if (item.url) return item.url; // Use existing URL
                    const url = await uploadImageToS3(renamedFile(item.file)); // Upload new file
                    return url;
                });
                uploadedFiles = await Promise.all(uploadPromises);
            }
            const preImages = await jsonToImages(product_res?.product?.images)
            const deletedImage = [];
            for (let i = 0; i < preImages.length; i++) {
                const findImage = uploadedFiles.find((item) => item === preImages[i]);
                if (!findImage) deletedImage.push(preImages[i])
            }

            if (deletedImage.length) {
                const deletedPromises = deletedImage.map(async (item) => await deleteImageFromS3(item));
                await Promise.all(deletedPromises);
            }

            await createProduct({
                variables: {
                    ...data,
                    cookingTime: `${data.cookingTime}`,
                    price: (parseFloat(data.price).toFixed(8)),
                    vat: Number(data.vat),
                    images: JSON.stringify(uploadedFiles),
                    id: id || undefined
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                isActive: true,
                vat: '0',
                name: "",
                price: undefined,
                sellingPrice: undefined,
                sku: `product-${randomId()}`,
                cookingTime: undefined,
                description: "",
                category: "",
                subcategory: "",
                kitchen: "",
                tag: "",
                video: "",
                images: undefined
            })
            setImagePreviewUrls([])
            if (id) router.push('/product')
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    if (product_loading || categories_loading || kitchen_loading) return <Loading />


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {
                                id ? "Update Product" : "Create Product"
                            }
                        </CardTitle>
                        <CardDescription>
                            {
                                id ? "Update product details" : "Add a new product to your inventory"
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    form={form}
                                    name="name"
                                    label="Product Name"
                                    placeholder="Enter product name"
                                />
                                <TextField
                                    form={form}
                                    name="sku"
                                    label="SKU"
                                    placeholder="Enter SKU"
                                />
                            </div>
                            <TextareaField
                                form={form}
                                name="description"
                                label="Description"
                                placeholder="Enter product description"
                                rows={5}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Pricing & Time</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TextField
                                    form={form}
                                    name="price"
                                    label="Price"
                                    placeholder="Enter price"
                                    type="number"
                                    // min={0}
                                    onChange={(e) => handlePriceInput(e.target.value)}
                                />
                                <TextField
                                    form={form}
                                    name="sellingPrice"
                                    label="Selling Price"
                                    placeholder="Selling price"
                                    type="number"
                                    // min={0}
                                    onChange={(e) => handleSellingPriceInput(e.target.value)}
                                />
                                <TextField
                                    form={form}
                                    name="vat"
                                    label="VAT (%)"
                                    placeholder="Enter vat"
                                    type="number"
                                    min={0}
                                    onChange={(e) => handleInputVat(e.target.value)}
                                />

                                <TextField
                                    form={form}
                                    name="cookingTime"
                                    label="Cooking Time (minutes)"
                                    placeholder="Enter cooking time"
                                    type="number"
                                    min={0}
                                />

                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Category & Subcategory</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SwitchItem
                                    disabled={categories_loading}
                                    form={form}
                                    name="category"
                                    label="Category"
                                    options={categories}
                                    placeholder="Select category"
                                />
                                <SwitchItem
                                    disabled={categories_loading || !form.watch('category')}
                                    form={form}
                                    name="subcategory"
                                    label="Subcategory"
                                    options={subcategories}
                                    placeholder="Select subcategory"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 mb-5">
                            <h3 className="text-lg font-semibold">Tag & Kitchen</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SwitchItem
                                    disabled={kitchen_loading}
                                    form={form}
                                    name="kitchen"
                                    label="Kitchen"
                                    options={kitchens}
                                    placeholder="Select kitchen"
                                />
                                <SwitchItem
                                    form={form}
                                    name="tag"
                                    label="Tag"
                                    options={TAGS_CHOOSE}
                                    placeholder="Select kitchen"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Media</h3>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <TextField
                                    form={form}
                                    name="video"
                                    label="Video URL"
                                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                                />

                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={({ field: { onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <FileInput
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = e.target.files;
                                                        if (files?.length) {
                                                            onChange(files);
                                                            handleChangeFiles(files)
                                                        }
                                                    }}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <ProductImages urls={imagePreviewUrls} setUrl={setImagePreviewUrls} />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update Product" : "Create Product"
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}