"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogHeader } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { Input } from '@/components/ui/input'
import { Product, User } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { requestDiscount } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { BeatLoader } from 'react-spinners'

const requestSchema = z.object({
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
})

type RequestFormValues = z.infer<typeof requestSchema>

export const ProductRequest = ({ product }: { product: Product & { seller: User }}) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const user = useCurrentUser()
  const router = useRouter()

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      price: product.price,
      quantity: 1,
    },
  })

  const onSubmit = async (data: RequestFormValues) => {
    setError("")
    setSuccess("")
    setIsSubmitting(true)
    try {
        await requestDiscount(product, data.price, data.quantity, user!.id!)
        setSuccess("Discount request sent successfully!")
        setOpen(false)
        router.push('/home/products')
    } catch (error) {
        console.error('Failed to request discount:', error)
        setError("Failed to request discount")
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Request Discount: {product.name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Discount</DialogTitle>
          <DialogDescription>This would send an offer to the seller with the details below. Once the offer is accepted, the discount will be applied to your cart.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : 'Submit Request'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
