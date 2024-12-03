'use client'

import { useState } from 'react'
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
import { updateDeliveryDate, updateDeliveryStatus } from '@/actions/cart'
import { BeatLoader } from 'react-spinners'
import { MapIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DatePicker } from '@/components/ui/date-picker'
import { deliveryDateSchema } from '@/constants/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Order = CartItem & {
  cart: Cart & {
    customer: User
  }
  product: Product
}

export function OrderDetails({ order }: { order: Order }) {
  const {toast} = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof deliveryDateSchema>>({
    resolver: zodResolver(deliveryDateSchema),
    defaultValues: {
      deliveryDate: order.deliveryDate || undefined,
    },
  })

  const handleMarkAsDelivered = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof deliveryDateSchema>) => {
    try {
      setLoading(true)
      await updateDeliveryDate(order.id, values.deliveryDate)
      toast({
        title: 'Order Updated',
        description: 'The delivery date has been updated.',
      })
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'There was an error updating the delivery date.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = (location: string | null) => {
    if (!location) {
      return
    }
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    window.open(mapsUrl, '_blank')
  }

  if (!order) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-3'>
      <Table>
        <TableCaption>Order Items</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>{order.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>{order.cart.customer.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contact</TableCell>
            <TableCell>{order.cart.customer.phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Order Date</TableCell>
            <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
          </TableRow>
          {order.deliveryDate && (
            <TableRow>
              <TableCell>Delivery Date</TableCell>
              <TableCell>{order.deliveryDate.toLocaleDateString()}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Delivery Status</TableCell>
            <TableCell>{order.isDelivered ? 'Delivered' : 'Not Delivered'}</TableCell>
          </TableRow>
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
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                className='flex'
                onClick={()=>openInMaps(order.cart.deliveryLocation || order.product.defaultDeliveryLocation)}
                >
                  Location 
                  <MapIcon className='h-4 w-4 ml-2' />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Update Delivery Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select New Delivery Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <BeatLoader /> : 'Update Delivery Date'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {!order.isDelivered && (
          <Button onClick={handleMarkAsDelivered} className="mt-6" disabled={loading}>
            {loading ? <BeatLoader /> : 'Mark as Delivered'}
          </Button>
      )}
    </div>
  )
}