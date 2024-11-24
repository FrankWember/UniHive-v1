"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiImageUpload } from '@/components/multi-image-upload'
import { createProduct } from '@/actions/products'
import { CategorySelect } from '@/components/category-select'
import { productSchema } from '@/constants/zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import { BeatLoader } from 'react-spinners'

export function NewProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const user = useCurrentUser()
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 1,
      images: [],
      categories: [],
    },
  })

  async function onSubmit(values: z.infer<typeof productSchema>) {
    setError("")
    setSuccess("")
    setIsSubmitting(true)
    try {
      await createProduct(values, user!.id!)
      setSuccess("Product created successfully!")
      router.push('/home/products')
    } catch (error) {
      console.error('Failed to create product:', error)
      setError("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <MultiImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={5}
                />
              </FormControl>
              <FormDescription>Upload up to 5 images for your product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <CategorySelect
                  options={[
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'books', label: 'Books' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'home-and-garden', label: 'Home & Garden' },
                    { value: 'sports', label: 'Sports' },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
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
          {isSubmitting ? <BeatLoader /> : 'Create Product'}
        </Button>
      </form>
    </Form>
  )
}