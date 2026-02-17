"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function LiveWalkthroughSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-[616px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Group 1410104299 - Frame 1410104250: divider + label + divider, gap 12px */}
        <div
          className="flex flex-row items-center justify-center gap-3 mb-6"
          style={{ gap: "12px" }}
        >
          <span
            className="shrink-0"
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(10, 10, 10, 0.4)",
            }}
          />
          <span
            className="font-mono uppercase flex items-center justify-center"
            style={{
              fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              letterSpacing: "1.2px",
              color: "rgba(10, 10, 10, 0.7)",
            }}
          >
            No PowerPoint. Just Production.
          </span>
          <span
            className="shrink-0"
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(10, 10, 10, 0.4)",
            }}
          />
        </div>

        {/* Quote */}
        <p
          className="text-center mb-6 max-w-xl mx-auto"
          style={{
            fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: "rgba(10, 10, 10, 0.8)",
            fontStyle: "italic",
          }}
        >
          &ldquo;If you&apos;ve seen enough slides to last a lifetime, this invitation is for you.&rdquo;
        </p>

        {/* Group 1410104298 - Heading 2: gradient, Geist 300, 36px/40px, center */}
        <h2
          className="text-center mb-6"
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
          60 minutes. No theoretical futures. No slide decks.
        </h2>

        {/* Group 1410104297 - H3 + body: Geist 300 18px/28px, Poppins 400 16px/23px center #737373 */}
        <h3
          className="text-center flex items-center justify-center mb-2"
          style={{
            fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: "28px",
            color: "#0A0A0A",
          }}
        >
          Production Experience
        </h3>
        <p
          className="text-center max-w-[590px] mx-auto mb-8"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "23px",
            textAlign: "center",
            color: "#737373",
          }}
        >
          Just live agents running on real data. See how AI moves from the lab into core operations.
        </p>

        {/* Link - box 321×39, border 1px #E5E5E5, padding 9px 17px, gap 8px, Poppins 500 14px uppercase #111111 */}
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 box-border border hover:bg-muted/30 transition-colors"
          style={{
            padding: "9px 17px",
            gap: "8px",
            border: "1px solid #E5E5E5",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "21px",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "#111111",
          }}
        >
          Schedule Your Live Walkthrough
          <ArrowRight className="w-3 h-3 shrink-0" strokeWidth={1} style={{ color: "#737373" }} />
        </Link>
      </div>
    </section>
  )
}
