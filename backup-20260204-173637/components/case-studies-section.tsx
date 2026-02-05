"use client"

import { useState } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"

const caseStudies = [
  {
    company: "HDFC Bank",
    industry: "Banking",
    metric: "3.5x",
    metricLabel: "Engagement Increase",
    description:
      "Delivered hyper-personalized recommendations to 68M+ customers, transforming digital banking experience.",
    logo: "/img/hdfc-logo.png",
  },
  {
    company: "Abu Dhabi Islamic Bank",
    industry: "Islamic Banking",
    metric: "2.8x",
    metricLabel: "Conversion Lift",
    description:
      "Sharia-compliant personalized recommendations across retail and corporate banking segments.",
    logo: "/img/adib-logo.png",
  },
  {
    company: "Redington",
    industry: "Retail",
    metric: "400%",
    metricLabel: "ROI Achieved",
    description:
      "Real-time personalized offers across all touchpoints, processing 50M+ transactions daily.",
    logo: "/img/redington-logo.png",
  },
]

export function CaseStudiesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Minimal header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Case Studies
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light">
              <span className="bg-gradient-to-r from-[oklch(0.65_0.2_330)] to-[oklch(0.7_0.18_75)] bg-clip-text text-transparent">
                Impact Stories —
              </span>
              <span className="font-medium text-foreground"> Built. Deployed. Delivered.</span>
            </h2>
          </div>
          <button className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all
            <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Cards in horizontal layout */}
        <div className="grid md:grid-cols-3 gap-[1px] bg-border">
          {caseStudies.map((study, index) => (
            <article
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative bg-background p-8 cursor-pointer overflow-hidden"
            >
              {/* Top accent line - micro interaction */}
              <div 
                className={`absolute top-0 left-0 h-[2px] bg-accent transition-all duration-500 ease-out ${
                  hoveredIndex === index ? "w-full" : "w-0"
                }`} 
              />

              {/* Industry tag */}
              <div className="flex items-center gap-2 mb-6">
                <span 
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    hoveredIndex === index ? "bg-accent scale-150" : "bg-muted-foreground/40"
                  }`}
                />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {study.industry}
                </span>
              </div>

              {/* Logo */}
              {study.logo && (
                <div className="mb-6 h-12 flex items-center bg-transparent">
                  <div className="relative w-32 h-12 flex items-center bg-transparent">
                    <Image
                      src={study.logo}
                      alt={study.company}
                      width={128}
                      height={48}
                      className="object-contain object-left transition-all duration-300 max-h-12 bg-transparent"
                      style={{
                        maxHeight: '48px',
                        height: 'auto',
                        width: 'auto',
                        backgroundColor: 'transparent'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Company name */}
              <h3 className="text-lg font-medium text-foreground mb-8">
                {study.company}
              </h3>

              {/* Metric - main focus */}
              <div className="mb-6">
                <span 
                  className={`text-5xl md:text-6xl font-light transition-all duration-500 ${
                    hoveredIndex === index ? "tracking-wider scale-110" : "tracking-normal scale-100"
                  }`}
                  style={{
                    color: hoveredIndex === index ? "oklch(0.55 0.2 260)" : undefined
                  }}
                >
                  {study.metric}
                </span>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                  {study.metricLabel}
                </p>
              </div>

              {/* Description - appears on hover */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  hoveredIndex === index ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className={`text-sm leading-relaxed pb-6 transition-colors duration-300 ${
                  hoveredIndex === index ? "text-foreground/80 dark:text-foreground/90" : "text-muted-foreground"
                }`}>
                  {study.description}
                </p>
              </div>

              {/* Bottom action */}
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <span 
                  className={`text-xs transition-all duration-300 ${
                    hoveredIndex === index ? "text-foreground/80 dark:text-foreground/90" : "text-muted-foreground/50"
                  }`}
                >
                  Read story
                </span>
                <ArrowUpRight
                  className={`w-4 h-4 transition-all duration-300 ${
                    hoveredIndex === index
                      ? "text-foreground/80 dark:text-foreground/90 translate-x-0.5 -translate-y-0.5 rotate-0"
                      : "text-muted-foreground/30 -rotate-45"
                  }`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
