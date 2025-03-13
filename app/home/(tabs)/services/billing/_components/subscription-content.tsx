import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Subscription } from '@prisma/client'
import React from 'react'

export const SubscriptionContent = ({subscription}: {subscription: Subscription | null}) => {
  return (
    <Card className="w-full mx-auto bg-muted">
        <CardHeader>
            <CardTitle>My Subscription</CardTitle>
            <CardDescription>Manage your subscriptions and billing information</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableCell>{subscription?.id || '/'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableCell>{subscription?.status || '/'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Payment Method</TableHead>
                    <TableCell>{subscription?.paymentMethod || '/'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableCell>{subscription?.startDate?.toLocaleDateString() || '/'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>End Date</TableHead>
                    <TableCell>{subscription?.endDate?.toLocaleDateString() || '/'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {!subscription && (
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold">You don't have any subscriptions yet</h2>
                  <p className="text-muted-foreground">You can use our secured payment providers to suscribe to DormBiz service providers</p>
                </div>
              )}
        </CardContent>
    </Card>
  )
}
