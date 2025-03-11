"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"

import { useLazyQuery } from '@apollo/client';
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { TextField } from "@/components/input"
import PasswordField from "@/components/input/password-field"
import { OUTLETS_QUERY } from "@/graphql/outlet/queries"
import useStore from "@/stores"
import { OUTLET_TYPE } from "@/graphql/outlet/types"
import { signIn } from 'next-auth/react';


const formSchema = z.object({
  email: z.string().email().toLowerCase().min(5, {
    message: "Email must be valid",
  }),
  password: z.string().min(2, {
    message: "password must be at least 5 characters.",
  }),
})


function LoginForm() {
  const { toast } = useToast()
  const router = useRouter()
  const loadOutlet = useStore((store) => store.loadOutlet)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "pass123"
    },
  })

  const [getOutlets, { loading: outletLoading }] = useLazyQuery(OUTLETS_QUERY, {
    variables: { isActive: true },
    onCompleted(data) {
      const outlets = data?.outlets?.edges?.map((item: { node: OUTLET_TYPE }) => item.node)
      loadOutlet(outlets);
    },
    fetchPolicy: "no-cache",
  });



async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const res = await signIn('credentials', {
            ...values,
            redirect: false, // Prevent automatic redirection
        });

        if (res?.error) {
            throw new Error(res.error);
        }

        await getOutlets(); // Fetch outlets after successful login
        router.push('/dashboard')

        toast({
            variant: 'default',
            description: 'Login successful!',
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: (error as Error).message || 'An unknown error occurred.',
        });
    }
}






  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <TextField
              form={form}
              name="email"
              label="Email"
              placeholder="Email"
            />
            <PasswordField
              form={form}
              name="password"
              label="Password"
              placeholder="Password"
            />
            <Button disabled={outletLoading} type="submit">Submit</Button>
          </form>
        </Form>

        <Button variant={'link'} className="w-full mt-5 flex items-end  justify-center ">
          <Link href='/forgot'>Lost your password?</Link>
        </Button>
      </CardContent>
    </Card>
  )
}


export default LoginForm