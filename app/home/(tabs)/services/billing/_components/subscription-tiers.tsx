"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BeatLoader } from 'react-spinners'
import { Icons } from "@/components/ui/icons"
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { upsertSubscription } from '@/actions/subscription'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useToast } from '@/hooks/use-toast'

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
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Premium Subscription</CardTitle>
                    <CardDescription>Get access to all premium features for $30/month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-bold">$30</span>
                        <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Publish Services</span>
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Get Full Analytics</span>
                        </li>
                        <li className="flex items-center">
                            <Icons.check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Online Portfolio</span>
                        </li>
                    </ul>
                    <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={method.id} id={method.id} className='text-white border-white' />
                                <Label htmlFor={method.id} className="flex items-center">
                                    <method.icon className="mr-2 h-4 w-4" />
                                    {method.name}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter>
                    {typeof window !== 'undefined' && window.paypal ? ( // Check if PayPal is loaded
                        <PayPalButtons
                            style={{
                                shape: "pill",
                                layout: "vertical",
                            }}
                            createSubscription={async () => {
                                const sub = await upsertSubscription({
                                    userId: user!.id!,
                                    paymentMethod: "PAYPAL",
                                    subscriptionStatus: "PENDING"
                                })
                                if (sub) {
                                    toast({
                                        title: "Subscription Initiated",
                                        description: "Your subscription has been initiated. You will receive an email confirmation shortly.",
                                    })
                                    return sub.id
                                } else {
                                    toast({
                                        title: "Subscription Failed",
                                        description: "There was an error initiating your subscription. Please try again later.",
                                        variant: "destructive"
                                    })
                                    return ""
                                }
                            }}
                            onApprove={async (data, actions) => {
                                const sub = await upsertSubscription({
                                    userId: user!.id!,
                                    paymentMethod: "PAYPAL",
                                    subscriptionStatus: "ACTIVE",
                                    monthlyAmount: 30
                                })
                                if (sub) {
                                    toast({
                                        title: "Subscription Approved",
                                        description: "Your subscription has been approved. You will receive an email confirmation shortly.",
                                    })
                                } else {
                                    toast({
                                        title: "Subscription Failed",
                                        description: "There was an error approving your subscription. Please try again later.",
                                        variant: "destructive"
                                    })
                                }
                            }}
                            />
                    ):(
                        <Button variant='secondary' disabled>
                            Loading Paypal
                            <BeatLoader />
                        </Button> // Fallback UI while loading
                    )}
                </CardFooter>
            </Card>
    )
}
