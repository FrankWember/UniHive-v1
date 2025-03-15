
import { getAllProviderAppointments } from "@/utils/data/services"
import { BackButton } from "@/components/back-button"
import BookingsCalendar from "./_components/bookings-calendar"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ProviderNav } from "../_components/provider-nav"
import { ProviderHeader } from "../_components/provider-header"

export default async function MyCalendarPage() {

  const bookings = await getAllProviderAppointments()

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
        <div className="flex flex-col items-center h-full w-screen pt-8 md:pt-0">
            {/* Header */}
            <ProviderHeader text={"My Calendar"} fixed={false} />

            <div className='w-full pt-8'>
                <ProviderNav />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-10 sm:mt-0 pb-24">
                <BookingsCalendar bookings={bookings} />
            </div>
        </div>
    </RoleGate>
  )
}