import React from 'react'
import { BackButton } from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { SearchBar } from '../../_components/search-bar'
import Image from 'next/image'
import Link from 'next/link'
import { currentUser } from '@/lib/auth'
import { getServiceOffers } from '@/utils/data/services'
import { Badge } from '@/components/ui/badge'
import { DeleteOfferDialog } from './_components/delete-offer-dialog'

const OffersPage = async ({params}: {params: {serviceId: string}}) => {
  const offers = await getServiceOffers(params.serviceId)
  const user = await currentUser()
  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
            <BackButton />
            <Link href="/home/services">
              <Image src="/Unihive.svg" alt="logo" width={50} height={50} className="rounded-md border" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar />
            {user?(
              <Link href={`/home/services/cart`}>
                <Button variant="outline" size="icon">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </Link>
            ):(
              <Link href={`/auth/sign-up`}>
                <Button>
                  Join
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center mt-20">
          {offers.map((offer) => (
            <div key={offer.id} className="flex flex-col justify-start border rounded-md p-3">
              <p className="text-2xl font-bold">{offer.title}</p>
              <div className="flex items-center gap-2">
                {offer.discount>0 && (<span className='text-muted-foreground line-through'>${offer.price}</span>)}
                <span className="font-semibold">${(offer.price - (offer.price * offer.discount / 100)).toFixed(2)}</span>
                <Badge className="ml-5" variant='success'>
                  {offer.discount}% off
                </Badge>
              </div>
              <div className="flex itemss-center justify-end gap-2">
                <Link href={`/home/services/${params.serviceId}/offers/${offer.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
                <DeleteOfferDialog offer={offer} />
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}



export default OffersPage