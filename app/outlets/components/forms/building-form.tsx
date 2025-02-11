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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import Image from "next/image"
import { Input } from "@/components/ui"
import { useState } from "react"
import { BUILDING_MUTATION } from "@/graphql/accounts"
import { ADDRESS_QUERY, BUILDING_QUERY } from "@/graphql/product"

const userFormSchema = z.object({
    name: z.string().optional(),
    floor: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    photo: z.instanceof(File).optional(),
})

type UserormValues = z.infer<typeof userFormSchema>


export function BuildingForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const form = useForm<UserormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
        },
    })
    const [buildingUpdate, { loading: create_loading }] = useMutation(BUILDING_MUTATION, {
        onCompleted: () => {
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        }
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

    const { data: addressData, loading: addressLoading } = useQuery(ADDRESS_QUERY, {
        variables: {
            user: id
        },
        skip: !id,
        onError: (error) => {
            console.error(error);
        }
    })
    const { loading: buildingLoading, data: buildingRes } = useQuery(BUILDING_QUERY, {
        variables: {
            address: addressData?.address.id
        },
        skip: !addressData?.address.id,
        onCompleted: async ({ building }) => {
            form.reset({
                name: building.name,
                floor: building.floor || undefined,
                latitude: building.latitude ? `${building.latitude}` : undefined,
                longitude: building.longitude ? `${building.longitude}` : undefined,
            });
            setImagePreviewUrl(building.photo)
        },
        onError: (error) => {
            console.error(error);
        }
    })


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue("photo", e.target.files?.[0])
        if (e.target.files?.[0]) {
            setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]))
        }
    }

    async function onSubmit(data: UserormValues) {
        try {
            let uploadedFiles: string | undefined = undefined;
            if (data.photo && buildingRes.building.photo) {
                // delete old image
                const deleted = await deleteImageFromS3(buildingRes.building.photo)
                if (!deleted) throw new Error("Failed to delete image")
            }
            if (data.photo) {
                uploadedFiles = await uploadImageToS3(data.photo)
                if (!uploadedFiles) throw new Error("Failed to upload image")
            }
            await buildingUpdate({
                variables: {
                    ...data,
                    latitude: data.latitude ? parseFloat(data.latitude) : undefined,
                    longitude: data.longitude ? parseFloat(data.longitude) : undefined,
                    photo: uploadedFiles ? uploadedFiles : buildingRes?.building?.photo,
                    address: addressData?.address?.id,
                    id: id || undefined
                },
            })

        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    if (buildingLoading || addressLoading || create_loading) return <Loading />


    return (
        <Form {...form}>
            <Separator />
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-5  mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Building
                        </CardTitle>
                        <CardDescription>
                            Building details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TextField
                                form={form}
                                name="name"
                                label="Name"
                                placeholder="Enter name"
                            />
                            <TextField
                                form={form}
                                name="floor"
                                label="Floor"
                                placeholder="Enter floor"
                            />
                            <TextField
                                form={form}
                                name="latitude"
                                label="Latitude"
                                placeholder="Enter Latitude"
                            />
                            <TextField
                                form={form}
                                name="longitude"
                                label="Longitude"
                                placeholder="Enter Longitude"
                            />

                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field: { ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Upload Building Photo</FormLabel>
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
                            <Button type="submit" className="mt-9" isLoading={create_loading} >
                                Update Building
                            </Button>
                        </div>

                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
export default BuildingForm