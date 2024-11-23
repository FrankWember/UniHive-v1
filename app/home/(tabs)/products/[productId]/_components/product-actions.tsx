"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { addToCart } from '@/actions/cart'
import { useToast } from '@/hooks/use-toast'
import { useCurrentUser } from '@/hooks/use-current-user'

interface ProductActionsProps {
  product: Product & { seller: User }
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const user = useCurrentUser()

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
    //   await addToCart(product.id, quantity, user!.id!)
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Seller</Label>
            <p className="text-sm text-muted-foreground mt-1">{product.seller.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => router.push(`/home/products/seller/${product.sellerId}`)}
          variant="outline"
        >
          View Seller
        </Button>
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
        >
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}