import { notFound } from 'next/navigation'
import { getServiceById } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { BookingForm } from './_components/booking-form'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type TimeSlot = [string, string];

type DayAvailability = {
  monday?: TimeSlot[] | undefined;
  tuesday?: TimeSlot[] | undefined;
  wednesday?: TimeSlot[] | undefined;
  thursday?: TimeSlot[] | undefined;
  friday?: TimeSlot[] | undefined;
  saturday?: TimeSlot[] | undefined;
  sunday?: TimeSlot[] | undefined;
}


export default async function BookServicePage({ params }: { params: { serviceId: string, offerId: string } }) {
  const user = await currentUser()
     if (!user) {
                const callbackUrl = encodeURIComponent(`/home/services/${service.id}`)
                router.push(`/auth/sign-in?callbackUrl=${callbackUrl}`)
                return
            }

  const service = await getServiceById(params.serviceId)
  if (!service) return notFound()

  const offer = service.offers.find(o => o.id === params.offerId)
  if (!offer) return notFound()

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Book Service</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <Card className='max-w-md h-fit mt-24 mx-2'>
          <CardHeader>
            <CardTitle>Booking: {service.name}</CardTitle>
            <CardDescription>
              {offer.title} - ${offer.price}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm service={service} offerId={params.offerId} offer={offer} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
