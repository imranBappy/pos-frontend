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
import { SUPPLIER_MUTATION } from "@/graphql/supplier/mutations"
import { SUPPLIER_QUERY, SUPPLIERS_QUERY } from "@/graphql/supplier/queries"
import { isValidPhoneNumber } from "@/lib/utils"


// Define the form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    branch: z.string().min(2, {
        message: "Branch must be at least 2 characters.",
    }).optional(),
    contact_person: z.string().min(2, {
        message: "Contact person must be at least 2 characters.",
    }),
    phone_number: z.string().refine(isValidPhoneNumber, {
        message: "Invalid the valid phone number",
    }),
    whatsapp_number: z.string().refine(isValidPhoneNumber, {
        message: "Invalid the valid whatspp number",
    }).optional(),
    email_address: z.string().email({
        message: "Invalid email address.",
    }),
    address: z.string().optional(),
})

function SupplierForm({ supplierId }: { supplierId?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const [supplierMutation, { loading }] = useMutation(SUPPLIER_MUTATION, {
        onCompleted: async () => {
            toast({
                variant: 'default',
                description: "Success!",
            })
            form.reset()
            router.push('/suppliers')
        },
        onError: (err) => {
            console.log(err.message);

            toast({
                variant: 'destructive',
                description: err.message,
            })
        }
        ,
        refetchQueries: [{
            query: SUPPLIERS_QUERY,
            variables: {
                offset: 0,
                first: 10,
            }
        }],
        awaitRefetchQueries: true
    })

    useQuery(SUPPLIER_QUERY, {
        variables: {
            id: supplierId,
        },
        onCompleted: (data) => {
            form.setValue("name", data.supplier.name)
            form.setValue("phone_number", data.supplier.phoneNumber)
            if (data.supplier.whatsappNumber) {
                form.setValue("whatsapp_number", data.supplier.whatsappNumber)
            }
            if (data.supplier.emailAddress) {
                form.setValue("email_address", data.supplier.emailAddress)
            }
            if (data.supplier.address) {
                form.setValue("address", data.supplier.address)
            }
            if (data.supplier.branch) {
                form.setValue("branch", data.supplier.branch)
            }
            if (data.supplier.contactPerson) {
                form.setValue("contact_person", data.supplier.contactPerson)
            }
        },
        skip: !supplierId,
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log({
            id: supplierId,
            name: data.name,
            phoneNumber: data.phone_number,
            whatsappNumber: data.whatsapp_number,
            emailAddress: data.email_address,
            address: data.address,
            branch: data.branch,
            contactPerson: data.contact_person,
        });

        await supplierMutation({
            variables: {
                id: supplierId,
                name: data.name,
                phoneNumber: data.phone_number,
                whatsappNumber: data.whatsapp_number,
                emailAddress: data.email_address,
                address: data.address,
                branch: data.branch,
                contactPerson: data.contact_person,
            },
        })
    }

    return (
        <div>
            <CardHeader>
                <CardTitle className="text-2xl">{supplierId ? "Update Supplier" : "Create New Supplier"}</CardTitle>
                <CardDescription>
                    {supplierId ? "Update the supplier information below." : "Enter the supplier information below."}
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
                                placeholder="Supplier Name"
                            />
                            <TextField
                                form={form}
                                name="branch"
                                label="Branch"
                                placeholder="Branch"
                            />
                            <TextField
                                form={form}
                                name="contact_person"
                                label="Contact person"
                                placeholder="Contact person"
                            />
                            <TextField
                                form={form}
                                name="phone_number"
                                label="Phone Number"
                                placeholder="Phone Number"
                            />
                            <TextField
                                form={form}
                                name="whatsapp_number"
                                label="WhatsApp Number"
                                placeholder="WhatsApp Number"
                            />
                            <TextField
                                form={form}
                                name="email_address"
                                label="Email Address"
                                placeholder="Email Address"
                            />
                            <TextareaField
                                form={form}
                                name="address"
                                label="Address"
                                placeholder="Address"
                            />
                        </div>
                        <div>
                            <Button className="w-[150px]" isLoading={loading}>
                                {supplierId ? "Update Supplier" : "Create Supplier"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </div>
    )
}

export default SupplierForm