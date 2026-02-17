"use client"

import {
  CreditCard,
  TrendingUp,
  Landmark,
  ArrowRight,
} from "lucide-react"

/** 6 cards in 2 rows: spec order and colors */
const useCases = [
  { id: "p1", icon: CreditCard, title: "Personalization & customer engagement", subtitle: "Pre-built. Customizable. Deployable. Not experiments. Operational systems.", color: "#1C69E3" },
  { id: "r1", icon: Landmark, title: "Risk & compliance automation", subtitle: "AI that runs inside regulated environments.", color: "#00AA8A" },
  { id: "f1", icon: TrendingUp, title: "Financial controls & reporting", subtitle: "Real systems. Measurable outcomes.", color: "#F69036" },
  { id: "p2", icon: CreditCard, title: "Personalization & customer engagement", subtitle: "Pre-built. Customizable. Deployable. Not experiments. Operational systems.", color: "#ED407B" },
  { id: "r2", icon: Landmark, title: "Risk & compliance automation", subtitle: "AI that runs inside regulated environments.", color: "#7C52EE" },
  { id: "f2", icon: TrendingUp, title: "Financial controls & reporting", subtitle: "Real systems. Measurable outcomes.", color: "#AD00C8" },
]

export function UseCasesSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Group 1410104266 / 1410104265 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ gap: "12px" }}>
              <span
                className="shrink-0"
                style={{
                  minWidth: "32px",
                  height: "1px",
                  background: "rgba(10, 10, 10, 0.4)",
                }}
              />
              <span
                className="font-mono uppercase"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "1.2px",
                  color: "rgba(10, 10, 10, 0.7)",
                }}
              >
                Use Cases You Can Touch and Feel
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                background: "linear-gradient(90deg, #00B388 0%, #DE8900 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Measurable Impact Across Markets
            </h2>
          </div>
          {/* Group 1410104264 - Explore Live Use Cases */}
          <a
            href="/tangram-ai"
            className="inline-flex items-center gap-2 text-right hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#737373",
            }}
          >
            Explore Live Use Cases
            <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.33333} style={{ color: "#737373" }} />
          </a>
        </div>

        {/* Cards grid - spec: Background #FFF, border 1px rgba(0,0,0,0.2), icon + title (accent) + subtitle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px overflow-hidden">
          {useCases.map((useCase) => {
            const Icon = useCase.icon
            const accentColor = useCase.color
            return (
              <a
                key={useCase.id}
                href="/tangram-ai"
                className="bg-white p-6 md:p-8 text-left box-border flex flex-col min-h-[226px] hover:opacity-95 transition-opacity"
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <Icon
                  className="w-5 h-5 mb-5 shrink-0"
                  style={{ color: accentColor }}
                  strokeWidth={1.66667}
                />
                <p
                  className="mb-3 font-medium"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                    fontSize: "18px",
                    lineHeight: "24px",
                    color: accentColor,
                  }}
                >
                  {useCase.title}
                </p>
                <p
                  className="mt-auto"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#737373",
                  }}
                >
                  {useCase.subtitle}
                </p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
