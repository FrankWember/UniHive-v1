
import { redirect } from "next/navigation"
import { getBookingsByUserId } from "@/utils/data/services"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { currentUser } from "@/lib/auth"
import { BackButton } from "@/components/back-button"

export default async function MyBookingsPage() {
  const user = await currentUser()

  const bookings = await getBookingsByUserId(user!.id!)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-24 pb-24">
        <DataTable columns={columns} data={bookings} />
      </div>
    </div>
  )
}