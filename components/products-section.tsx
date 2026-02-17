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
      { text: "Pre-built. Modular. Enterprise-ready.", icon: Layers, color: "#1C69E3" },
      { text: "Model-agnostic. Vendor-agnostic.", icon: Plug, color: "#00AA8A" },
      { text: "Open architecture", icon: Database, color: "#CF57C8" },
      { text: "Production-grade agentic & GenAI solutions", icon: Zap, color: "#D98C00" },
    ],
  },
  catalyst: {
    title: "Catalyst",
    subtitle: "Productised Execution",
    description: "AI doesn't deploy itself. Catalyst ensures structured adoption through: Labs → Foundry → Factory. From ideation to governed, scaled deployment.",
    features: [
      { text: "Labs → Foundry → Factory", icon: Factory, color: "#1C69E3" },
      { text: "From ideation to governed, scaled deployment", icon: CheckCircle, color: "#00AA8A" },
      { text: "Structured adoption", icon: Settings, color: "#CF57C8" },
      { text: "AI doesn't deploy itself — Catalyst does", icon: Zap, color: "#D98C00" },
    ],
  },
  store: {
    title: "Tangram AI Store",
    subtitle: "The Ecosystem",
    description: "We don't believe we have all the answers. ISVs, startups, SIs, and distributors build and distribute on Tangram — accelerating scale.",
    features: [
      { text: "ISVs, startups, SIs, and distributors", icon: Store, color: "#1C69E3" },
      { text: "Build and distribute on Tangram", icon: Layers, color: "#00AA8A" },
      { text: "Accelerating scale", icon: Zap, color: "#CF57C8" },
      { text: "Open ecosystem for innovation", icon: Plug, color: "#D98C00" },
    ],
  },
}

export function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState<"tangram" | "catalyst" | "store">("tangram")
  const product = products[activeProduct]

  return (
    <section id="products" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - spec: Frame 1410104250 + Heading 2 (4 lines up from section top) */}
        <div className="text-center mb-16 -mt-16">
          <div
            className="flex flex-row items-center justify-center gap-3 mb-6"
            style={{ gap: "12px" }}
          >
            <span
              className="shrink-0"
              style={{
                minWidth: "32px",
                height: "1px",
                background: "rgba(10, 10, 10, 0.4)",
              }}
            />
            <span
              className="font-mono uppercase text-center flex items-center"
              style={{
                fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                fontWeight: 400,
                fontSize: "12px",
                lineHeight: "16px",
                letterSpacing: "1.2px",
                color: "rgba(10, 10, 10, 0.7)",
              }}
            >
              Built for Scale. Built for Speed.
            </span>
            <span
              className="shrink-0"
              style={{
                minWidth: "32px",
                height: "1px",
                background: "rgba(10, 10, 10, 0.4)",
              }}
            />
          </div>
          <h2
            className="text-balance mb-4"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 300,
              fontSize: "36px",
              lineHeight: "40px",
              textAlign: "center",
              background: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The Triple-Engine Model.
          </h2>
          <p
            className="text-balance max-w-2xl mx-auto mb-2"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "26px",
              color: "#737373",
            }}
          >
            Enterprise AI works only when platform and execution move together.
          </p>
          <p
            className="text-balance max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "26px",
              color: "#737373",
            }}
          >
            So we redesigned our company around a triple-engine model:
          </p>
        </div>

        {/* Product Toggle - spec: HorizontalBorder, active has 2px bottom #0A0A0A */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex border-b flex-wrap justify-center" style={{ borderColor: "transparent" }}>
            {(["tangram", "catalyst", "store"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveProduct(key)}
                className="px-8 py-3 transition-colors relative border-b-2"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  textAlign: "center",
                  color: activeProduct === key ? "#0A0A0A" : "#737373",
                  borderBottomColor: activeProduct === key ? "#0A0A0A" : "transparent",
                }}
              >
                {key === "tangram" ? "Tangram AI" : key === "catalyst" ? "Catalyst" : "Tangram AI Store"}
              </button>
            ))}
          </div>
        </div>

        {/* Product Content - spec: left column (dot, subtitle, heading, description, button) + right (VerticalBorder feature list) */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left - Info */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="rounded-full shrink-0"
                  style={{
                    background: activeProduct === "tangram" ? "#1C69E3" : activeProduct === "catalyst" ? "#00AA8A" : "#CF57C8",
                    minWidth: "6px",
                    minHeight: "6px",
                    borderRadius: "3.35544e+07px",
                  }}
                />
                <span
                  className="font-mono uppercase flex items-center"
                  style={{
                    fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "0.5px",
                    color: activeProduct === "tangram" ? "#1C69E3" : activeProduct === "catalyst" ? "#00AA8A" : "#CF57C8",
                  }}
                >
                  {product.subtitle}
                </span>
              </div>
              <h3
                className="flex items-center"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  fontWeight: 600,
                  fontSize: "30px",
                  lineHeight: "36px",
                  color: "#0A0A0A",
                }}
              >
                {product.title}
              </h3>
            </div>

            <p
              className="mb-8 flex items-center"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "26px",
                color: "#737373",
              }}
            >
              {product.description}
            </p>

            <p
              className="mb-4 flex items-center"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "22px",
                color: "#0A0A0A",
              }}
            >
              Platform. Execution. Ecosystem. Together.
            </p>
            <Button asChild className="rounded-[6px] hover:opacity-90" style={{ background: "#0A0A0A" }}>
              <Link
                href={activeProduct === "tangram" ? "/tangram-ai" : activeProduct === "catalyst" ? "/catalyst" : "/agents-store"}
                className="inline-flex items-center justify-center gap-2 text-center"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "20px",
                  color: "#FFFFFF",
                }}
              >
                Discover the Triple-Engine Model
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.33333} />
              </Link>
            </Button>
          </div>

          {/* Right - Features (spec: Geist 16px/24px #0A0A0A, icon colors per row) */}
          <div className="space-y-0 border-l border-[#E5E5E5]">
            {product.features.map((feature, index) => {
              const Icon = feature.icon
              const accentColor = "color" in feature ? feature.color : "#1C69E3"
              return (
                <div
                  key={index}
                  className="pl-6 py-4 border-b border-[#E5E5E5] last:border-b-0 hover:bg-muted/30 transition-colors -ml-px flex items-center gap-3"
                  style={{ minHeight: "57px" }}
                >
                  <Icon className="w-4 h-4 shrink-0" style={{ color: accentColor }} strokeWidth={1.33333} />
                  <span
                    className="flex items-center"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#0A0A0A",
                    }}
                  >
                    {feature.text}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Speed Metrics - spec: Border 1px #E5E5E5 top/bottom; Days/Weeks/Months with icons #1C69E3, #00AA8A, #D98C00 */}
        <div
          className="mt-8 pt-8 pb-8"
          style={{
            borderTop: "1px solid #E5E5E5",
            borderBottom: "1px solid #E5E5E5",
          }}
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "Days", label: "to Demos", icon: Calendar, color: "#1C69E3" },
              { value: "Weeks", label: "to Prototypes", icon: CalendarDays, color: "#00AA8A" },
              { value: "Months", label: "to Production", icon: CalendarRange, color: "#D98C00" },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-4 justify-center">
                  <Icon className="w-10 h-10 shrink-0" style={{ color: item.color }} strokeWidth={3.33333} />
                  <div className="text-left">
                    <div
                      className="leading-tight"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 500,
                        fontSize: "24px",
                        lineHeight: "30px",
                        color: "#0A0A0A",
                      }}
                    >
                      {item.value}
                    </div>
                    <div
                      className="-mt-1"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: "#737373",
                      }}
                    >
                      {item.label}
                    </div>
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
