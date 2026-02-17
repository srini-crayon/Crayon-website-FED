"use client"

import { useState } from "react"
import Image from "next/image"

/** Base path for client logos (files live in public/img/). */
const CLIENT_LOGOS_PATH = "/img"

const clients = [
  { name: "HDFC Bank", region: "India", logo: "hdfc-logo.png" },
  { name: "ADIB", region: "UAE", logo: "adib-logo.png" },
  { name: "Riyad Bank", region: "KSA", logo: "riyadh-bank-logo.svg" },
  { name: "KBZ Bank", region: "Myanmar", logo: "kbz-logo.png" },
  { name: "Mozark", region: "Global", logo: "mozark-logo.png" },
  { name: "Gradiant", region: "Global", logo: "gradiant-logo.png" },
  { name: "AMEX", region: "Global", logo: "amex-logo.png" },
  { name: "Emirates", region: "UAE", logo: "emirates-logo.png" },
  { name: "HSBC", region: "Global", logo: "hsbc-logo.png" },
  { name: "VISA", region: "Global", logo: "visa-logo.png" },
]

export function ClientsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [failedLogos, setFailedLogos] = useState<Set<number>>(new Set())

  const handleLogoError = (index: number) => {
    setFailedLogos((prev) => new Set(prev).add(index))
  }

  return (
    <section id="clients" className="py-24 md:py-32 bg-background">
      <div className="max-w-[1352px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Group 1410104262 / 1410104261: divider, label, heading, right copy */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ gap: "12px" }}>
              <span
                className="shrink-0"
                style={{
                  width: "32px",
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
                Success Sets Us Apart
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                background: "linear-gradient(90deg, #0053FF 0%, #FF6D00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              This isn&apos;t theory. Our systems support:
            </h2>
          </div>
          <p
            className="max-w-[367px] flex items-center"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#737373",
            }}
          >
            AI that runs inside regulated environments. AI that integrates with real systems. AI that delivers measurable outcomes. These are not pilots. They are production systems.
          </p>
        </div>

        {/* Client Grid - Border 1px top+left #E5E5E5; cells 132px min-height, 24px padding */}
        <div
          className="grid grid-cols-2 md:grid-cols-5"
          style={{
            borderWidth: "1px 0 0 1px",
            borderStyle: "solid",
            borderColor: "#E5E5E5",
          }}
        >
          {clients.map((client, index) => {
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative cursor-pointer transition-all duration-300"
                style={{
                  borderRight: "1px solid #E5E5E5",
                  borderBottom: "1px solid #E5E5E5",
                  minHeight: "132px",
                  padding: "24px",
                }}
              >
                {/* Hover background */}
                <div
                  className={`absolute inset-0 bg-muted/50 transition-transform duration-500 ease-out origin-left ${
                    hoveredIndex === index ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                {/* Content */}
                <div className="relative flex flex-col h-full">
                  {/* Logo - spec: 24px from top */}
                  {client.logo ? (
                    <div className="h-8 flex items-center mb-4">
                      <div
                        className={`relative w-24 h-8 flex items-center justify-center overflow-hidden rounded ${
                          client.name === "HSBC" || client.name === "VISA" ? "bg-white min-w-[6rem] min-h-[2rem] px-2 py-1" : "bg-background"
                        }`}
                      >
                        {failedLogos.has(index) ? (
                          <span className="text-xs font-semibold text-foreground/80 truncate px-1">
                            {client.name}
                          </span>
                        ) : (
                          <Image
                            src={`${CLIENT_LOGOS_PATH}/${client.logo}`}
                            alt={client.name}
                            width={96}
                            height={32}
                            className="object-contain object-left transition-all duration-300"
                            style={{
                              maxHeight: "32px",
                              height: "auto",
                              width: "auto",
                            }}
                            onError={() => handleLogoError(index)}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 mb-4" />
                  )}

                  {/* Heading 3 - spec: Geist 500, 14px/20px, #0A0A0A */}
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
                    {client.name}
                  </h3>

                  {/* Region - spec: Geist Mono 10px/15px, letter-spacing 0.5px, uppercase, #737373 */}
                  <p
                    className="flex items-center uppercase"
                    style={{
                      fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                      fontWeight: 400,
                      fontSize: "10px",
                      lineHeight: "15px",
                      letterSpacing: "0.5px",
                      color: "#737373",
                    }}
                  >
                    {client.region}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* + Many More... - 2 lines above; Poppins 500, 16px/24px, center, #0A0A0A */}
        <div className="text-center" style={{ marginTop: "1.5rem", paddingTop: 0 }}>
          <p
            className="flex items-center justify-center"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "24px",
              color: "#0A0A0A",
              textAlign: "center",
            }}
          >
            + Many More...
          </p>
        </div>
      </div>
    </section>
  )
}
