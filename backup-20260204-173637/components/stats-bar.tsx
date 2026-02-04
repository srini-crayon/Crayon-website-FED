"use client"

import { useState } from "react"

export function StatsBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const stats = [
    { value: "117M+", label: "Users Powered", prefix: "01", color: "oklch(0.65 0.2 175)" },
    { value: "13B+", label: "Transactions Processed", prefix: "02", color: "oklch(0.55 0.2 260)" },
    { value: "100s", label: "Workflows in Production", prefix: "03", color: "oklch(0.65 0.2 330)" },
    { value: "2012", label: "Building AI Since", prefix: "04", color: "oklch(0.7 0.18 75)" },
  ]

  return (
    <section className="bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative py-10 px-6 cursor-default border-r border-b md:border-b-0 last:border-r-0 border-border/60"
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 h-[2px] transition-all duration-500 ease-out"
                style={{
                  backgroundColor: stat.color,
                  width: hoveredIndex === index ? "100%" : "20%"
                }}
              />

              {/* Prefix number */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: stat.color,
                    transform: hoveredIndex === index ? "scale(1.5)" : "scale(1)"
                  }}
                />
                <span 
                  className="text-[10px] font-mono tracking-widest transition-colors duration-300"
                  style={{
                    color: stat.color
                  }}
                >
                  {stat.prefix}
                </span>
              </div>

              {/* Value */}
              <div
                className={`text-3xl md:text-4xl font-light text-foreground transition-all duration-300 ${
                  hoveredIndex === index ? "tracking-wider" : "tracking-normal"
                }`}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div
                className="mt-2 text-xs transition-all duration-300"
                style={{
                  color: stat.color
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
