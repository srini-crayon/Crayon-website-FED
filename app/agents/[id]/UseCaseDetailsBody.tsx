"use client"

import React from "react"
import { SolutionDetailsBody } from "./SolutionDetailsBody"
import type { AgentDetailsContentProps } from "./types"

/**
 * Use Case detail page – same content as solution (from API), with AI use case page CSS.
 * Background: pattern video (assets) + rectangle #D9D9D9 + red/pink overlay + mask (darken 0.4).
 */
export function UseCaseDetailsBody(props: AgentDetailsContentProps) {
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
            backgroundImage: "url(/assets/theme-dots.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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
        {/* Red/pink overlay – same as reference image (soft pink/red from top-left) */}
        <div
          style={{
            position: "absolute",
            width: "1512px",
            maxWidth: "100%",
            height: "838px",
            left: 0,
            top: 0,
            background: "linear-gradient(135deg, rgba(255, 200, 200, 0.35) 0%, rgba(255, 220, 220, 0.15) 40%, transparent 70%)",
            pointerEvents: "none",
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
        <SolutionDetailsBody {...props} overviewVariant="usecase" />
      </div>
    </div>
  )
}
