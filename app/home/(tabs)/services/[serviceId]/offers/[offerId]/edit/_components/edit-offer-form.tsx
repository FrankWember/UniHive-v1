"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ServiceOfferSchema } from '@/constants/zod'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners'
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons'
import { updateServiceOffer } from '@/actions/service-offers'
import { ServiceOffer } from '@prisma/client'

export const EditOfferForm = ({offer}: {offer: ServiceOffer}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const router = useRouter()

    const form = useForm<z.infer<typeof ServiceOfferSchema>>({
        resolver: zodResolver(ServiceOfferSchema),
        defaultValues: {
            title: offer.title,
            price: offer.price,
            discount: offer.discount
        }
    })

    const onSubmit = async (values: z.infer<typeof ServiceOfferSchema>) => {
        setError("")
        setSuccess("")
        setIsSubmitting(true)
        try {
            await updateServiceOffer(offer.id, values)
            setSuccess("Your offer has been updated!")
            router.push(`/home/services/${offer.serviceId}/offers`)
        } catch {
            setError("We couldn't add your offer. Please try again!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Offer Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Offer Title" {...field} />
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
                            <FormLabel>Price (USD)</FormLabel>
                            <FormControl>
                                <Input placeholder="Price" type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                                <Input placeholder="Discount" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
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
                    {isSubmitting ? <BeatLoader /> : "Add Offer"}
                </Button>
            </form>
        </Form>
    )
}
