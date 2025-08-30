import { FeatureCard } from "@/components/feature-card"

export default function HomePage() {
  return (
    <main>
      <header className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* decorative hero image; text is baked in the image */}
          <img src="/images/hydrosphere-hero.png" alt="" className="h-full w-full object-cover mb-44" />
        </div>
       

        {/* spacer to give vertical height while keeping it minimal */}
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32" />
        {/* subtle scroll affordance to jump to features */}
        <div className="pointer-events-auto absolute bottom-6 left-0 right-0 flex justify-center">
          <a
            href="#features"
            className="rounded-full border border-foreground/20 bg-background/60 px-3 py-3 mb-44 text-sm text-foreground/80 backdrop-blur hover:text-foreground"
          >
            Explore features
          </a>
        </div>
      </header>

      <section id="features" className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-6 py-8 md:grid-cols-2">
        <FeatureCard
          title="Mapping Dashboard"
          description="Toggle renewable layers and explore interactive markers."
          href="/map"
          cta="Explore Map"
        />
        <FeatureCard
          title="Top 5 Cities"
          description="See ranked cities and deep-dive into detailed profiles."
          href="/top-cities"
          cta="View Rankings"
        />
        <FeatureCard
          title="Scenario Simulator"
          description="Adjust weights for cost, renewables, and infrastructure."
          href="/simulate"
          cta="Simulate"
        />
        <FeatureCard
          title="Learn Hub"
          description="Basics, policies, applications, and comparisons."
          href="/learn"
          cta="Start Learning"
        />
      </section>
    </main>
  )
}
