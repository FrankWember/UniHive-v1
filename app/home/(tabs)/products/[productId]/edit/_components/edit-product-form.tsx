"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Product, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons'
import { BeatLoader } from 'react-spinners'
import { productSchema } from '@/constants/zod'
import { MultiImageUpload } from '@/components/multi-image-upload'
import { CategorySelect } from '@/components/category-select'
import { updateProduct } from '@/actions/products'
import * as z from 'zod'

interface EditProductFormProps {
    product: Product & { seller: User }
}

export function EditProductForm({ product }: EditProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const router = useRouter()

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            images: product.images,
            categories: product.categories,
        },
    })

    async function onSubmit(values: z.infer<typeof productSchema>) {
        setError("")
        setSuccess("")
        setIsSubmitting(true)
        try {
            await updateProduct(product.id, values)
            setSuccess("Product updated successfully!")
            router.push('/home/products')
            router.refresh()
        } catch (error) {
            console.error('Failed to update product:', error)
            setError("Failed to update product")
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
                                <Input {...field} />
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
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                            <MultiImageUpload
                                value={field.value}
                                onChange={field.onChange}
                                maxFiles={5}
                                />
                            </FormControl>
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
                    {isSubmitting ? <BeatLoader /> : 'Update Product'}
                </Button>
            </form>
        </Form>
    )
}
