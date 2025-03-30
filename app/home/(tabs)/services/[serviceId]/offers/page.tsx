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
import { redirect } from 'next/navigation'
import { SideMenu } from '../../_components/side-menu'

const OffersPage = async ({params}: {params: {serviceId: string}}) => {
  
  const user = await currentUser()

  if (!user) {
    const callbackUrl = encodeURIComponent(`/home/services/${params.serviceId}/offers`);
    redirect(`/auth/sign-in?callbackUrl=${callbackUrl}`)
  }
  const offers = await getServiceOffers(params.serviceId)

  return (
    <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <div className="flex items-center justify-between h-16 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <div className="flex justify-start items-center gap-3">
            <BackButton />
            <Link href="/home/services/${serviceId}">
              <Image src="/DormBiz.png" alt="logo" width={50} height={50} className="rounded-md border" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <SearchBar />
            <SideMenu />
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-4 items-center justify-center my-28">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-2xl font-bold">Offers</h1>
            <Badge className="my-2" variant="secondary">
              {offers.length} offers
            </Badge>
          </div>
          {offers.map((offer) => (
            <div key={offer.id} className="flex flex-col justify-start border rounded-md p-3">
              <p className="text-2xl font-bold">{offer.title}</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">${offer.price.toFixed(2)}</span>
                <Badge className="my-2" variant="outline">
                  {offer.duration} mins
                </Badge>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link href={`/home/services/${params.serviceId}/offers/${offer.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
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
