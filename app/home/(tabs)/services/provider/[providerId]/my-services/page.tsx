
import { BackButton } from "@/components/back-button"
import { getAllProviderServices } from "@/utils/data/services"
import { RoleGate } from "@/components/role-gate"
import { UserRole } from "@prisma/client"
import { ServiceCard } from "../../../_components/service-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProviderNav } from "../_components/provider-nav"
import { ProviderHeader } from "../_components/provider-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export default async function MyBookingsPage() {
    const myServices = await getAllProviderServices()

  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
        <div className="flex flex-col min-h-screen w-screen">
            {/* Header */}
            <ProviderHeader text={"My Services"} />

            <div className='w-full mt-[30rem] md:mt-[20rem]'>
                <ProviderNav />
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 mt-[54rem] md:mt-[4rem] md:pt-0 pb-24 flex flex-col gap-4">
                
                <div className="flex justify-end">
                    <Link href="/home/services/add">
                        <Button>
                            <Plus className="h-4 w-4" />
                            <span>Create a Service</span>
                        </Button>
                    </Link>
                </div>
                <Suspense fallback={(
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 px-3 py-6">
                        {[...Array(15)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <Skeleton className="h-56 w-full rounded-lg" />
                        </div>
                        ))}
                    </div>
                )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 px-3 py-6">
                        {myServices.map((service, idx)=>(
                            <ServiceCard service={service} key={idx} url={`/home/services/provider/${service.providerId}/my-services/${service.id}`} />
                        ))}
                    </div>
                </Suspense>
            </div>
        </div>
    </RoleGate>
  )
}