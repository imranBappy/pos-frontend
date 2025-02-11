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
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import { useRouter } from "next/navigation"
import { USER_GENDERS } from "@/constants/auth.constants"
import Image from "next/image"
import { Input } from "@/components/ui"
import { useState } from "react"
import { ROLES_QUERY, USER_QUERY } from "@/graphql/accounts/queries"
import { PROFILE_MUTATION, ROLE_TYPE } from "@/graphql/accounts"
import DatePicker from "@/components/input/date-picker"
import { getErrors } from "@/lib/utils"


const userFormSchema = z.object({
    isActive: z.boolean().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    gender: z.string().optional(),
    photo: z.instanceof(File).optional(),
    role: z.string().optional(),
    dateOfBirth: z
        .date({
            required_error: "A date of birth is required.",
        })
        .optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>


export function UserInfoUpdateForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema)
    })
    const [updateProfile, { loading: create_loading }] = useMutation(PROFILE_MUTATION, {
        onError: (err) => {
            const errors = getErrors([...err.graphQLErrors]);
            if (errors.errors?.phone) {
                form.setError('phone', {
                    message: errors.errors?.phone,
                });
            }
        },
        onCompleted: () => {
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        }
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

    const { loading: user_loading, data: user_res } = useQuery(USER_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: async (data) => {
            const user = {
                name: data.user.name,
                phone: data.user.phone,
                gender: data.user.gender,
                dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth) : undefined,
                role: data.user.role?.id,
                isActive: !!data.user.isActive
            }
            setImagePreviewUrl(data.user.photo)
            form.reset(user);
        },
        onError: (error) => {
            console.error(error);
            router.push('/users')
        }
    })

    const { loading: roles_loading, data: roles_data } = useQuery(ROLES_QUERY, {
        onError: (err) => {
            toast({ description: err.message, variant: 'destructive' })
        }
    })

    const roles: OPTION_TYPE[] = roles_data?.roles?.map((role: ROLE_TYPE) => ({
        value: role.id,
        label: role.name
    }))



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue("photo", e.target.files?.[0])
        if (e.target.files?.[0]) {
            setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]))
        }
    }

    async function onSubmit(data: UserFormValues) {
        try {
            let uploadedFiles: string | undefined = undefined;
            if (data.photo && user_res.user.photo) {
                // delete old image
                const deleted = await deleteImageFromS3(user_res.user.photo)
                if (!deleted) throw new Error("Failed to delete image")
            }
            if (data.photo) {
                uploadedFiles = await uploadImageToS3(data.photo)
                if (!uploadedFiles) throw new Error("Failed to upload image")
            }
            const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined
            await updateProfile({
                variables: {
                    ...data,
                    dateOfBirth: dateOfBirth,
                    photo: uploadedFiles ? uploadedFiles : user_res?.user?.photo,
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
    if (user_loading || roles_loading) return <Loading />


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mb-5  mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Update Profile
                        </CardTitle>
                        <CardDescription>
                            Update Profile details
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <TextField
                                    form={form}
                                    name="name"
                                    label="Name"
                                    placeholder="Enter name"
                                />
                                <SwitchItem
                                    form={form}
                                    name="gender"
                                    label="Gender"
                                    options={USER_GENDERS}
                                    placeholder="Select gender"
                                />
                                <TextField
                                    form={form}
                                    name="phone"
                                    label="Phone"
                                    placeholder="Enter Phone number"
                                />

                                <DatePicker
                                    form={form}
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    placeholder="Date of Birth"
                                />
                                <SwitchItem
                                    form={form}
                                    name="role"
                                    label="Role"
                                    options={roles}
                                    placeholder="Select role"
                                />
                                <FormField
                                    control={form.control}
                                    name="photo"
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
                        <div className="flex justify-end">
                            <Button type="submit" isLoading={create_loading} >
                                Update User Info
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
export default UserInfoUpdateForm