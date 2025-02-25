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
import { WASTE_CATEGORY_QUERY } from "@/graphql/waste/queries"
import { WASTE_CATEGORIES_MUTATION } from "@/graphql/waste/mutations"

// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
})

function WasteCategoryForm({ wasteCategoryId }: { wasteCategoryId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [wasteCategoryMutation, { loading }] = useMutation(
        WASTE_CATEGORIES_MUTATION,
        {
            onCompleted: async () => {
                toast({
                    variant: 'default',
                    description: 'Success!',
                });
                form.reset();
                router.push('/wastes/categories');
            },
            onError: (err) => {
                toast({
                    variant: 'destructive',
                    description: err.message,
                });
            },
        }
    );

    useQuery(WASTE_CATEGORY_QUERY, {
        variables: {
            id: wasteCategoryId,
        },
        onCompleted: (data) => {
            form.setValue('name', data.wasteCategory.name);
            form.setValue('description', data.wasteCategory.description);
        },
        skip: !wasteCategoryId,
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await wasteCategoryMutation({
            variables: {
                id: wasteCategoryId,
                name: data.name,
                description: data.description,
            },
        })
    }

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl">{wasteCategoryId ? "Update Waste Category" : "Create New Waste Category"}</CardTitle>
                <CardDescription>
                    {wasteCategoryId ? "Update the item category information below." : "Enter the item category information below."}
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
                                placeholder="Waste Category Name"
                            />
                            <TextareaField
                                form={form}
                                name="description"
                                label="Description"
                                placeholder="Description"
                            />
                        </div>
                        <div>
                            <Button className="w-[220px]" isLoading={loading}>
                                {wasteCategoryId ? "Update Waste Category" : "Create Waste Category"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    )
}

export default WasteCategoryForm
