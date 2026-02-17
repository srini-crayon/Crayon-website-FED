"use client"

import { ArrowUpRight } from "lucide-react"

export function FoundationSection() {
  const milestones = [
    {
      number: "01",
      title: "Patented Innovation",
      description: "3 proprietary AI patents powering enterprise systems",
      metric: "3 Patents",
      color: "#1C69E3",
    },
    {
      number: "02",
      title: "Domain Expertise",
      description: "Banking, fintech, travel, and operations at scale",
      metric: "4 Industries",
      color: "#00B388",
    },
    {
      number: "03",
      title: "Regulated Environments",
      description: "Full compliance with enterprise security standards",
      metric: "100% Compliant",
      color: "#CF57C8",
    },
    {
      number: "04",
      title: "Global Reach",
      description: "Serving millions across continents in real-time",
      metric: "117M+ Users",
      color: "#DE8900",
    },
  ]

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left - Text Content (Group 1410104256 / 1410104255 + 1410104254) */}
          <div className="lg:sticky lg:top-24">
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
                Since 2012
              </span>
            </div>

            <h2
              className="tracking-tight mb-6"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                letterSpacing: "-1.5px",
                background: "linear-gradient(90deg, #008F59 0%, #E900E2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Built from real enterprise execution
            </h2>

            <p
              className="mb-12 max-w-lg"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "23px",
                color: "#737373",
              }}
            >
              When GenAI and agentic AI reshaped the landscape, we didn&apos;t bolt new models onto old systems. We rebuilt. We sunset maya.ai. We redesigned our core architecture. We restructured the company around platform + execution. This wasn&apos;t cosmetic. It was structural. And this isn&apos;t our first gig. We&apos;ve been building enterprise AI since 2012. We know what it takes to move from pilot to production. We&apos;ve done it before. Now we&apos;ve redesigned for what&apos;s next.
            </p>

            {/* Stats - Group 1410104254: 13B+ Transactions | 12+ Years | divider | 117M+ Users */}
            <div className="flex items-center gap-10 flex-wrap">
              <div className="flex flex-col">
                <span
                  className="flex items-center"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 300,
                    fontSize: "36px",
                    lineHeight: "40px",
                    color: "#0A0A0A",
                  }}
                >
                  13B+
                </span>
                <span
                  className="flex items-center uppercase mt-1"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "1px",
                    color: "#737373",
                  }}
                >
                  Transactions
                </span>
              </div>
              <div className="flex flex-col">
                <span
                  className="flex items-center"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 300,
                    fontSize: "36px",
                    lineHeight: "40px",
                    color: "#0A0A0A",
                  }}
                >
                  12+
                </span>
                <span
                  className="flex items-center uppercase mt-1"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "1px",
                    color: "#737373",
                  }}
                >
                  Years
                </span>
              </div>
              <div
                className="shrink-0"
                style={{ width: "1px", height: "48px", background: "#E5E5E5" }}
              />
              <div className="flex flex-col">
                <span
                  className="flex items-center"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 300,
                    fontSize: "36px",
                    lineHeight: "40px",
                    color: "#0A0A0A",
                  }}
                >
                  117M+
                </span>
                <span
                  className="flex items-center uppercase mt-1"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "1px",
                    color: "#737373",
                  }}
                >
                  Users
                </span>
              </div>
            </div>
          </div>

          {/* Right - Box Cards (Group 1410104257): Background+Border, dot, 01-04, Heading 3, description, metric, arrow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((item, index) => {
              const accentColor = item.color
              return (
                <div
                  key={index}
                  className="relative box-border bg-white p-5"
                  style={{
                    border: "1px solid rgba(229, 229, 229, 0.6)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="rounded-full shrink-0"
                      style={{
                        width: "6px",
                        height: "6px",
                        background: accentColor,
                        borderRadius: "3.35544e+07px",
                      }}
                    />
                    <span
                      className="font-mono flex items-center"
                      style={{
                        fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                        fontWeight: 400,
                        fontSize: "10px",
                        lineHeight: "15px",
                        letterSpacing: "1px",
                        color: accentColor,
                      }}
                    >
                      {item.number}
                    </span>
                  </div>
                  <h3
                    className="flex items-center mb-1"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#0A0A0A",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="flex items-center mb-4"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "20px",
                      color: "#737373",
                    }}
                  >
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className="flex items-center"
                      style={{
                        fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                        fontWeight: 300,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "#0A0A0A",
                      }}
                    >
                      {item.metric}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 shrink-0 -rotate-45"
                      style={{ color: "#737373" }}
                      strokeWidth={1.33333}
                    />
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
