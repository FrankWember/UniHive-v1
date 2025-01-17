import { ProductCard } from '../../../_components/product-card'
import { Product, User, ProductReview, Service, ServiceReview } from '@prisma/client'
import { ServiceCard } from '@/app/home/(tabs)/services/_components/service-card'
import { Separator } from '@/components/ui/separator'

interface SellerProductsProps {
  seller: User & {
    products: (Product & { 
      reviews: ProductReview[] 
    })[],
    services: (Service & { 
      offers: ({
        bookings: ({
          customer: {
            image: string|null
          }
        })[]
      })[]
      reviews: ServiceReview[]
      provider: User
    })[]
  }
}

export function SellerProducts({ seller }: SellerProductsProps) {

  return (
    <div className='space-y-8 pb-20'>
      <h2 className="text-2xl font-bold py-4">Products by this Seller</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {seller.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {seller.products.length === 0 && (
        <p className="text-center text-muted-foreground">This seller has no products yet.</p>
      )}
      <Separator className='my-8' />
      <h2 className="text-2xl font-bold py-4">Services from this Provider</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {seller.services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}