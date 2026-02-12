"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

export function FoundationSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const milestones = [
    {
      number: "01",
      title: "Patented AI innovations",
      description: "3 proprietary AI patents powering enterprise systems",
      metric: "3 Patents",
    },
    {
      number: "02",
      title: "Customer genomes built",
      description: "Personalization and recommendation at scale",
      metric: "200M+ Genomes",
    },
    {
      number: "03",
      title: "Production deployments",
      description: "Global enterprises across regulated environments",
      metric: "Live in Production",
    },
    {
      number: "04",
      title: "Regulated environments",
      description: "Systems operating in regulated environments",
      metric: "Enterprise-Ready",
    },
  ]

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left - Text Content */}
          <div className="lg:sticky lg:top-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Since 2012
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-8">
              <span className="bg-gradient-to-r from-[oklch(0.5_0.3_175)] to-[oklch(0.65_0.3_330)] bg-clip-text text-transparent">
                Reimagined. Not
              </span>
              <span className="block font-medium text-foreground">Reinvented.</span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
              When GenAI and agentic AI reshaped the landscape, we didn't bolt new models onto old systems. We rebuilt. We sunset maya.ai. We redesigned our core architecture. We restructured the company around platform + execution. This wasn't cosmetic. It was structural.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12 max-w-md">
              And this isn't our first gig. We've been building enterprise AI since 2012. We know what it takes to move from pilot to production. We've done it before. Now we've redesigned for what's next.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-12">
              <div>
                <p className="text-4xl font-light text-foreground">13B+</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  Transactions
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-4xl font-light text-foreground">12+</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  Years
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-4xl font-light text-foreground">117M+</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                  Users
                </p>
              </div>
            </div>
          </div>

          {/* Right - Box Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map((item, index) => {
              const accentColors = [
                "oklch(0.55 0.2 260)", // Purple
                "oklch(0.65 0.2 175)", // Teal
                "oklch(0.65 0.2 330)", // Pink
                "oklch(0.7 0.18 75)",  // Orange
              ]
              const accentColor = accentColors[index]
              
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative bg-background border border-border/60 p-5 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]"
                >
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-t-transparent border-r-[24px] border-r-transparent transition-all duration-300 group-hover:border-t-accent/20 group-hover:border-r-accent/20" />
                  
                  {/* Bottom line micro interaction */}
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out w-0 group-hover:w-full"
                    style={{
                      backgroundColor: accentColor
                    }}
                  />

                  {/* Number with dot */}
                  <div className="flex items-center gap-2 mb-4">
                    <span 
                      className="w-1.5 h-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                      style={{
                        backgroundColor: accentColor
                      }}
                    />
                    <span 
                      className="text-[10px] font-mono tracking-widest"
                      style={{
                        color: accentColor
                      }}
                    >
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-sm font-medium text-foreground mb-2 transition-colors duration-300"
                    style={{
                      color: hoveredIndex === index ? accentColor : undefined
                    }}
                  >
                    {item.title}
                  </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 transition-all duration-300 group-hover:text-muted-foreground/80">
                  {item.description}
                </p>

                {/* Metric */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-light text-foreground transition-all duration-300 group-hover:tracking-wide">
                    {item.metric}
                  </span>
                  <ArrowUpRight
                    className={`w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      hoveredIndex === index ? "rotate-0" : "-rotate-45"
                    }`}
                    style={{
                      color: hoveredIndex === index ? accentColor : "oklch(0.556 0 0)"
                    }}
                  />
                </div>
              </div>
            )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
