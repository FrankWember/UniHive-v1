"use client"

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
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
import { PlusIcon } from '@radix-ui/react-icons'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { createStudyGroup } from '@/actions/study-groups'
import { BeatLoader } from 'react-spinners'
 
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export const CreateStudyGroupDialog = ({courseId} : {courseId: string}) => {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | undefined>("");
    const [success, setSuccess] = React.useState<string | undefined>("");
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            await createStudyGroup(courseId, values.name)
            setLoading(false)
            setSuccess("Created Study Group successfully!")
            router.refresh()
        } catch (error) {
            console.error('Error creating study group:', error)
            setError("Failed to create study group. Please try again!")
        }
    }

  return (
    <Dialog>
        <DialogTrigger>
            <Button>Create <PlusIcon /></Button>
        </DialogTrigger>
        <DialogContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='space-y-4'>
                        <DialogHeader>
                            <DialogTitle>Create a Study Group</DialogTitle>
                            <DialogDescription>create a new study group and later on add the users of your choice.</DialogDescription>
                        </DialogHeader>
                    
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Winning team..." {...field} disabled={loading}/>
                                </FormControl>
                                <FormDescription>
                                    This is the of your new study group.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
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
                    
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type='submit' disabled={loading}>
                                {loading? <BeatLoader />: "Submit"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
