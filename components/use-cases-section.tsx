"use client"

import { useState } from "react"
import {
  CreditCard,
  Plane,
  Globe,
  Smartphone,
  TrendingUp,
  Landmark,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const useCases = [
  { id: "personalization", icon: CreditCard, title: "Personalization & customer engagement", stat: "Live", statLabel: "Pre-built. Customizable. Deployable. Not experiments. Operational systems." },
  { id: "risk", icon: Landmark, title: "Risk & compliance automation", stat: "Live", statLabel: "AI that runs inside regulated environments." },
  { id: "financial", icon: TrendingUp, title: "Financial controls & reporting", stat: "Live", statLabel: "Real systems. Measurable outcomes." },
  { id: "onboarding", icon: Smartphone, title: "Intelligent onboarding", stat: "Live", statLabel: "From ideation to governed, scaled deployment." },
  { id: "sales", icon: Globe, title: "Sales acceleration", stat: "Live", statLabel: "Enterprise productivity at scale." },
  { id: "productivity", icon: Plane, title: "Enterprise productivity & AI concierges", stat: "Live", statLabel: "Executive AI concierges. Data orchestration & test data generation." },
]

export function UseCasesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Use Cases You Can Touch and Feel
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-balance">
              <span className="bg-gradient-to-r from-[oklch(0.65_0.2_175)] to-[oklch(0.7_0.18_75)] bg-clip-text text-transparent">
                AI should solve real problems
              </span>
              <span className="font-medium text-foreground"> — not abstract possibilities.</span>
            </h2>
          </div>
          <a
            href="/tangram-ai"
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 text-sm font-medium group"
          >
            Explore Live Use Cases
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border overflow-hidden">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            const isHovered = hoveredId === useCase.id
            
            const accentColors = [
              "oklch(0.55 0.2 260)", // Purple
              "oklch(0.65 0.2 175)", // Teal
              "oklch(0.65 0.2 330)", // Pink
              "oklch(0.7 0.18 75)",  // Orange
              "oklch(0.55 0.2 260)", // Purple (repeat)
              "oklch(0.65 0.2 175)", // Teal (repeat)
            ]
            const accentColor = accentColors[index % accentColors.length]
            
            return (
              <button
                key={useCase.id}
                onMouseEnter={() => setHoveredId(useCase.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "bg-background p-6 md:p-8 text-left transition-all duration-300 group relative border border-transparent"
                )}
                style={{
                  borderColor: isHovered ? accentColor : undefined
                }}
              >
                {/* Left accent line - aligned with icon */}
                <div
                  className="absolute top-6 md:top-8 left-0 w-[3px] transition-all duration-500 ease-out rounded-r-full"
                  style={{
                    height: isHovered ? "calc(100% - 3rem)" : "1.25rem",
                    backgroundColor: accentColor,
                    boxShadow: isHovered ? `0 0 12px ${accentColor}50, -2px 0 8px ${accentColor}30` : 'none'
                  }}
                />

                <div className="flex flex-col h-full min-h-[160px] relative z-10">
                  <Icon
                    className="w-5 h-5 mb-6 transition-colors duration-300"
                    style={{
                      color: accentColor
                    }}
                  />

                  <p className="text-sm font-medium text-foreground mb-auto">
                    {useCase.title}
                  </p>

                  <div className="mt-4 flex flex-col">
                    <p 
                      className={cn(
                        "text-2xl font-medium transition-all duration-300",
                        isHovered && "text-lg mb-1"
                      )}
                      style={{
                        color: accentColor
                      }}
                    >
                      {useCase.stat}
                    </p>
                    <div
                      className={cn(
                        "transition-all duration-300 overflow-hidden",
                        isHovered ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <p className="text-xs text-foreground/80 dark:text-foreground/90 text-left">{useCase.statLabel}</p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
