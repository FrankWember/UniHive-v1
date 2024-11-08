import { redirect } from "next/navigation"
import { getBookingById } from "@/actions/service-bookings"
import { MyBookingDetails } from "./_components/my-booking-details"
import { currentUser } from "@/lib/auth"

export default async function MyBookingPage({ params }: { params: { myBookingId: string } }) {
  const user = await currentUser()

  const booking = await getBookingById(params.myBookingId)

  if (!booking || booking.buyerId !== user!.id) {
    redirect("/home/services/my-bookings")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <MyBookingDetails booking={booking} userId={user!.id!} />
    </div>
  )
}