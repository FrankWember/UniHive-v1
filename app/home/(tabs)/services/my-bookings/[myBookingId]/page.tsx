import { redirect } from "next/navigation"
import { getBookingById } from "@/actions/service-bookings"
import { MyBookingDetails } from "./_components/my-booking-details"
import { currentUser } from "@/lib/auth"
import { BackButton } from "@/components/back-button"

export default async function MyBookingPage({ params }: { params: { myBookingId: string } }) {
  const user = await currentUser()

  const booking = await getBookingById(params.myBookingId)

  if (!booking || booking.buyerId !== user!.id) {
    redirect("/home/services/my-bookings")
  }

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Booking Details</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24">
        <MyBookingDetails booking={booking} userId={user!.id!} />
      </div>
    </div>
  )
}