"use client"
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

import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from "@/graphql/accounts"
import { useToast } from "@/hooks/use-toast"
import { TextField } from "@/components/input"
import { useSearchParams, useRouter } from 'next/navigation'


const formSchema = z.object({
  password: z.string().min(5, {
    message: "password must be at least 5 characters.",
  }),
  password2: z.string()

}).refine((data) => data.password === data.password2, {
  message: "Password don't match",
  path: ['password2']
})


function ResetForm() {
  const { toast } = useToast()
  const params = useSearchParams()
  const router = useRouter()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: async (res) => {
      const { success = false, message } = res.passwordReset;
      if (!success) {
        toast({
          variant: 'destructive',
          description: message,
        })
        return
      };

      toast({
        variant: 'default',
        description: message,
      })
      router.push("/login")
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: 'destructive',
        description: err.message,
      })
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { password } = values;
    const email = params.get('email')
    const otp = params.get('otp')

    resetPassword({
      variables: {
        password: password,
        email: email,
        otp: otp
      }
    })
  }



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your new password below to change to your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <TextField
              form={form}
              name="password"
              label="Passdow"
              placeholder="Passdow"
            />
            <TextField
              form={form}
              name="password2"
              label="Confirm Password"
              placeholder="Confirm Password"
            />
            <Button disabled={loading} type="submit">Reset password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


export default ResetForm