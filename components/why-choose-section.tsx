"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"

export function WhyChooseSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const totalItems = 5
  const intervalDuration = 4000

  const nextItem = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems)
    setProgress(0)
  }, [totalItems])

  useEffect(() => {
    if (isPaused) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextItem()
          return 0
        }
        return prev + (100 / (intervalDuration / 50))
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [isPaused, nextItem, intervalDuration])

  const reasons = [
    {
      number: "01",
      title: "Production Experience",
      description: "Built on years of deploying AI in complex enterprise environments, not lab conditions.",
    },
    {
      number: "02",
      title: "Proven at Scale",
      description: "117M+ users served across banking, retail, and travel with measurable outcomes.",
    },
    {
      number: "03",
      title: "Modular Architecture",
      description: "Future-ready platform that adapts to your existing infrastructure seamlessly.",
    },
    {
      number: "04",
      title: "Clear Execution",
      description: "Transparent roadmaps with defined milestones and accountability at every stage.",
    },
    {
      number: "05",
      title: "Enterprise Trust",
      description: "Backed by global banks and Fortune 500 companies with proven security.",
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <div className="flex items-end justify-between mb-16 pb-8 border-b border-border">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Why Crayon Data
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-balance">
              <span className="bg-gradient-to-r from-[oklch(0.55_0.25_260)] to-[oklch(0.7_0.25_75)] bg-clip-text text-transparent">
                We help enterprises run AI
              </span>
              <span className="font-medium text-foreground"> as a core capability.</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Talk to us
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Interactive List */}
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-16">
          {/* Left - Expandable Items */}
          <div 
            className="divide-y divide-border"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {reasons.map((reason, index) => {
              const accentColors = [
                "oklch(0.55 0.2 260)", // Purple
                "oklch(0.65 0.2 175)", // Teal
                "oklch(0.65 0.2 330)", // Pink
                "oklch(0.7 0.18 75)",  // Orange
                "oklch(0.55 0.2 260)", // Purple
              ]
              const accentColor = accentColors[index]
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index)
                    setProgress(0)
                  }}
                  className={`relative w-full text-left py-6 transition-all duration-300 group ${
                    activeIndex === index ? "opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* Progress bar for active item */}
                  {activeIndex === index && (
                    <div 
                      className="absolute bottom-0 left-0 h-[2px] transition-all duration-75 ease-linear" 
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: accentColor
                      }} 
                    />
                  )}
                  
                  <div className="flex items-start gap-6">
                    <span className="text-xs text-muted-foreground font-mono mt-1">
                      {reason.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        {reason.title}
                      </h3>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          activeIndex === index ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-muted-foreground text-sm leading-relaxed pt-2">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full mt-2 transition-all duration-300"
                      style={{
                        backgroundColor: activeIndex === index ? accentColor : undefined
                      }}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right - Minimal Visual Indicator */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {(() => {
                const accentColors = [
                  "oklch(0.55 0.2 260)", // Purple
                  "oklch(0.65 0.2 175)", // Teal
                  "oklch(0.65 0.2 330)", // Pink
                  "oklch(0.7 0.18 75)",  // Orange
                  "oklch(0.55 0.2 260)", // Purple
                ]
                const accentColor = accentColors[activeIndex]
                
                return (
                  <>
                    {/* Minimal animated circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        className="rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: '200px',
                          height: '200px',
                          border: `1px solid ${accentColor}30`,
                          transform: `scale(${0.8 + (activeIndex % 3) * 0.1})`,
                          animation: 'pulse 3s ease-in-out infinite'
                        }}
                      />
                    </div>
                    
                    {/* Animated progress ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="1"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - (activeIndex + 1) / 5)}`}
                        className="transition-all duration-700 ease-out"
                        opacity="0.2"
                      />
                    </svg>
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div 
                          className="text-5xl font-light mb-3 bg-clip-text text-transparent transition-all duration-700 ease-out"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${accentColor}, oklch(0.7 0.18 75))`,
                            transform: `scale(${1 + Math.sin(activeIndex) * 0.05})`
                          }}
                        >
                          {reasons[activeIndex].number}
                        </div>
                        <div 
                          className="text-xs text-foreground/60 dark:text-foreground/70 tracking-widest uppercase max-w-[180px] mx-auto transition-opacity duration-500"
                          style={{
                            opacity: 0.8
                          }}
                        >
                          {reasons[activeIndex].title}
                        </div>
                      </div>
                    </div>

                    {/* Minimal animated dots */}
                    {[0, 1, 2, 3, 4].map((i) => {
                      const angle = (i * 72 - 90) * (Math.PI / 180)
                      const radius = 80
                      const x = 100 + radius * Math.cos(angle)
                      const y = 100 + radius * Math.sin(angle)
                      
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full transition-all duration-700 ease-out"
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            width: i === activeIndex ? '8px' : '4px',
                            height: i === activeIndex ? '8px' : '4px',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: i === activeIndex ? accentColor : `${accentColor}30`,
                            boxShadow: i === activeIndex ? `0 0 8px ${accentColor}60` : 'none',
                            animation: i === activeIndex ? 'pulse 2s ease-in-out infinite' : undefined
                          }}
                        />
                      )
                    })}
                  </>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 pt-8 border-t border-border lg:hidden">
          <a
            href="#contact"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Talk to us
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
