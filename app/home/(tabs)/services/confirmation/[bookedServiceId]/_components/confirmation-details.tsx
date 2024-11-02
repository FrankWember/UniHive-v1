"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { reportScam } from '@/actions/services'
import { BookedServices, Service } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BeatLoader } from 'react-spinners'


interface ConfirmationDetailsProps {
  bookedService: BookedServices & { service: Service }
  userId: string
}

export function ConfirmationDetails({ bookedService, userId }: ConfirmationDetailsProps) {
  const router = useRouter()
  const [isReporting, setIsReporting] = useState(false)

  async function handleReportScam() {
    setIsReporting(true)
    try {
      await reportScam(bookedService.id, userId)
      router.push('/home/services/scam-report-submitted')
    } catch (error) {
      console.error('Error reporting scam:', error)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto pb-24"
    >
      <Card className="p-4 space-y-4">
        <Alert>
          <CheckCircle />
          <AlertTitle>Booking Confirmed</AlertTitle>
          <AlertDescription className="text-muted-foreground">Your service has been successfully booked and paid for.</AlertDescription>
        </Alert>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
                <TableRow>
                    <TableCell>Services</TableCell>
                    <TableCell>{bookedService.service.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell>${bookedService.service.price.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{bookedService.dateTime.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{bookedService.status}</TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <Alert>
          <AlertTriangle />
          <AlertTitle>Payment Information</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Please note that the payment will be held in escrow until the service is completed. If you believe you've been scammed, please report it immediately.
          </AlertDescription>
        </Alert>
        <CardFooter>
          <Button onClick={handleReportScam} variant="destructive" disabled={isReporting} className="w-full">
            {isReporting ? <BeatLoader /> : "Report Scam"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}