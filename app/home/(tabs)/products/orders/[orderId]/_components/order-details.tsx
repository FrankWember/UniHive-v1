'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Cart, CartItem, Product, User } from '@prisma/client'
import { updateDeliveryStatus } from '@/actions/cart'

type Order = CartItem & {
  cart: Cart & {
    customer: User
  }
  product: Product
}

export function OrderDetails({ order }: { order: Order }) {
  const {toast} = useToast()

  const handleMarkAsDelivered = async () => {
    try {
      await updateDeliveryStatus(order.id, true)

      toast({
        title: 'Order Updated',
        description: 'The order has been marked as delivered.',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the order status.',
        variant: 'destructive',
      })
    }
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Table>
        <TableCaption>Order Items</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>{order.product.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Quantity</TableCell>
            <TableCell>{order.quantity}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>${order.price.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>${(order.quantity * order.price).toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {!order.isDelivered && (
        <Button onClick={handleMarkAsDelivered} className="mt-6">
          Mark as Delivered
        </Button>
      )}
    </div>
  )
}