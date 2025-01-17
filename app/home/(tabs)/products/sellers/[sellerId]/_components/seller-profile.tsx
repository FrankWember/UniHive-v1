import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Star } from 'lucide-react'
import { Product, User, ProductReview, CartItem } from '@prisma/client'
import { calculateProductReviewMetrics } from "@/utils/helpers/reviews"
import { Table, TableRow, TableCell, TableHead, TableCaption, TableBody } from "@/components/ui/table"

interface SellerProfileProps {
  seller: User & {
    products: ( Product & { 
      reviews: ProductReview[],
      cartItems: ({
        quantity: number,
        price: number,
        cart: {
          customer: {
            image: string|null
          }
        }
      })[]
    })[]
  }
}

export function SellerProfile({ seller }: SellerProfileProps) {

  const ratingMetrics = React.useMemo(() => {
    let overall = calculateProductReviewMetrics(seller.products.flatMap(product => product.reviews))
    return {
      experience: overall?.experience || 0,
      communication: overall?.communication || 0,
      meetUp: overall?.meetUp || 0,
      packaging: overall?.packaging || 0,
      location: overall?.location || 0,
      value: overall?.value || 0,
      overall: overall?.overall || 0,
    }
  }, [seller.products])

  const customers = seller.products.flatMap(product => product.cartItems).map(cartItem => cartItem.cart.customer)
  const totalQuantitySold = seller.products.reduce((acc, product) => acc + product.cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0), 0)

  return (
    <Card className="mb-6 w-full h-fit">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-20 w-20 lg:h-48 lg:w-48">
          <AvatarImage src={seller.image || undefined} alt={seller.name || 'Seller'} />
          <AvatarFallback>{seller.name ? seller.name[0] : 'S'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl">{seller.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="mr-1 h-4 w-4" />
            Joined {new Date(seller.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center -space-x-3 overflow-hidden">
            {customers.slice(0, 7).map((customer, index) => (
              <Avatar key={index} className="inline-block h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src={customer.image!} alt="C" className="object-cover" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
            ))}
            <p className="pl-6 text-sm">
              {customers.length} active customers and {totalQuantitySold} items sold
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        {seller.bio && (
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{seller.bio}</p>
          </div>
        )}
        <h2 className="text-xl font-semibold">Ratings</h2>
        <Table>
          <TableCaption>Seller Ratings</TableCaption>
          <TableBody>
            <TableRow>
              <TableHead>Overall</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.overall}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>MeetUp</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.meetUp}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.location}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Communication</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.communication}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Packaging</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.packaging}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Experience</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.experience}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Value</TableHead>
              <TableCell className="flex gap-1 items-center">{ratingMetrics.value}<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}