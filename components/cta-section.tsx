"use client"

import { useState } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"

export function CTASection() {
  const [hoveredAction, setHoveredAction] = useState<number | null>(null)

  const actions = [
    { label: "Talk to Our AI Experts", href: "/contact", primary: true },
    { label: "Explore Tangram", href: "/tangram-ai", primary: false },
    { label: "See Catalyst in Action", href: "/catalyst", primary: false },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-4">
        {/* Minimal header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
            <span className="text-[11px] font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
              Get Started
            </span>
            <span className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-balance">
            <span className="bg-gradient-to-r from-[oklch(0.55_0.25_260)] to-[oklch(0.65_0.25_330)] bg-clip-text text-transparent">
              AI is no longer optional.
            </span>
            <span className="block font-medium text-foreground/70 dark:text-foreground/80">But execution still is.</span>
          </h2>
          
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Crayon Data simplifies AI success — for enterprises that are ready to run.
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {actions.map((action, index) => {
            const accentColor = index === 0 ? "oklch(0.7 0.18 75)" : index === 1 ? "oklch(0.55 0.2 260)" : "oklch(0.65 0.2 175)"
            return (
              <a
                key={index}
                href={action.href}
                onMouseEnter={() => setHoveredAction(index)}
                onMouseLeave={() => setHoveredAction(null)}
                className="group relative p-6 transition-all duration-300 ease-out overflow-hidden bg-card border transition-colors"
                style={{
                  borderColor: hoveredAction === index ? accentColor : undefined
                }}
              >
                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ease-out ${hoveredAction === index ? "w-full" : "w-0"}`}
                  style={{
                    background: accentColor
                  }}
                />

                {/* Number */}
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
                  0{index + 1}
                </span>

                {/* Content */}
                <div className="flex items-center justify-between mt-8">
                  <span 
                    className="text-base font-medium transition-all duration-300 text-foreground"
                    style={{
                      color: hoveredAction === index ? accentColor : undefined,
                      letterSpacing: hoveredAction === index ? '0.05em' : '0'
                    }}
                  >
                    {action.label}
                  </span>
                  
                  <ArrowUpRight
                    className={`w-4 h-4 transition-all duration-300 ${
                      hoveredAction === index
                        ? "translate-x-0.5 -translate-y-0.5 rotate-0"
                        : "text-muted-foreground/50 rotate-90"
                    }`}
                    style={{
                      color: hoveredAction === index ? accentColor : undefined
                    }}
                  />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
