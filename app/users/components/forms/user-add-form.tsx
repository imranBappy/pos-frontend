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
import { useMutation } from '@apollo/client';
import { USER_REGISTER } from "@/graphql/accounts"
import { useToast } from "@/hooks/use-toast"
import { TextField } from "@/components/input"
import PasswordField from "@/components/input/password-field"
import { Button } from "@/components/button"


const formSchema = z.object({
  email: z.string().email().toLowerCase().min(5, {
    message: "Email must be valid",
  }),
  password: z.string().min(2, {
    message: "password must be at least 5 characters.",
  }),
  name: z.string().min(2, {
    message: "name must be at least 5 characters.",
  }),
  phone: z.string().min(9, {
    message: "password must be at least 9 characters.",
  }),
})


function UserAddForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "pass123"
    },
  })

  const router = useRouter()
  const [registerUser, { loading }] = useMutation(USER_REGISTER, {
    onCompleted: async (res) => {
      toast({
        variant: 'default',
        description: res.message,
      })
      router.push('/users')
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: 'destructive',
        description: err.message,
      })
    }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await registerUser({
      variables: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      },
    });
  }

  return (
    <div >
      <CardHeader>
        <CardTitle className="text-2xl">Create New User</CardTitle>
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
              <PasswordField
                form={form}
                name="password"
                label="Password"
                placeholder="Password"
              />
            </div>
            <div>
              <Button className="w-[150px]" isLoading={loading} >Register</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  )
}


export default UserAddForm