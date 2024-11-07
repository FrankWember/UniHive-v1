import { notFound } from 'next/navigation'
import { getServiceById, getBookingsForService } from '@/actions/services'
import { currentUser } from '@/lib/auth'
import { BackButton } from '@/components/back-button'
import { BookingsTable } from './_components/bookings-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function ServiceBookingsPage({ params }: { params: { serviceId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const service = await getServiceById(params.serviceId)
  if (!service || service.providerId !== user.id) return notFound()

  const bookings = await getBookingsForService(params.serviceId)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Service Bookings</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <Card className="w-full max-w-4xl mt-24 mx-2">
          <CardHeader>
            <CardTitle>{service.name} - Bookings</CardTitle>
            <CardDescription>Manage your service bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingsTable bookings={bookings} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}