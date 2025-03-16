
import { getBookingsByUserId } from "@/utils/data/services"
import { BookingCard } from "@/components/booking-card"
import { parseBookingTime } from "@/utils/helpers/availability"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ProviderHeader } from "../provider/[providerId]/_components/provider-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MyBookingsPage() {

  const bookings = await getBookingsByUserId()

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="flex flex-col gap-4 min-h-screen w-screen pt-8 md:pt-0">
        {/* Header */}
        <ProviderHeader text={"My Bookings"} fixed={false} />

        {/* Content */}
        <div className="container mx-auto p-4 max-w-2xl space-y-4 md:space-y-8">
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
                  />
              ))}
            </TabsContent>
            <TabsContent value="pending" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="PENDING").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  />
              ))}
            </TabsContent>
            <TabsContent value="accepted" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="ACCEPTED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  />
              ))}
            </TabsContent>
            <TabsContent value="rejected" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="REJECTED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  />
              ))}
            </TabsContent>
            <TabsContent value="cancelled" className="flex flex-col gap-4">
              {bookings.filter(booking=>booking.status==="CANCELLED").map((booking, idx)=>(
                <BookingCard 
                  key={idx} 
                  booking={booking}
                  />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGate>
  )
}