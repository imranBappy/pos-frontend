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
import { FLOOR_TABLE_MUTATION, FLOOR_TABLE_QUERY, FLOOR_TABLES_QUERY, FLOOR_TYPE, FLOORS_QUERY } from "@/graphql/product"
import Loading from "@/components/ui/loading"
import { useRouter } from "next/navigation"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"

const FloorTableFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    floor: z.string().min(1, 'Enter valid floor id'),
    isActive: z.boolean().default(true),
})
type FloorTableFormValues = z.infer<typeof FloorTableFormSchema>

export function FloorTableForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const [createFloorTable, { loading: create_loading }] = useMutation(FLOOR_TABLE_MUTATION, {
        refetchQueries: [{
            query: FLOOR_TABLES_QUERY, variables: {
                offset: 0,
                first: 10,
                search: "",
                orderBy: "",
                floor: null
            }
        }],
        awaitRefetchQueries: true
    })
    const form = useForm<FloorTableFormValues>({
        resolver: zodResolver(FloorTableFormSchema),
        defaultValues: {
            isActive: true,
        },
    })

    const { data: floor_res } = useQuery(FLOORS_QUERY)
    const floors: OPTION_TYPE[] = floor_res?.floors.edges.map((edge: { node: FLOOR_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))

    async function onSubmit(data: FloorTableFormValues) {
        try {
            await createFloorTable({
                variables: {
                    ...data,
                    id: id || undefined
                },
                refetchQueries: [{ query: FLOOR_TABLES_QUERY }],
                awaitRefetchQueries: true
            })
            toast({
                title: "Success",
                description: "Floor Table created successfully",
            })
            form.reset({
                isActive: true,
                name: "",
                floor: ""
            })
            router.push("/floor/table")

        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    const { loading: floor_loading } = useQuery(FLOOR_TABLE_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: (data) => {
            const floorTable = {
                name: data.floorTable.name,
                isActive: data.floorTable.isActive,
                floor: data.floorTable.floor.id
            }
            form.reset(floorTable);
        },
        onError: () => {
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
                                            <FormLabel>Table Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter table name"
                                                    {...field}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {
                                    !floor_loading && <SwitchItem
                                        disabled={floor_loading}
                                        form={form}
                                        name="floor"
                                        label="Floor"
                                        options={floors || []}
                                        placeholder="Select Floor"
                                    />
                                }


                            </div>

                        </div>


                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update Table" : "Create Table"
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
} 