
import { redirect } from "next/navigation"
import { getBookingsByUserId } from "@/actions/service-bookings"
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
      <div className="flex h-16 w-full"></div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <DataTable columns={columns} data={bookings} />
      </div>
    </div>
  )
}