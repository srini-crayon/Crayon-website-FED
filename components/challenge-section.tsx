"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function ChallengeSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  const challenges = [
    {
      number: "01",
      title: "Fragmented data and legacy systems",
      description: "Data silos and legacy systems create integration complexity that stalls AI initiatives.",
      stat: "—",
      statLabel: "Enterprises struggle with fragmented data"
    },
    {
      number: "02",
      title: "Governance, risk, and accuracy concerns",
      description: "Risk management, accuracy requirements, and regulatory compliance slow every deployment.",
      stat: "—",
      statLabel: "Governance gaps block production"
    },
    {
      number: "03",
      title: "Slow movement from idea to deployment",
      description: "The gap between AI capability and enterprise reality grows wider each quarter.",
      stat: "—",
      statLabel: "Ideas stay in pilot mode"
    },
    {
      number: "04",
      title: "Tools that don't fit real-world complexity",
      description: "Generic solutions built for demos fail when facing real-world enterprise complexity.",
      stat: "—",
      statLabel: "Tool mismatch limits impact"
    },
    {
      number: "05",
      title: "Rapid evolution of AI technologies",
      description: "Models and vendors change fast; enterprises need to evolve without rebuilding from scratch.",
      stat: "—",
      statLabel: "Keeping pace with AI evolution"
    }
  ]

  return (
    <section id="solutions" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                The Real Challenge
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              <span className="bg-gradient-to-r from-[oklch(0.6_0.3_260)] to-[oklch(0.7_0.3_330)] bg-clip-text text-transparent">
                AI isn't the problem.
              </span>
              <span className="block font-medium text-foreground">Making it work inside enterprises is.</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            The result? Meetings. Demos. Minimal enterprise impact.
          </p>
        </div>

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-5 gap-px bg-border overflow-hidden">
          {challenges.map((challenge, index) => {
            const accentColors = [
              "oklch(0.55 0.2 260)", // Purple
              "oklch(0.65 0.2 175)", // Teal
              "oklch(0.65 0.2 330)", // Pink
              "oklch(0.7 0.18 75)",  // Orange
              "oklch(0.55 0.2 260)", // Purple
            ]
            const accentColor = accentColors[index]
            
            return (
              <div
                key={index}
                className="bg-background p-8 md:p-10 group cursor-pointer relative border border-transparent transition-all duration-300 flex flex-col"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  borderColor: hoveredIndex === index ? accentColor : undefined
                }}
              >
                {/* Number */}
                <div className="flex items-center gap-2 mb-4 h-4">
                  {/* Left accent line */}
                  <div
                    className="w-[3px] transition-all duration-500 ease-out rounded-r-full shrink-0"
                    style={{
                      height: hoveredIndex === index ? "calc(100% - 2rem)" : "1rem",
                      backgroundColor: accentColor
                    }}
                  />
                  <span 
                    className="text-xs font-mono tracking-wider transition-colors duration-300 leading-none"
                    style={{
                      color: accentColor
                    }}
                  >
                    {challenge.number}
                  </span>
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl font-medium mb-3 flex items-center gap-3 transition-colors duration-300"
                  style={{
                    color: hoveredIndex === index ? accentColor : undefined
                  }}
                >
                  {challenge.title}
                  <ArrowRight 
                    className={`w-4 h-4 transition-all duration-300 ${
                      hoveredIndex === index 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-2'
                    }`}
                    style={{
                      color: hoveredIndex === index ? accentColor : undefined
                    }}
                  />
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  {challenge.description}
                </p>
                
                {/* Stat */}
                <div className="pt-6 border-t border-border">
                  <span 
                    className="text-3xl font-light transition-colors duration-300"
                    style={{
                      color: hoveredIndex === index ? accentColor : undefined
                    }}
                  >
                    {challenge.stat}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {challenge.statLabel}
                  </p>
                </div>

                {/* Hover accent line */}
                <div 
                  className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
                  style={{
                    width: hoveredIndex === index ? '100%' : '0',
                    backgroundColor: accentColor
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center flex flex-col items-center gap-4">
          <a
            href="/catalyst"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
          >
            See How We Break the Pilot Loop with Catalyst
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
