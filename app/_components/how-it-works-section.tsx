export function HowItWorksSection() {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p className="text-muted-foreground">Create your DormBiz account with your student email.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">Explore Services</h3>
              <p className="text-muted-foreground">Browse through various services and features available on campus.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Connect & Enjoy</h3>
              <p className="text-muted-foreground">Book services, join groups, or list items with just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>
    )
  }