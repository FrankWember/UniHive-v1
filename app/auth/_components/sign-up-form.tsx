"use client"
 
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { SignUpSchema } from "@/constants/zod"
import { useSearchParams } from 'next/navigation'
import { Link2Icon } from "@radix-ui/react-icons"


export const SignUpForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different Provider!"
        : "";

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            student_id: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: "",
        },
      })

    function onSubmit(values: z.infer<typeof SignUpSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex gap-4">
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="+1 600-000-111" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Student ID</FormLabel>
                <FormControl>
                    <Input placeholder="800......" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">Submit</Button>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-6">
            <p>Already have an Account? </p>
            <Link href={`/auth/sign-in?callbackUrl=${callbackUrl}`} className="flex items-center text-black dark:text-white hover:underline">Sign In <Link2Icon /></Link>
        </div>
      </form>
    </Form>
  )
}
