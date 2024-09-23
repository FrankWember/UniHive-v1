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
import { IDSignInSchema, EmailSignInSchema} from "@/constants/zod"
import { useSearchParams } from 'next/navigation'
import { Link2Icon } from "@radix-ui/react-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnvelopeClosedIcon, PersonIcon } from '@radix-ui/react-icons'
import React from 'react'

export const SignInForm = () => {
  return (
    <Tabs defaultValue='email'>
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="email"><EnvelopeClosedIcon className="mr-2" /> Email</TabsTrigger>
        <TabsTrigger value="id"><PersonIcon className="mr-2" /> Student ID</TabsTrigger>
      </TabsList>
      <TabsContent value='email'>
        <EmailForm />
      </TabsContent>
      <TabsContent value='id'>
        <IDForm />
      </TabsContent>
    </Tabs>
  )
}


const EmailForm = () => {
  const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different Provider!"
        : "";

    const form = useForm<z.infer<typeof EmailSignInSchema>>({
        resolver: zodResolver(EmailSignInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
      })

    function onSubmit(values: z.infer<typeof EmailSignInSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <Button type="submit" className="w-full">Submit</Button>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-6">
            <p>Don't have an Account? </p>
            <Link href={`/auth/sign-up?callbackUrl=${callbackUrl}`} className="flex items-center text-black dark:text-white hover:underline">Sign Up <Link2Icon /></Link>
        </div>
      </form>
    </Form>
  )
}

const IDForm = () => {
  const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different Provider!"
        : "";

    const form = useForm<z.infer<typeof IDSignInSchema>>({
        resolver: zodResolver(IDSignInSchema),
        defaultValues: {
            student_id: "",
            password: "",
        },
      })

    function onSubmit(values: z.infer<typeof IDSignInSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Id</FormLabel>
              <FormControl>
                <Input placeholder="800......" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        <Button type="submit" className="w-full">Submit</Button>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-6">
            <p>Don't have an Account? </p>
            <Link href={`/auth/sign-up?callbackUrl=${callbackUrl}`} className="flex items-center text-black dark:text-white hover:underline">Sign Up <Link2Icon /></Link>
        </div>
      </form>
    </Form>
  )
}