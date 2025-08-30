import { FeatureCard } from "@/components/feature-card"

export default function HomePage() {
  return (
    <main>
      <header className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/images/hydrosphere-hero.png" alt="HydroSphere Hero" className="h-full w-full object-cover" />
        </div>
        
        {/* Content overlay
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to HydroSphere
          </h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg max-w-2xl px-6">
            Explore renewable energy mapping, city rankings, and scenario simulation
          </p>
        </div> */}

        {/* subtle scroll affordance to jump to features */}
        <div className="pointer-events-auto absolute bottom-6 left-0 right-0 flex justify-center">
          <a
            href="#features"
            className="rounded-full border border-white/30 bg-black/20 px-4 py-3 text-sm text-white backdrop-blur hover:bg-black/30 transition-colors"
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
