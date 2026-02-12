"use client"

import { useState } from "react"
import Image from "next/image"

export function ClientsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const clients = [
    { name: "HDFC Bank", region: "India", logo: "/img/hdfc-logo.png" },
    { name: "ADIB", region: "UAE", logo: "/img/adib-logo.png" },
    { name: "Riyad Bank", region: "KSA", logo: "/img/riyadh-bank-logo.svg" },
    { name: "KBZ Bank", region: "Myanmar", logo: "/img/kbz-logo.png" },
    { name: "Mozark", region: "Global", logo: "/img/mozark-logo.png" },
    { name: "Gradiant", region: "Global", logo: "/img/gradiant-logo.png" },
    { name: "AMEX", region: "Global", logo: "/img/amex-logo.png" },
    { name: "Emirates", region: "UAE", logo: "/img/emirates-logo.png" },
    { name: "HSBC", region: "Global", logo: "/img/hsbc-logo.png" },
    { name: "VISA", region: "Global", logo: "/img/visa-logo.png" },
  ]

  return (
    <section id="clients" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Success Sets Us Apart
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light">
              <span className="bg-gradient-to-r from-[oklch(0.55_0.3_260)] to-[oklch(0.7_0.3_75)] bg-clip-text text-transparent">
                This isn't theory.
              </span>
              <span className="font-medium text-foreground"> Our systems support:</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            AI that runs inside regulated environments. AI that integrates with real systems. AI that delivers measurable outcomes. These are not pilots. They are production systems.
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 border-l border-t border-border">
          {clients.map((client, index) => {
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative border-r border-b border-border p-6 cursor-pointer transition-all duration-300"
              >
                {/* Hover background */}
                <div
                  className={`absolute inset-0 bg-muted/50 transition-transform duration-500 ease-out origin-left ${
                    hoveredIndex === index ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                {/* Content */}
                <div className="relative flex flex-col h-full">
                  {/* Logo */}
                  {client.logo ? (
                    <div className="mb-3 h-8 flex items-center">
                      <div
                        className={`relative w-24 h-8 flex items-center justify-center overflow-hidden ${
                          client.name === "HSBC" || client.name === "VISA"
                            ? "rounded min-w-[6rem] min-h-[2rem] px-2 py-1"
                            : ""
                        }`}
                        style={
                          client.name === "HSBC" || client.name === "VISA"
                            ? { backgroundColor: "#ffffff" }
                            : undefined
                        }
                      >
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={96}
                          height={32}
                          className="object-contain object-left transition-all duration-300"
                          style={{
                            maxHeight: "32px",
                            height: "auto",
                            width: "auto",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 mb-3" />
                  )}
                  
                  <div className="flex-1">
                    {/* Name */}
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {client.name}
                    </h3>

                    {/* Region */}
                    <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
                      {client.region}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Many more */}
        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground/80 font-medium">+ Many More...</span>
          </p>
        </div>
      </div>
    </section>
  )
}
