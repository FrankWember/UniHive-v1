"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductRequest, Product, User } from '@prisma/client'
import { acceptDiscountRequest, rejectDiscountRequest } from '@/actions/products'

type ProductRequestWithDetails = ProductRequest & {
  product: Product
  customer: User
}

export function ProductRequestsList({my_requests}: {my_requests: ProductRequestWithDetails[]}) {
  const [requests, setRequests] = useState<ProductRequestWithDetails[]>(my_requests)

  const handleAccept = async (id: string) => {
    await acceptDiscountRequest(id)
    setRequests(requests.map(request => 
      request.id === id ? { ...request, isAccepted: true } : request
    ))
  }

  const handleReject = async (id: string) => {
    await rejectDiscountRequest(id)
    setRequests(requests.map(request => 
      request.id === id ? { ...request, isDenied: true } : request
    ))
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{request.product.name}</h3>
                <p className="text-sm text-muted-foreground">Requested by: {request.customer.name}</p>
              </div>
              <Badge variant={!request.isAccepted && !request.isDenied ? 'outline' : request.isAccepted ? 'default' : 'destructive'}>
                {!request.isAccepted && !request.isDenied ? 'Pending' : request.isAccepted ? 'Accepted' : 'Rejected'}
              </Badge>
            </div>
            <div className="mt-4">
              <p>Quantity: {request.quantity}</p>
              <p>Total Price: ${request.price.toFixed(2)}</p>
              <p>Delivery Time: {new Date(request.deliveryTime).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {!request.isAccepted && !request.isDenied && (
              <>
                <Button variant="outline" onClick={() => handleReject(request.id)}>Reject</Button>
                <Button onClick={() => handleAccept(request.id)}>Accept</Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
      {requests.length === 0 && (
        <p className="text-center text-muted-foreground">No product requests at the moment.</p>
      )}
    </div>
  )
}