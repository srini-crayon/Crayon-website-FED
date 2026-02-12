"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, Factory, Store, Database, Shield, Plug, Zap, Code, Settings, CheckCircle, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import { useState } from "react"

const products = {
  tangram: {
    title: "Tangram AI",
    subtitle: "The Platform",
    description: "An army of production-grade, agentic and generative AI solutions. Pre-built. Modular. Enterprise-ready. Model-agnostic. Vendor-agnostic. Open architecture.",
    features: [
      { text: "Pre-built AI agent marketplace", icon: Store },
      { text: "Unified data orchestration", icon: Database },
      { text: "Built-in governance controls", icon: Shield },
      { text: "Enterprise integration APIs", icon: Plug }
    ]
  },
  catalyst: {
    title: "Catalyst",
    subtitle: "Productised Execution",
    description: "AI doesn't deploy itself. Catalyst ensures structured adoption through: Labs → Foundry → Factory. From ideation to governed, scaled deployment.",
    features: [
      { text: "Rapid use case validation", icon: Zap },
      { text: "Production-ready AI builds", icon: Code },
      { text: "Governed deployments at scale", icon: Settings },
      { text: "Enterprise-grade reliability", icon: CheckCircle }
    ]
  },
  store: {
    title: "Tangram AI Store",
    subtitle: "The Ecosystem",
    description: "We don't believe we have all the answers. ISVs, startups, SIs, and distributors build and distribute on Tangram — accelerating scale.",
    features: [
      { text: "ISV & partner ecosystem", icon: Store },
      { text: "Build and distribute on Tangram", icon: Layers },
      { text: "Accelerate scale together", icon: Zap },
      { text: "Open for innovation", icon: Plug }
    ]
  }
}

export function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState<"tangram" | "catalyst" | "store">("tangram")
  const product = products[activeProduct]

  return (
    <section id="products" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
            <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
              Built for Scale. Built for Speed.
            </span>
            <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-balance mb-4">
            <span className="bg-gradient-to-r from-[oklch(0.45_0.3_260)] to-[oklch(0.5_0.3_175)] bg-clip-text text-transparent">
              The Triple-Engine Model.
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Enterprise AI works only when platform and execution move together. Platform. Execution. Ecosystem. Together.
          </p>
        </div>

        {/* Product Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border-b border-border flex-wrap justify-center">
            {(["tangram", "catalyst", "store"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveProduct(key)}
                className={`px-8 py-3 text-sm font-medium transition-colors relative ${
                  activeProduct === key
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key === "tangram" ? "Tangram AI" : key === "catalyst" ? "Catalyst" : "Tangram AI Store"}
                {activeProduct === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Content */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left - Info */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: activeProduct === "tangram" 
                      ? "oklch(0.55 0.2 260)" 
                      : activeProduct === "catalyst" 
                        ? "oklch(0.65 0.2 175)" 
                        : "oklch(0.65 0.2 330)"
                  }}
                />
                <span 
                  className="text-[10px] font-mono tracking-wider uppercase"
                  style={{
                    color: activeProduct === "tangram" 
                      ? "oklch(0.55 0.2 260)" 
                      : activeProduct === "catalyst" 
                        ? "oklch(0.65 0.2 175)" 
                        : "oklch(0.65 0.2 330)"
                  }}
                >
                  {product.subtitle}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground">
                {product.title}
              </h3>
            </div>
            
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
              <Link href={activeProduct === "tangram" ? "/tangram-ai" : activeProduct === "catalyst" ? "/catalyst" : "/agents-store"} className="inline-flex items-center">
                Discover the Triple-Engine Model
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Right - Features */}
          <div className="space-y-0 border-l border-border">
            {product.features.map((feature, index) => {
              const Icon = feature.icon
              const accentColors = [
                "oklch(0.55 0.2 260)", // Purple
                "oklch(0.65 0.2 175)", // Teal
                "oklch(0.65 0.2 330)", // Pink
                "oklch(0.7 0.18 75)",  // Orange
              ]
              const accentColor = accentColors[index % accentColors.length]
              
              return (
                <div 
                  key={index} 
                  className="pl-6 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors -ml-px flex items-center gap-3 group"
                >
                  <Icon 
                    className="w-4 h-4 shrink-0 transition-colors duration-300" 
                    style={{
                      color: accentColor
                    }}
                  />
                  <span className="text-foreground">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Speed Metrics */}
        <div className="mt-8 pt-8 pb-8 border-t border-b border-border">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "Days", label: "to Demos", icon: Calendar },
              { value: "Weeks", label: "to Prototypes", icon: CalendarDays },
              { value: "Months", label: "to Production", icon: CalendarRange },
            ].map((item, index) => {
              const Icon = item.icon
              const accentColors = [
                "oklch(0.55 0.2 260)", // Purple
                "oklch(0.65 0.2 175)", // Teal
                "oklch(0.7 0.18 75)",  // Orange
              ]
              const accentColor = accentColors[index]
              
              return (
                <div key={index} className="flex items-center gap-4 justify-center">
                  <Icon 
                    className="w-10 h-10 shrink-0"
                    style={{
                      color: accentColor
                    }}
                  />
                  <div className="text-left">
                    <div className="text-xl md:text-2xl font-medium text-foreground leading-tight">{item.value}</div>
                    <div className="text-sm text-muted-foreground -mt-1">{item.label}</div>
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
