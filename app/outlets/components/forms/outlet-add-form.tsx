"use client"
import { useRouter } from "next/navigation"
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
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useToast } from "@/hooks/use-toast"
import { TextareaField, TextField } from "@/components/input"
import { Button } from "@/components/button"
import { OUTLET_MUTATION } from "@/graphql/outlet/mutations"
import useStore from "@/stores"
import { OUTLET_QUERY, OUTLETS_QUERY } from "@/graphql/outlet/queries"
import { OUTLET_TYPE } from "@/graphql/outlet/types"


const formSchema = z.object({
  email: z.string().email().toLowerCase().min(5, {
    message: "Email must be valid",
  }),
  address: z.string().min(2, {
    message: "address must be at least 5 characters.",
  }),
  name: z.string().min(2, {
    message: "name must be at least 5 characters.",
  }),
  phone: z.string().min(9, {
    message: "password must be at least 9 characters.",
  }),
})


function OutletAddForm({ outletId }: { outletId?: string }) {
  const { toast } = useToast()
  const loadOutlet = useStore((store) => store.loadOutlet)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const [getOutlets, { loading: outletLoading }] = useLazyQuery(OUTLETS_QUERY, {
    variables: { isActive: true },
    onCompleted(data) {
      const outlets = data?.outlets?.edges?.map((item: { node: OUTLET_TYPE }) => item.node)
      loadOutlet(outlets);
      router.push('/outlets')

    },
    fetchPolicy: "no-cache",
  });

  const router = useRouter()
  const [registerUser, { loading }] = useMutation(OUTLET_MUTATION, {
    onCompleted: async () => {
      toast({
        variant: 'default',
        description: "Success!",
      })
      await getOutlets()
    },
    onError: (err) => {
      toast({
        variant: 'destructive',
        description: err.message,
      })
    }
  })

  const { data: res } = useQuery(OUTLET_QUERY, {
    variables: {
      id: outletId,
    },
    onCompleted: (data) => {
      console.log(data.outlet);
      form.setValue("name", data.outlet.name)
      form.setValue("email", data.outlet.email)
      form.setValue("phone", data.outlet.phone)
      form.setValue("address", data.outlet.address)
    },
    skip: !outletId
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {

    await registerUser({
      variables: {
        id: res?.outlet?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
  }

  return (
    <div className="" >
      <CardHeader>
        <CardTitle className="text-2xl">Create New Outlet</CardTitle>
        <CardDescription>
          Enter your information below to create to new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5" >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                form={form}
                name="name"
                label="Name"
                placeholder="Name"
              />
              <TextField
                form={form}
                name="email"
                label="Email"
                placeholder="Email"
              />
              <TextField
                form={form}
                name="phone"
                label="Phone"
                placeholder="Phone"
              />
              <TextareaField
                form={form}
                name="address"
                label="Address"
                placeholder="Address"
              />
            </div>
            <div>
              <Button className="w-[150px]" isLoading={loading || outletLoading} >{
                res?.outlet?.id ? "Update Outlet" : "Create Outlet"
              }</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  )
}


export default OutletAddForm