import { notFound } from 'next/navigation'
import { getBookingById } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { BackButton } from '@/components/back-button'
import { BookingDetails } from './_components/booking-details'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SideMenu } from '../../../_components/side-menu'

export default async function BookingDetailsPage({ params }: { params: { serviceId: string, bookingId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const booking = await getBookingById(params.bookingId)
  if (!booking || booking.offer.service.providerId !== user.id) return notFound()

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <div className="flex justify-start items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        <SideMenu />
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <Card className="w-full max-w-2xl mt-24 mx-2">
          <CardHeader>
            <CardTitle>Booking for {booking.offer.title}</CardTitle>
            <CardDescription>Manage this booking</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingDetails booking={booking} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}