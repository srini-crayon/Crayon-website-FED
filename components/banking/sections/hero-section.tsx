"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"

// Row 1: capabilities (format matches home: icon, color, text)
const capabilities = [
  { icon: "circle" as const, color: "#04ab8b", text: "Conversational AI & Advisory" },
  { icon: "triangle" as const, color: "#394fa1", text: "Document Analysis" },
  { icon: "square" as const, color: "#ffc334", text: "Voice Processing" },
  { icon: "circle" as const, color: "#394fa1", text: "Data Insights" },
  { icon: "triangle" as const, color: "#ffc334", text: "Process Automation" },
  { icon: "circle" as const, color: "#ed407b", text: "CxO Concierge" },
  { icon: "circle" as const, color: "#974095", text: "Personalization" },
  { icon: "triangle" as const, color: "#394fa1", text: "Agentic Workflows" },
  { icon: "square" as const, color: "#04ab8b", text: "Data Transformation" },
]

// Row 2: banking agents/solutions (scrolls opposite direction)
const agentNames = [
  { icon: "circle" as const, color: "#F05283", text: "Just ASK" },
  { icon: "triangle" as const, color: "#FFC334", text: "Wealth RM" },
  { icon: "square" as const, color: "#00AE8E", text: "CXO Concierge" },
  { icon: "circle" as const, color: "#394fa1", text: "Earnings Analyst" },
  { icon: "triangle" as const, color: "#974095", text: "Travel AI" },
  { icon: "circle" as const, color: "#ed407b", text: "Data Studio" },
  { icon: "square" as const, color: "#FFC334", text: "ESG Co-Pilot" },
  { icon: "triangle" as const, color: "#00AE8E", text: "Personalization HDFC" },
  { icon: "circle" as const, color: "#394fa1", text: "OMP" },
]

export function HeroSection() {
  const heroSectionRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroSectionRef.current) {
        const rect = heroSectionRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        requestAnimationFrame(() => setMousePosition({ x, y }))
      }
    }
    const heroSection = heroSectionRef.current
    if (heroSection) {
      heroSection.addEventListener("mousemove", handleMouseMove, { passive: true })
      return () => heroSection.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section
      ref={heroSectionRef}
      className="relative overflow-hidden min-h-[90vh]"
      style={{ transform: "translateZ(0)", willChange: "scroll-position", contain: "layout style paint" }}
    >
      {/* Cursor-based dot pattern with radial gradient reveal - Hero Section Only */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle 4px, rgba(0, 0, 0, 0.4) 2px, transparent 2px)",
            backgroundSize: "24px 24px",
            backgroundPosition: "0 0",
            backgroundRepeat: "repeat",
            maskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, rgba(0,0,0,0.6) 40%, transparent 70%)`,
            transition: "mask-image 0.1s ease-out, -webkit-mask-image 0.1s ease-out",
            willChange: "mask-image",
          }}
        />
      </div>

      {/* Top radial gradient banner */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
          opacity: 1,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative text-center">
        {/* Badge (matches home: border, bg-white, Poppins 14px #111827) */}
        <div className="flex justify-center" style={{ marginBottom: "18px" }}>
          <div
            className="inline-flex items-center gap-2 border bg-white scale-in"
            style={{
                padding: "6px 16px",
                borderRadius: "10px",
                borderColor: "#E5E7EB",
                borderStyle: "solid",
                borderWidth: "1px",
              }}
            >
              <div className="relative h-4 w-4">
                <Image
                  src="/chat_icon.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className="whitespace-nowrap"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "18px",
                  letterSpacing: "0%",
                  color: "#111827",
                }}
              >
                Bank&apos;s Partnership
              </span>
            </div>
          </div>

        {/* H1 (matches home: Poppins 500, 52px/48px, #091917) */}
        <h1
          className="text-balance text-center fade-in-blur"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: "1.1",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#091917",
            margin: "0 auto",
            marginBottom: "14px",
            willChange: "opacity, transform, filter",
          }}
        >
          Banking & AI
        </h1>

        {/* Subhead (matches home 28px block: Poppins, 28px, 1.4, #091917) */}
        <div
          className="text-center fade-in-section"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(18px, 2.5vw, 28px)",
            lineHeight: 1.4,
            textAlign: "center",
            color: "#091917",
            marginBottom: "16px",
            willChange: "opacity, transform",
          }}
        >
          Simplifying AI Success for Banks
        </div>

        {/* Paragraph (matches home body: Poppins 400, 14–16px, 24px, #091917) */}
        <p
          className="max-w-2xl mx-auto text-pretty text-center fade-in-section"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0px",
            textAlign: "center",
            color: "#091917",
            marginBottom: "32px",
            willChange: "opacity, transform",
          }}
        >
          From pilot to platform — with proven agentic solutions designed for modern banking.
        </p>

        {/* Two-row scrolling tags (matches home hero: animate-scroll-tags, fades, renderTag) */}
        <div className="mx-auto max-w-5xl overflow-hidden pt-4 fade-in-section">
          <div className="flex flex-col gap-3">
            {(() => {
              type Tag = { icon: "circle" | "triangle" | "square"; color: string; text: string }
              const renderTag = (cap: Tag, key: string) => (
                <div
                  key={key}
                  className="flex items-center whitespace-nowrap shrink-0"
                  style={{
                    height: "32px",
                    padding: "5.5px 9px",
                    gap: "5px",
                    borderRadius: "999px",
                    border: "0.5px solid #DEE2E6",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {cap.icon === "circle" && (
                    <div className="shrink-0 rounded-full w-3 h-3" style={{ backgroundColor: cap.color }} />
                  )}
                  {cap.icon === "triangle" && (
                    <div
                      className="shrink-0 w-3 h-3"
                      style={{ backgroundColor: cap.color, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                    />
                  )}
                  {cap.icon === "square" && (
                    <div className="shrink-0 rounded w-3 h-3" style={{ backgroundColor: cap.color }} />
                  )}
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#344054",
                    }}
                  >
                    {cap.text}
                  </span>
                </div>
              )
              const dup1 = [...capabilities, ...capabilities, ...capabilities]
              const dup2 = [...agentNames, ...agentNames, ...agentNames, ...agentNames]
              const fade = { width: "100px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }
              const fadeR = { width: "100px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }
              return (
                <>
                  <div className="overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={fade} aria-hidden="true" />
                    <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={fadeR} aria-hidden="true" />
                    <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "300s" }}>
                      {dup1.map((c, i) => renderTag(c, `r1-${i}`))}
                    </div>
                  </div>
                  <div className="overflow-hidden relative">
                    <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={fade} aria-hidden="true" />
                    <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={fadeR} aria-hidden="true" />
                    <div className="flex gap-3 animate-scroll-tags-reverse" style={{ width: "fit-content", animationDuration: "300s" }}>
                      {dup2.map((c, i) => renderTag(c, `r2-${i}`))}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}
