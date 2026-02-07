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
  {
    id: "banking",
    icon: CreditCard,
    title: "Banking",
    stat: "7%",
    statLabel: "increase in customer spends for the largest private bank in India",
  },
  {
    id: "travel",
    icon: Plane,
    title: "Travel",
    stat: "80%",
    statLabel: "reduction in booking time for a travel experience platform in the Middle East",
  },
  {
    id: "bank-travel",
    icon: Globe,
    title: "Bank + Travel",
    stat: "100M+",
    statLabel: "customer genomes powering 1:1 personalization for Banks and Travel",
  },
  {
    id: "neo-banking",
    icon: Smartphone,
    title: "Neo Banking",
    stat: "8M",
    statLabel: "Pay-day loans in less than 6 months for a Neo banking initiative in Tanzania",
  },
  {
    id: "fintech",
    icon: TrendingUp,
    title: "FinTech",
    stat: "126%",
    statLabel: "increase in digital activation for a fast-scaling FinTech ecosystem in Myanmar",
  },
  {
    id: "islamic-banking",
    icon: Landmark,
    title: "Islamic Banking",
    stat: "10×",
    statLabel: "ROI in customer value management for the largest Islamic bank in the Middle East",
  },
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
                AI Results. At Scale.
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-balance">
              <span className="bg-gradient-to-r from-[oklch(0.65_0.2_175)] to-[oklch(0.7_0.18_75)] bg-clip-text text-transparent">
                Measurable Impact
              </span>
              <span className="font-medium text-foreground"> Across Markets</span>
            </h2>
          </div>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 text-sm font-medium group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border overflow-hidden">
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
