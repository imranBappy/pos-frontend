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
import { UNIT_MUTATION } from "@/graphql/unit/mutations"
import { UNIT_QUERY, UNITS_QUERY } from "@/graphql/unit/queries"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
})

function UnitForm({ unitId }: { unitId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [unitMutation, { loading }] = useMutation(UNIT_MUTATION, {
        onCompleted: async () => {
            toast({
                variant: 'default',
                description: "Success!",
            })
            form.reset()
            router.push('/units')
        },
        onError: (err) => {
            toast({
                variant: 'destructive',
                description: err.message,
            })
        },
        refetchQueries: [{
            query: UNITS_QUERY, variables: {
                offset: 0,
                first: 10,
            }
        }],
        awaitRefetchQueries: true
    })

    useQuery(UNIT_QUERY, {
        variables: {
            id: unitId,
        },
        onCompleted: (data) => {
            console.log({ data });

            form.setValue("name", data.unit.name)
            form.setValue("description", data.unit.description)
        },
        skip: !unitId,
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await unitMutation({
            variables: {
                id: unitId,
                name: data.name,
                description: data.description,
            },
        })
    }

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl">{unitId ? "Update Unit" : "Create New Unit"}</CardTitle>
                <CardDescription>
                    {unitId ? "Update the unit information below." : "Enter the unit information below."}
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
                                placeholder="Unit Name"
                            />
                            <TextareaField
                                form={form}
                                name="description"
                                label="Description"
                                placeholder="Unit Description"
                            />
                        </div>
                        <div>
                            <Button className="w-[150px]" isLoading={loading}>
                                {unitId ? "Update Unit" : "Create Unit"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    )
}

export default UnitForm
