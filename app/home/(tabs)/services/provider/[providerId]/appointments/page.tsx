
import { getAllProviderAppointments } from "@/utils/data/services"
import { currentUser } from "@/lib/auth"
import { BookingCard } from "@/components/booking-card"
import { parseBookingTime } from "@/utils/helpers/availability"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ProviderNav } from "../_components/provider-nav"
import { ProviderHeader } from "../_components/provider-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"

export default async function MyBookingsPage() {
  const bookings = await getAllProviderAppointments()

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="h-full w-screen flex flex-col gap-4 justify-start fixed top-0 left-0 pb-[20rem] mb-[20rem]">
        {/* Header */}
        <ProviderHeader text={"My Appointments"} fixed={false} />

        <div className='w-full'>
              <ProviderNav />
        </div>

        {/* Content */}
        <div className="h-max mx-auto max-w-xl px-4 mb-[30rem]">
          
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="flex flex-col gap-4">
              {bookings.map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  onclick={()=>redirect(`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`)}
                  />
              ))}
            </TabsContent>
            <TabsContent value="pending" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="PENDING").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  onclick={()=>redirect(`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`)}
                  />
              ))}
            </TabsContent>
            <TabsContent value="accepted" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="ACCEPTED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  onclick={()=>redirect(`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`)}
                  />
              ))}
            </TabsContent>
            <TabsContent value="rejected" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="REJECTED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  onclick={()=>redirect(`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`)}
                  />
              ))}
            </TabsContent>
            <TabsContent value="cancelled" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="CANCELLED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  onclick={()=>redirect(`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`)}
                  />
              ))}
            </TabsContent>
          </Tabs>
          <div className="flex h-[20rem] w-full">

          </div>
        </div>
      </div>
    </RoleGate>
  )
}