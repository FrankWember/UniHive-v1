import { BookOpen, Car, MessageCircle, Scissors, ShoppingBag, Users } from "lucide-react"
import { FeatureCard } from "@/app/_components/feature-card"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard title="Student Services" description="Find hair styling, tutoring, coaching, and more.">
            <Scissors className="w-6 h-6 text-primary" />
          </FeatureCard>
          <FeatureCard title="Campus Rides" description="Get around campus easily with student drivers.">
            <Car className="w-6 h-6 text-primary" />
          </FeatureCard>
          <FeatureCard title="Marketplace" description="Buy and sell items within your campus community.">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </FeatureCard>
          <FeatureCard title="Study Groups" description="Join or create study groups for your courses.">
            <Users className="w-6 h-6 text-primary" />
          </FeatureCard>
          <FeatureCard title="Assignments Help" description="Collaborate on assignments and projects.">
            <BookOpen className="w-6 h-6 text-primary" />
          </FeatureCard>
          <FeatureCard title="Campus Activities" description="Stay updated on events and activities.">
            <MessageCircle className="w-6 h-6 text-primary" />
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}