export function TestimonialCard({ name, course, quote }: { name: string, course: string, quote: string }) {
    return (
      <div className="flex flex-col items-center text-center bg-muted p-6 rounded-lg">
        <p className="text-muted-foreground mb-4">"{quote}"</p>
        <p className="font-bold">{name}</p>
        <p className="text-sm text-muted-foreground">{course}</p>
      </div>
    )
  }