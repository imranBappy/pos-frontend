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
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { FLOOR_MUTATION, FLOOR_QUERY, FLOORS_QUERY } from "@/graphql/product"
import Loading from "@/components/ui/loading"
import { useRouter } from "next/navigation"

const FloorFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    isActive: z.boolean().default(true),
})
type FloorFormValues = z.infer<typeof FloorFormSchema>
export function FloorForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const [createFloor, { loading: create_loading }] = useMutation(FLOOR_MUTATION)
    const form = useForm<FloorFormValues>({
        resolver: zodResolver(FloorFormSchema),
        defaultValues: {
            isActive: false,
        },
    })

    async function onSubmit(data: FloorFormValues) {
        try {
            await createFloor({
                variables: {
                    ...data,
                    id: id || undefined
                },
                refetchQueries: [{
                    query: FLOORS_QUERY, variables: {
                        offset: 0,
                        first: 10,
                        search: "",
                        orderBy: "",
                        floor: null
                    }
                }],
                awaitRefetchQueries: true
            })
            toast({
                title: "Success",
                description: "Floor created successfully",
            })
            form.reset({
                isActive: true,
                name: "",
            })
            router.push("/floor")

        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    const { loading: floor_loading } = useQuery(FLOOR_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: (data) => {
            const floor = {
                name: data.floor.name,
                isActive: data.floor.isActive
            }
            form.reset(floor);
        },
        onError: (error) => {
            console.log(error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: "Floor load error"
            })
        }
    })



    if (floor_loading) return <Loading />


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {
                                id ? "Update Floor" : "Create Floor"
                            }
                        </CardTitle>
                        <CardDescription>
                            {
                                id ? "Update Floor details" : "Add a new floor to your inventory"
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
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Floor Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter floor name"
                                                    {...field}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>

                        </div>


                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update Floor" : "Create Floor"
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
} 