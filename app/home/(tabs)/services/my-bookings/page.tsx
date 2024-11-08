
import { redirect } from "next/navigation"
import { getBookingsByUserId } from "@/actions/service-bookings"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import { currentUser } from "@/lib/auth"

export default async function MyBookingsPage() {
  const user = await currentUser()

  const bookings = await getBookingsByUserId(user!.id!)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <DataTable columns={columns} data={bookings} />
    </div>
  )
}