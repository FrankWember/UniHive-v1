"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { addMemberToStudyGroup } from '@/actions/study-groups'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export function AddMemberForm({ studyGroupId }: { studyGroupId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await addMemberToStudyGroup(studyGroupId, values.email)
      toast({
        title: "Member added",
        description: "The new member has been added to the study group.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Add Member by Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Member"}
        </Button>
      </form>
    </Form>
  )
}