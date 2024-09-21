import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Unihive Today</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Start exploring the best of campus life. Sign up now and connect with your university community.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input className="w-full border-muted-foreground" placeholder="Enter your student email" type="email" />
              <Button type="submit">Sign Up</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}