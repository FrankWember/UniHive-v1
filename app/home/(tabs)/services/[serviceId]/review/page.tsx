import { redirect } from "next/navigation"
import { getServiceById } from "@/actions/services"
import { ReviewForm } from "./_components/review-form"
import { BackButton } from "@/components/back-button"
import { currentUser } from "@/lib/auth"

export default async function ReviewPage({ params }: { params: { serviceId: string } }) {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  const service = await getServiceById(params.serviceId)

  if (!service) {
    redirect("/home/services")
  }

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Header */}
      <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
        <BackButton />
        <h1 className="text-2xl font-bold">Rate Service</h1>
      </div>

      {/* Content */}
      <div className="flex w-screen justify-center pb-24 pt-20">
        <ReviewForm serviceId={service.id} userId={user.id!} serviceName={service.name} />
      </div>
    </div>
  )
}