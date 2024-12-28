"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Product, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons'
import { BeatLoader } from 'react-spinners'
import { productSchema } from '@/constants/zod'
import { MultiImageUpload } from '@/components/multi-image-upload'
import { updateProduct } from '@/actions/products'
import { ProductState } from '@prisma/client'
import { LocationInput } from '@/components/location-input'
import * as z from 'zod'
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '@/constants/categories'
import { ProductCategorySelect } from '@/components/product-category-select'
import { BrandSelect } from '@/components/brand-select'

interface EditProductFormProps {
    product: Product & { seller: User }
}

export function EditProductForm({ product }: EditProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const router = useRouter()

    const states = [ProductState.NEW, ProductState.USED, ProductState.DAMAGED, ProductState.REFURBISHED]

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            discount: product.discount,
            images: product.images,
            categories: product.categories,
            state: product.state,
            brand: product.brand
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
                                <Textarea placeholder="Describe your product" {...field} />
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
                        name="discount"
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                            <Input
                                type="number"
                                placeholder="5%"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
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
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                            <BrandSelect brands={PRODUCT_BRANDS} selectedBrand={field.value} onSelectBrand={field.onChange} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className='flex gap-4'>
                    <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categories</FormLabel>
                            <FormControl>
                            <ProductCategorySelect
                                options={PRODUCT_CATEGORIES}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="New, Used, Damaged ?" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="defaultDeliveryLocation"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Default Location</FormLabel>
                        <FormControl>
                        <LocationInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="delivery"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                        <FormLabel>
                            Delivery
                        </FormLabel>
                        <FormDescription>
                            {field.value
                            ? 'You will offer delivery to customers.'
                            : 'Customers will have to pick up the product.'}
                        </FormDescription>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="averageDeliveryTime"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Average Delivery Time (days)</FormLabel>
                        <FormControl>
                        <Input
                            type="number"
                            placeholder="7"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                            disabled={!form.getValues("delivery")}
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
