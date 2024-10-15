import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProviderServices } from '@/actions/services'
import Link from 'next/link'
import { DollarSign, Star } from 'lucide-react'

interface ProviderServicesProps {
  providerId: string
}

export const ProviderServices: React.FC<ProviderServicesProps> = async ({ providerId }) => {
  const services = await getProviderServices(providerId)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Services Offered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <Link href={`/home/(tabs)/services/${service.id}`}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-bold">${service.price.toFixed(2)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 mb-2">{service.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {service.category.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}