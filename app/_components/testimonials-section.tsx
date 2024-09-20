import { TestimonialCard } from "@/app/_components/testimonial-card"

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Alex Johnson"
            course="Computer Science"
            quote="Unihive has made campus life so much easier. I found a great tutor and even started my own study group!"
          />
          <TestimonialCard
            name="Samantha Lee"
            course="Business Administration"
            quote="The marketplace feature is a game-changer. I've saved so much money buying and selling textbooks here."
          />
          <TestimonialCard
            name="Michael Chen"
            course="Engineering"
            quote="Getting around campus has never been easier. The ride-sharing feature is reliable and affordable."
          />
        </div>
      </div>
    </section>
  )
}