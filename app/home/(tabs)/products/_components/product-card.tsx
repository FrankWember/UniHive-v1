import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@prisma/client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={product.images[0] || '/placeholder.png'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.description}</p>
        <p className="font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4">
        <Button asChild className="w-full">
          <Link href={`/home/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}