"use client"

import React, { useState } from "react"
import { SolutionDetailsBody } from "./SolutionDetailsBody"
import type { AgentDetailsContentProps } from "./types"

const useCaseIcons = [
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 6l-10 7L2 6" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-1"><ellipse cx="12" cy="6" rx="4" ry="2" stroke="#F05283" strokeWidth="1.5" /><path d="M4 6v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6" stroke="#F05283" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 12h16" stroke="#F05283" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="#8F2B8C" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="3" stroke="#8F2B8C" strokeWidth="1.5" /></svg>,
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-3"><circle cx="9" cy="9" r="3" stroke="#F5319D" strokeWidth="1.5" /><circle cx="15" cy="15" r="3" stroke="#F5319D" strokeWidth="1.5" /><path d="M9 12h6" stroke="#F5319D" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-4"><path d="M18 20V10M12 20V4M6 20v-6" stroke="#722ED1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-5"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#FF9231" strokeWidth="1.5" strokeDasharray="2 2" /><path d="M8 8h8v8H8z" stroke="#FF9231" strokeWidth="1" strokeOpacity={0.72} /></svg>,
]

/**
 * Use Case detail page – same content as solution (from API), with AI use case page CSS.
 * Background: pattern video (assets) + rectangle #D9D9D9 + red/pink overlay + mask (darken 0.4).
 * Capabilities section: hover-only descriptions (none visible by default).
 */
export function UseCaseDetailsBody(props: AgentDetailsContentProps) {
  const [hoveredCapabilityIndex, setHoveredCapabilityIndex] = useState<number | null>(null)

  const { agent, data } = props
  const featuresStr = (agent?.features && String(agent.features).trim() && agent.features !== "na") ? String(agent.features).replace(/\\n/g, "\n") : ""
  const partsBySemicolon = featuresStr ? featuresStr.split(";").map((s: string) => s.trim()).filter(Boolean) : []
  const capabilitiesHeading = partsBySemicolon.length > 0
    ? partsBySemicolon[0]
    : (agent?.by_value?.trim() || (agent?.description?.trim() ? (agent.description.split(/[.!?]/)[0]?.trim() || agent.description.slice(0, 80)) : "") || "Everything you need to evaluate non-performing assets efficiently and accurately")
  const rawFromFeatures = partsBySemicolon.length > 1 ? partsBySemicolon.slice(1) : (featuresStr && partsBySemicolon.length <= 1 ? [] : [])
  const fromCapabilities = (data?.capabilities ?? []).map((c: { by_capability?: string }) => (c.by_capability || "").trim()).filter(Boolean)
  const rawItems = rawFromFeatures.length > 0 ? rawFromFeatures : (fromCapabilities.length > 0 ? fromCapabilities : (featuresStr && !featuresStr.includes(";") ? featuresStr.split(/\s*[|]\s*|\n+/).map((s: string) => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, "").replace(/^\d+\.\s*/, "")).filter(Boolean) : []))
  const parsedFeatures = rawItems.map((item: string) => {
    const colonMatch = item.match(/^([^:]{2,80}):\s*(.+)$/)
    const dashMatch = item.match(/^([^\u2013\u2014-]{2,80})\s*[\u2013\u2014-]\s*(.+)$/)
    if (colonMatch) return { title: colonMatch[1].trim(), description: colonMatch[2].trim() }
    if (dashMatch) return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
    const words = item.split(/\s+/)
    if (words.length > 5) return { title: words.slice(0, 3).join(" "), description: item }
    return { title: item, description: "" }
  })
  const capabilities = parsedFeatures.length > 0 ? parsedFeatures : fromCapabilities.map((title) => ({ title, description: "" }))

  const customCapabilitiesSection = (
    <div
      className="use-case-capabilities"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px 48px",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left: label + heading – stacks first on narrow viewports */}
      <div
        style={{
          width: "100%",
          maxWidth: "579px",
          flex: "1 1 320px",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <span style={{ width: "32px", height: "1px", background: "#0A0A0A", flexShrink: 0 }} aria-hidden />
          <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: "12px", lineHeight: "16px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#0A0A0A" }}>
            CAPABILITIES
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Geist', var(--font-geist-sans), sans-serif",
            fontWeight: 300,
            fontSize: "clamp(24px, 5vw, 36px)",
            lineHeight: 1.2,
            margin: 0,
            background: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {capabilitiesHeading}
        </h2>
      </div>
      {/* Right: capability list – description only on hover, works for all items */}
      <div
        style={{
          width: "100%",
          maxWidth: "576px",
          flex: "1 1 320px",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {capabilities.map((feature, i) => {
          const isHovered = hoveredCapabilityIndex === i
          const showDescription = isHovered && feature.description.length > 0
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredCapabilityIndex(i)}
              onMouseLeave={() => setHoveredCapabilityIndex(null)}
              role="article"
              aria-label={feature.title}
              style={{
                padding: showDescription ? "16px 0 24px" : "24px 0",
                minHeight: showDescription ? 100 : 72,
                borderBottom: i < capabilities.length - 1 ? "1px solid #E5E7EB" : undefined,
                cursor: "default",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", width: "100%", minWidth: 0 }}>
                <span style={{ flexShrink: 0, marginTop: 2 }}>{useCaseIcons[i % useCaseIcons.length]}</span>
                <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                  <h3
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: "clamp(16px, 2.5vw, 18px)",
                      lineHeight: "26px",
                      color: "#333333",
                      margin: 0,
                    }}
                  >
                    {feature.title}
                  </h3>
                  {showDescription && (
                    <p
                      style={{
                        fontFamily: "'Geist', var(--font-geist-sans), sans-serif",
                        fontWeight: 400,
                        fontSize: "clamp(13px, 1.8vw, 14px)",
                        lineHeight: "23px",
                        color: "#737373",
                        margin: "8px 0 0 0",
                        maxWidth: "100%",
                      }}
                    >
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1512px",
        margin: "0 auto",
        background: "#FFFFFF",
        minHeight: "100%",
      }}
    >
      {/* Background stack: screenshot image → rectangle → red/pink → mask (z 0–3) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", maxWidth: "1512px", minHeight: "838px", overflow: "hidden", zIndex: 0 }}>
        {/* Screenshot – 1512×982, top -88px, theme background image */}
        <div
          style={{
            position: "absolute",
            width: "1512px",
            maxWidth: "100%",
            height: "982px",
            left: 0,
            top: "-88px",
            backgroundImage: "url(/assets/hero-dots-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
        {/* Gradient overlay – light red, blends with dotted pattern, extends to heading only (like AgentDetailsBody) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "480px",
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255, 200, 200, 0.9) 0%, rgba(255, 180, 180, 0.55) 30%, rgba(255, 160, 160, 0.25) 55%, transparent 100%)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
        {/* Rectangle 34624662 – 1512×838, #D9D9D9 */}
        <div
          style={{
            position: "absolute",
            width: "1512px",
            maxWidth: "100%",
            height: "838px",
            left: 0,
            top: 0,
            background: "#D9D9D9",
          }}
          aria-hidden
        />
        {/* Mask group – 1512×838, mix-blend-mode darken, opacity 0.4 */}
        <div
          style={{
            position: "absolute",
            width: "1512px",
            maxWidth: "100%",
            height: "838px",
            left: 0,
            top: 0,
            mixBlendMode: "darken",
            opacity: 0.4,
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <SolutionDetailsBody {...props} overviewVariant="usecase" customCapabilitiesSection={customCapabilitiesSection} />
      </div>
    </div>
  )
}
