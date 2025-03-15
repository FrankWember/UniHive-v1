import React from 'react'
import { ServiceCard } from '../../../_components/service-card'
import { Service, ServiceReview, User, Product, ProductReview } from '@prisma/client'
import { ProductCard } from '@/app/home/(tabs)/products/_components/product-card'
import { Separator } from '@/components/ui/separator'

interface ProviderServicesProps {
  services: ( Service & { 
    reviews: ServiceReview[], 
    provider: User,
    offers: ({
      bookings: ({
        customer: {
          image: string|null
        }
      })[]
    })[]
  })[],
  products: ( Product & {
    reviews: ProductReview[]
  })[]
}

export const ProviderServices: React.FC<ProviderServicesProps> = ({ services, products }) => {

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-2xl font-bold py-4">Services Offered</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 gap-y-8 md:gap-5 px-3 py-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {services.length === 0 && (
        <p className="text-center text-muted-foreground">This seller has no products yet.</p>
      )}
      {/* <Separator className='my-8' />
      <h2 className="text-2xl font-bold py-4">Products by this Provider</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div> */}
    </div>
  )
}