"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import { ADDRESS_QUERY } from "@/graphql/product"
import { getCountryDataList } from 'countries-list'
import { ADDRESS_DEFAULT_UPDATE, ADDRESS_MUTATION, BUILDING_MUTATION, BUILDING_TYPE } from "@/graphql/accounts"
import { useState } from "react"
import { Input } from "@/components/ui"
import Image from "@/components/ui/image"
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3"
import SwitchField from "@/components/input/switch-field"

const countryList: OPTION_TYPE[] = getCountryDataList().map((country: { name: string }) => ({ label: country.name, value: country.name }))

const userFormSchema = z.object({
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    area: z.string().optional(),
    street: z.string().optional(),
    house: z.string().optional(),
    address: z.string().optional(),
    default: z.boolean().default(false),

    // for building
    name: z.string().optional(),
    floor: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    photo: z.instanceof(File).optional(),
})

type AddresType = z.infer<typeof userFormSchema>
type buildEdges = {
    node: BUILDING_TYPE
}
const getBuilding = (building: buildEdges[]): BUILDING_TYPE => {
    if (!building.length) return { name: "" }
    return building[0].node
}

export function AddressForm({ id, addressType }: { id?: string, addressType: string }) {
    const { toast } = useToast()
    const form = useForm<AddresType>({
        resolver: zodResolver(userFormSchema),
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(undefined)

    const [addressUpdate, { loading: create_loading }] = useMutation(ADDRESS_MUTATION, {
        refetchQueries: [{
            query: ADDRESS_QUERY, variables: {
                user: id,
                addressType: addressType
            }
        }
        ],
        awaitRefetchQueries: true
    })
    const [addressDefaultUpdate, { loading: update_loading }] = useMutation(ADDRESS_DEFAULT_UPDATE, {
        refetchQueries: [{
            query: ADDRESS_QUERY, variables: {
                user: id,
                addressType: addressType
            }
        },

        ],
        awaitRefetchQueries: true
    })

    const [buildingUpdate, { loading: build_create_loading }] = useMutation(BUILDING_MUTATION,)
    const { loading: address_loading, data: address_res } = useQuery(ADDRESS_QUERY, {
        variables: {
            user: id,
            addressType: addressType
        },
        skip: !id,
        onCompleted: async ({ address }) => {
            const oldBuilding = getBuilding(address.buildins.edges)
            const oldAddress = {
                country: address.country || undefined,
                street: address.street || undefined,
                state: address.state || undefined,
                house: address.house || undefined,
                city: address.city || undefined,
                area: address.area || undefined,
                address: address.address || undefined,
                default: address.default,
                ...oldBuilding,
                floor: oldBuilding.floor || undefined,
                latitude: oldBuilding.latitude ? `${oldBuilding.latitude}` : undefined,
                longitude: oldBuilding.longitude ? `${oldBuilding.longitude}` : undefined,
                photo: undefined
            }
            setImagePreviewUrl(oldBuilding.photo)
            form.reset(oldAddress);
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
    async function onSubmit(data: AddresType) {
        try {
            const updateAddress = await addressUpdate({
                variables: {
                    addressType: addressType,
                    default: address_res?.address?.default,
                    country: data.country,
                    street: data.street,
                    state: data.state,
                    house: data.house,
                    city: data.city,
                    area: data.area,
                    address: data.address,
                    user: id || undefined
                },
            })


            if (!updateAddress.data?.addressCud?.address?.id || !data.name) {
                toast({
                    title: "Success",
                    description: "Address updated successfully",
                })
                return
            }

            const oldBuilding = getBuilding(address_res?.address?.buildins.edges)

            let uploadedFiles: string | undefined = undefined;
            if (data.photo && oldBuilding.photo) {
                // delete old image
                const deleted = await deleteImageFromS3(oldBuilding.photo)
                if (!deleted) throw new Error("Failed to delete image")
            }
            if (data.photo) {
                uploadedFiles = await uploadImageToS3(data.photo)
                if (!uploadedFiles) throw new Error("Failed to upload image")
            }
            await buildingUpdate({
                variables: {
                    id: oldBuilding?.id,
                    address: updateAddress.data?.addressCud?.address?.id,
                    name: data.name,
                    floor: data.floor,
                    latitude: data.latitude ? parseFloat(data.latitude) : undefined,
                    longitude: data.longitude ? parseFloat(data.longitude) : undefined,
                    photo: uploadedFiles ? uploadedFiles : oldBuilding?.photo,
                }
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

    const handleUpdateDefault = async () => {
        await addressDefaultUpdate({
            variables: {
                user: id,
                addressType: addressType
            }
        })
    }


    if (address_loading) return <Loading />

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full  mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Address & Building
                        </CardTitle>
                        <CardDescription>
                            Address Update
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <SwitchField
                                onChange={handleUpdateDefault}
                                form={form}
                                name="default"
                                label="Is it default address "
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <SwitchItem
                                    form={form}
                                    name="country"
                                    label="Country"
                                    options={countryList}
                                    placeholder="Select country"
                                />
                                <TextField
                                    form={form}
                                    name="state"
                                    label="State"
                                    placeholder="State"
                                />
                                <TextField
                                    form={form}
                                    name="city"
                                    label="City"
                                    placeholder="City"
                                />

                                <TextField
                                    form={form}
                                    name="area"
                                    label="Area"
                                    placeholder="Area"
                                />



                                <TextField
                                    form={form}
                                    name="street"
                                    label="Street"
                                    placeholder="Street"
                                />
                                <TextField
                                    form={form}
                                    name="house"
                                    label="House"
                                    placeholder="House"
                                />
                                <TextField
                                    form={form}
                                    name="address"
                                    label="Address"
                                    placeholder="Address"
                                />

                                <TextField
                                    form={form}
                                    name="name"
                                    label="Building Name"
                                    placeholder="Enter name"
                                />
                                <SwitchItem
                                    form={form}
                                    name="floor"
                                    label="Floor Number"
                                    placeholder="Enter floor"
                                    options={[
                                        { value: '1', label: '1' },
                                        { value: '2', label: '2' },
                                        { value: '3', label: '3' },
                                        { value: '5', label: '5' },
                                        { value: '6', label: '6' },
                                        { value: '7', label: '7' },
                                        { value: '8', label: '8' },
                                        { value: '9', label: '9' },
                                        { value: '10', label: '10' },
                                        { value: '11', label: '11' },
                                        { value: '12', label: '12' },
                                        { value: '13', label: '13' },
                                        { value: '14', label: '14' },
                                        { value: '15', label: '15' },
                                        { value: '16', label: '16' },
                                        { value: '17', label: '17' },
                                        { value: '19', label: '19' },
                                        { value: '20', label: '20' },
                                    ]}
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
                                <Button type="submit" className="mt-9" isLoading={create_loading || update_loading || build_create_loading} >
                                    Update
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
export default AddressForm