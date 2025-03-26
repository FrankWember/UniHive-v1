"use client"
 
import { useState, useTransition } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { IDSignInSchema, EmailSignInSchema} from "@/constants/zod"
import { useRouter, useSearchParams } from 'next/navigation'
import { Link2Icon } from "@radix-ui/react-icons"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnvelopeClosedIcon, PersonIcon } from '@radix-ui/react-icons'
import React from 'react'
import { EmailLogin, IDLogin } from "@/actions/login";
import { BeatLoader } from "react-spinners";

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
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home/services"
  const router = useRouter()

  const form = useForm<z.infer<typeof EmailSignInSchema>>({
      resolver: zodResolver(EmailSignInSchema),
      defaultValues: {
          email: "",
          password: "",
      },
    })

  function onSubmit(values: z.infer<typeof EmailSignInSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      EmailLogin(values, callbackUrl )
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            window.location.href = callbackUrl || "/home/services";
           
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {showTwoFactor && (
          <>
            {/* 2FA */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {!showTwoFactor && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter you .edu email" {...field} />
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
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <RocketIcon className="h-6 w-6"/>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending===true ? <BeatLoader />: "Submit"}
        </Button>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-6">
            <p>Don't have an Account? </p>
            <Link href={`/auth/sign-up?callbackUrl=${callbackUrl}`} className="flex items-center text-black dark:text-white hover:underline">Sign Up <Link2Icon /></Link>
        </div>
      </form>
    </Form>
  )
}

const IDForm = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl")

    const form = useForm<z.infer<typeof IDSignInSchema>>({
        resolver: zodResolver(IDSignInSchema),
        defaultValues: {
            student_id: "",
            password: "",
        },
      })

    function onSubmit(values: z.infer<typeof IDSignInSchema>) {
      setError("");
      setSuccess("");
  
      startTransition(() => {
        IDLogin(values, callbackUrl )
          .then((data) => {
            if (data?.error) {
              form.reset();
              setError(data?.error);
            }
  
            if (data?.success) {
              form.reset();
              setSuccess(data?.success);
              window.location.href = callbackUrl;
            }
  
            if (data?.twoFactor) {
              setShowTwoFactor(true);
            }
          })
          .catch(() => setError("Something went wrong"));
      });
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {showTwoFactor && (
          <>
            {/* 2FA */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {!showTwoFactor && (
          <>
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
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <RocketIcon className="h-6 w-6"/>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending===true ? "Signing In...": "Submit"}
        </Button>
        <div className="flex gap-2 items-center text-sm text-muted-foreground mt-6">
            <p>Don't have an Account? </p>
            <Link href={`/auth/sign-up?callbackUrl=${callbackUrl}`} className="flex items-center text-black dark:text-white hover:underline">Sign Up <Link2Icon /></Link>
        </div>
      </form>
    </Form>
  )
}
