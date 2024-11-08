"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Clock, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { reportScam } from '@/actions/services'
import { BookedServices, Service } from '@prisma/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

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
      className="max-w-3xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Booking Confirmed</AlertTitle>
            <AlertDescription>
              Your service has been successfully booked and paid for.
            </AlertDescription>
          </Alert>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Status</span>
            <Badge variant="success">{bookedService.status}</Badge>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Service</TableCell>
                <TableCell>{bookedService.service.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <DollarSign className="inline-block mr-2" /> Price
                </TableCell>
                <TableCell>${bookedService.service.price.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <Clock className="inline-block mr-2" /> Date and Time
                </TableCell>
                <TableCell>
                  {bookedService.startTime.toLocaleString()} - {bookedService.stopTime.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>Notes</AlertTitle>
            <AlertDescription>
              {bookedService.notes || 'No additional notes'}
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Payment Information</AlertTitle>
            <AlertDescription>
              Please note that the payment will be held in escrow until the service is completed. If you believe you've been scammed, please report it immediately.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReportScam} variant="destructive" disabled={isReporting} className="w-full">
            {isReporting ? "Reporting..." : "Report Scam"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}