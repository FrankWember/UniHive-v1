"use client"

import { useState, useTransition } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { TriangleIcon as ExclamationTriangleIcon, RocketIcon } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useSearchParams } from 'next/navigation'
import { completeOnboarding } from "@/actions/user"
import { BeatLoader } from "react-spinners"
import { ProfileImageUpload } from "@/components/profile-image-upload"
import { DEFAULT_SIGNIN_REDIRECT } from "@/constants/routes"

const OnboardingSchema = z.object({
  profileImage: z.string().url("Invalid image URL"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(300, "Bio can't be more than 300 characters"),
  agreeTerms: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
})

export function OnboardingForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || DEFAULT_SIGNIN_REDIRECT

  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      profileImage: "",
      bio: "",
      agreeTerms: false,
    },
  })

  function onSubmit(values: z.infer<typeof OnboardingSchema>) {
    setError("")
    setSuccess("")

    startTransition(async () => {
      try {
        await completeOnboarding(values)
        setSuccess("Your profile has been updated successfully!")
        router.push(callbackUrl)
      } catch (error) {
        setError("An error occurred while updating your profile. Please try again.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <ProfileImageUpload value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us a little about yourself..."
                className="resize-none"
                {...field}
              />
            </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <BeatLoader /> : "Complete Profile"}
        </Button>
      </form>
    </Form>
  )
}
