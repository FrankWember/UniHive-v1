"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCardIcon, AppleIcon, PaypalIcon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { processPayment } from '@/actions/services'
import { BookedServices, Service } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { BeatLoader } from 'react-spinners'

interface PaymentFormProps {
  bookedService: BookedServices & { service: Service }
  userId: string
}

export function PaymentForm({ bookedService, userId }: PaymentFormProps) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit() {
    setIsLoading(true)
    try {
      await processPayment(bookedService.id, userId, paymentMethod)
      router.push(`/home/services/confirmation/${bookedService.id}`)
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
        <Card>
            <CardHeader>
              <CardTitle className="text-2xl p-2">Payment</CardTitle>
              <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{bookedService.service.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>${bookedService.service.price.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>{bookedService.startTime.toLocaleString()} - {bookedService.stopTime.toLocaleString()}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            </CardHeader>
            <CardContent>
            <RadioGroup
                defaultValue="stripe"
                onValueChange={(value) => setPaymentMethod(value)}
                className="mb-6"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center">
                    <CreditCardIcon className="mr-2" /> Stripe
                  </Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="apple" id="apple" />
                  <Label htmlFor="apple" className="flex items-center">
                    <AppleIcon className="mr-2" /> Apple Pay
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center">
                    <PaypalIcon className="mr-2" /> PayPal
                  </Label>
                </div>
              </RadioGroup>
              <Button onClick={onSubmit} disabled={isLoading} className="w-full">
                {isLoading ? <BeatLoader /> : `Pay $${bookedService.service.price.toFixed(2)}`}
              </Button>
          </CardContent>
        </Card>
    </motion.div>
  )
}