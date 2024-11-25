import { notFound } from 'next/navigation'
import { getServiceById } from '@/utils/data/services'
import { currentUser } from '@/lib/auth'
import { BookingForm } from './_components/booking-form'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'


export default async function BookServicePage({ params }: { params: { serviceId: string } }) {
  const user = await currentUser()
  if (!user) return notFound()

  const service = await getServiceById(params.serviceId)
  if (!service) return notFound()

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Booking Service</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <Card className='max-w-md h-fit mt-24 mx-2'>
          <CardHeader>
            <CardTitle>Booking</CardTitle>
            <CardDescription>You can book this service: {service.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm service={service} userId={user.id!} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}