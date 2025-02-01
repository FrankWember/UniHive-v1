"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BeatLoader } from 'react-spinners'
import { Icons } from "@/components/ui/icons"
import { upsertSubscription } from '@/actions/subscription'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'
import { PricingCard } from '@/components/payments/pricing-card'

const paymentMethods = [
  { id: 'venmo', name: 'Venmo', icon: Icons.venmo },
  { id: 'paypal', name: 'PayPal', icon: Icons.paypal },
  { id: 'stripe', name: 'Credit Card', icon: Icons.creditCard },
]

export const SubscriptionTiers = () => {
    const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id)
    const user = useCurrentUser()
    const {toast} = useToast()

    const handleSubscribe = () => {
        // Implement subscription logic here
        console.log(`Subscribing with ${selectedMethod}`)
    }

    return (
        <PricingCard 
            name="Standard"
            price={30} 
            period="month" 
            features={[
                'Basic features', 
                'Unlimited services', 
                'Sales Analytics',
                'Online Payments',
                'Priority support'
            ]} 
            featured={true}
            className='w-full'
            />
    )
}
