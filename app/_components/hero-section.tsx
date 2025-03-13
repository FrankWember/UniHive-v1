"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Your Campus Life, Simplified
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              DormBiz connects students with services, rides, study groups, and more. Your one-stop platform for
              all things campus life.
            </p>
          </div>
          <div className="space-x-4">
            <Button onClick={()=>router.push("/auth/sign-up")}>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
  )
}