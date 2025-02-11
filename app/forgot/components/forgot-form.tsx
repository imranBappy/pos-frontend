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
import { PASSWORD_RESET_MAIL_MUTATION } from "@/graphql/accounts"
import { useToast } from "@/hooks/use-toast"
import { TextField } from "@/components/input"


const formSchema = z.object({
  email: z.string().email().toLowerCase().min(5, {
    message: "Email must be valid",
  }),
})


function ForgotForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const [userLogin, { loading }] = useMutation(PASSWORD_RESET_MAIL_MUTATION, {
    onCompleted: async (res) => {
      const { success = false, message } = res.passwordResetMail;
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
    const { email } = values;
    userLogin({
      variables: {
        email: email,
      }
    })
  }



  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forget Password</CardTitle>
        <CardDescription>
          Lost your password? Please enter your username r email address. You will receive a link to create a new password via email.
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
            {/* <p className=" text-red-500">Invalid Email</p> */}
            <Button disabled={loading} type="submit">Reset password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


export default ForgotForm