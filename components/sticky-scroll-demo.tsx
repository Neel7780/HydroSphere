"use client";
import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { Map, Database, Building, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

const createFeatureContent = (router: any) => [
  {
    title: "Interactive Infrastructure Map",
    description:
      "Comprehensive mapping platform that visualizes renewable capacity, water resources, industrial demand clusters, and logistics networks. Features intelligent highlighting of the top 5 cities identified through advanced scoring algorithms, with clickable markers leading to detailed city profiles.",
    content: (
      <button 
        onClick={() => router.push('/map')}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-secondary text-primary-foreground rounded-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Map className="w-16 h-16 animate-pulse group-hover:animate-bounce" />
          <span className="text-2xl font-bold text-center">Interactive Infrastructure Map</span>
          <p className="text-sm text-center opacity-90 max-w-xs">Smart mapping with clickable city profiles</p>
        </div>
      </button>
    ),
  },
  {
    title: "Dynamic Data Integration",
    description:
      "Advanced system utilizing APIs and comprehensive datasets to gather both live and static data for Green Hydrogen Infrastructure Mapping & Optimization. Features automated backend scoring system that intelligently ranks potential hydrogen hubs based on real-time data analysis.",
    content: (
      <button 
        onClick={() => router.push('/content')}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent via-accent/80 to-primary text-primary-foreground rounded-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-accent/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Database className="w-16 h-16 animate-bounce group-hover:animate-pulse" />
          <span className="text-2xl font-bold text-center">Dynamic Data Integration</span>
          <p className="text-sm text-center opacity-90 max-w-xs">Live data with automated scoring</p>
        </div>
      </button>
    ),
  },
  {
    title: "City/Region Profiles",
    description:
      "Dedicated comprehensive pages for each shortlisted site featuring detailed analysis of renewable energy potential, water availability assessments, industrial demand mapping, and infrastructure readiness evaluations. Complete data-driven insights for informed decision making.",
    content: (
      <button 
        onClick={() => router.push('/top-cities')}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary via-secondary/80 to-accent text-primary-foreground rounded-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-secondary/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <Building className="w-16 h-16 animate-pulse group-hover:animate-bounce" />
          <span className="text-2xl font-bold text-center">City/Region Profiles</span>
          <p className="text-sm text-center opacity-90 max-w-xs">Detailed site analysis and insights</p>
        </div>
      </button>
    ),
  },
  {
    title: "Optimization Dashboard",
    description:
      "Interactive control center allowing users to adjust filters and prioritize criteria such as lowest cost versus highest renewables. Features dynamic ranking system that updates in real-time based on chosen weights, providing flexible optimization for strategic planning.",
    content: (
      <button 
        onClick={() => router.push('/simulator')}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground rounded-2xl relative overflow-hidden group hover:scale-105 transition-all duration-300 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <BarChart3 className="w-16 h-16 group-hover:animate-pulse" />
          <span className="text-2xl font-bold text-center">Optimization Dashboard</span>
          <p className="text-sm text-center opacity-90 max-w-xs">Dynamic filtering and ranking system</p>
        </div>
      </button>
    ),
  },
];

export function StickyScrollRevealDemo() {
  const router = useRouter();
  const content = createFeatureContent(router);

  return (
    <div className="w-full relative overflow-hidden" id="sticky-scroll-section" style={{
      background: 'transparent',
      marginTop: 0,
      paddingTop: 0,
      zIndex: 1
    }}>
      
      <div className="relative z-2">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight text-foreground mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Green Hydrogen Infrastructure Mapping & Optimization
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced platform for identifying, analyzing, and optimizing green hydrogen infrastructure locations through intelligent data integration and interactive mapping technology.
            </p>
          </div>
          <StickyScroll content={content} />
        </div>
      </div>
    </div>
  );
}
