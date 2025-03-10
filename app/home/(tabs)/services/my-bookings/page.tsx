
import { getAllProviderAppointments } from "@/utils/data/services"
import { BookingCard } from "@/components/booking-card"
import { parseBookingTime } from "@/utils/helpers/availability"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ProviderNav } from "../provider/[providerId]/_components/provider-nav"
import { ProviderHeader } from "../provider/[providerId]/_components/provider-header"

export default async function MyBookingsPage() {

  const bookings = await getAllProviderAppointments()

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-screen">
        {/* Header */}
        <ProviderHeader text={"My Appointments"} />

        <div className='w-full'>
            <ProviderNav />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 mt-24 pb-24 flex flex-col gap-4">
          {bookings.map((booking, idx)=>(
            <BookingCard 
              key={idx} 
              title={booking.offer.title} 
              dayOfTheWeek={booking.date.toLocaleDateString('default', { weekday: 'short' })} 
              dayOfTheMonth={booking.date.toLocaleDateString('default', { day: 'numeric' })} 
              startTime={parseBookingTime(booking.time)?.startTime ?? ''}
              endTime={parseBookingTime(booking.time)?.endTime ?? ''}
              location={booking.location ?? ''}
              price={booking.offer.price}
              status={booking.status}
              />
          ))}
        </div>
      </div>
    </RoleGate>
  )
}