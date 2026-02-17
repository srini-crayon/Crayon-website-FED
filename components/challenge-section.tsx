"use client"

import { ArrowRight } from "lucide-react"

export function ChallengeSection() {
  const challenges = [
    {
      number: "01",
      title: "Fragmented data and legacy systems",
      description: "Data silos and legacy systems create integration complexity that stalls AI initiatives.",
      statLabel: "of enterprises cite data silos as primary AI barrier"
    },
    {
      number: "02",
      title: "Governance, risk, and accuracy concerns",
      description: "Risk management, accuracy requirements, and regulatory compliance slow every deployment.",
      statLabel: "Governance gaps block production"
    },
    {
      number: "03",
      title: "Slow movement from idea to deployment",
      description: "The gap between AI capability and enterprise reality grows wider each quarter.",
      statLabel: "Ideas stay in pilot mode"
    },
    {
      number: "04",
      title: "Tools that don't fit real-world complexity",
      description: "Generic solutions built for demos fail when facing real-world enterprise complexity.",
      statLabel: "Tool mismatch limits impact"
    },
    {
      number: "05",
      title: "Rapid evolution of AI technologies",
      description: "Models and vendors change fast; enterprises need to evolve without rebuilding from scratch.",
      statLabel: "Keeping pace with AI evolution"
    }
  ]

  return (
    <section id="solutions" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - spec: Group 1410104250 / 1410104253 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
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
                className="font-mono uppercase flex items-center"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  letterSpacing: "1.2px",
                  color: "rgba(10, 10, 10, 0.7)",
                }}
              >
                The Real Challenge with Enterprise AI
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                letterSpacing: "-1.5px",
                background: "linear-gradient(90deg, #0066FF 0%, #FB2AF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI isn&apos;t the problem.
            </h2>
          </div>
          <p
            className="max-w-xs flex items-center"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#737373",
            }}
          >
            Making it work inside enterprises is.
          </p>
        </div>

        <p
          className="mb-8"
          style={{
            fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            color: "#0A0A0A",
          }}
        >
          Enterprises struggle with:
        </p>

        {/* Challenge Grid - spec: Group 1410104251, background #E5E5E5, cards #FFFFFF, left bar + number + Heading 3 + paragraph + Paragraph+HorizontalBorder */}
        <div
          className="grid grid-cols-1 md:grid-cols-5 overflow-hidden md:items-stretch"
          style={{ background: "#E5E5E5", gap: "1px" }}
        >
          {challenges.map((challenge, index) => {
            const barColors = ["#1C69E3", "#00B388", "#DAA000", "#F5891F", "#6366F1"]
            const barColor = barColors[index]
            return (
              <div
                key={index}
                className="bg-white flex flex-col min-h-0 relative box-border flex-1"
                style={{
                  borderLeft: index === 0 ? "none" : "1px solid rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="p-6 md:p-8 flex flex-col flex-1 min-h-0">
                  {/* Left bar + Number */}
                  <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                    <div
                      className="shrink-0 rounded-r-full"
                    style={{
                        width: "3px",
                        minHeight: "16px",
                        background: barColor,
                        borderRadius: "0 3.35544e+07px 3.35544e+07px 0",
                    }}
                  />
                  <span 
                      className="font-mono flex items-center"
                    style={{
                        fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "12px",
                        letterSpacing: "0.6px",
                        color: barColor,
                    }}
                  >
                    {challenge.number}
                  </span>
                </div>
                  {/* Heading 3 */}
                <h3 
                    className="mb-3 flex-shrink-0"
                  style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      fontSize: "20px",
                      lineHeight: "28px",
                      color: "#0A0A0A",
                  }}
                >
                  {challenge.title}
                  </h3>
                  {/* Description */}
                  <p
                    className="flex-1 min-h-0 mb-0 flex-shrink-0"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: "15px",
                      lineHeight: "23px",
                      color: "#737373",
                    }}
                  >
                    {challenge.description}
                  </p>
                  {/* Paragraph+HorizontalBorder */}
                  <div
                    className="pt-4 mt-4 flex-shrink-0 box-border border-t"
                    style={{
                      borderTop: "1px solid #E5E5E5",
                      minHeight: "61px",
                    }}
                  >
                    <p
                      className="flex items-center"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#737373",
                      }}
                    >
                    {challenge.statLabel}
                  </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* The result? — centered highlight */}
        <div
          className="mt-14 mb-14 mx-auto text-center max-w-xl px-8 py-8 rounded-lg border"
          style={{
            background: "rgba(245, 245, 245, 0.6)",
            borderColor: "rgba(10, 10, 10, 0.08)",
          }}
        >
          <p
            className="mb-2"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "26px",
              background: "linear-gradient(90deg, #0066FF 0%, #FB2AF4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            The result?
          </p>
          <p
            className="m-0"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "17px",
              lineHeight: "26px",
              color: "#525252",
            }}
          >
            Meetings. Demos. Minimal enterprise impact.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center flex flex-col items-center gap-4">
          <a
            href="/catalyst"
            className="inline-flex items-center gap-2 text-center hover:opacity-80 transition-opacity"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#0A0A0A",
            }}
          >
            See How We Break the Pilot Loop with Catalyst
            <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.33333} />
          </a>
        </div>
      </div>
    </section>
  )
}
