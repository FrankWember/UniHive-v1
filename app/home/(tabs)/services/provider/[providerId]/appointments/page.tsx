import { getAllProviderAppointments } from "@/utils/data/services"
import { BookingCard } from "@/components/booking-card"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ProviderNav } from "../_components/provider-nav"
import { ProviderHeader } from "../_components/provider-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function MyBookingsPage() {
  const bookings = await getAllProviderAppointments()

  const tabOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ]

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="min-h-screen w-full flex flex-col gap-4 pt-8 md:pt-0">
        <ProviderHeader text="My Appointments" fixed={false} />
        <div className="container mx-auto p-4 max-w-2xl space-y-4 md:space-y-8">
          <ProviderNav />
          <Tabs defaultValue="all">
            <TabsList className="mb-4 border-b">
              {tabOptions.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabOptions.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="flex flex-col gap-4">
                {(tab.value === "all"
                  ? bookings
                  : bookings.filter((booking) => booking.status === tab.value.toUpperCase())
                ).map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/home/services/${booking.offer.serviceId}/bookings/${booking.id}`}
                  >
                    <BookingCard booking={booking} />
                  </Link>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </RoleGate>
  )
}