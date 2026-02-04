"use client"

import { useState } from "react"
import Image from "next/image"
import { Building2, Landmark, CreditCard, Globe, Sparkles, ShoppingBag, Beer, Tv } from "lucide-react"

export function ClientsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const clients = [
    { name: "HDFC Bank", icon: Landmark, region: "India", logo: "/img/hdfc-logo.png" },
    { name: "ADIB", icon: Building2, region: "UAE", logo: "/img/adib-logo.png" },
    { name: "Riyadh Bank", icon: CreditCard, region: "KSA", logo: "/img/riyadh-bank-logo.svg" },
    { name: "KBZ Bank", icon: Landmark, region: "Myanmar", logo: "/img/kbz-logo.png" },
    { name: "Mozark", icon: Sparkles, region: "Global", logo: "/img/mozark-logo.png" },
    { name: "Gradiant", icon: Globe, region: "Global", logo: "/img/gradiant-logo.png" },
    { name: "Western Union", icon: Globe, region: "Global", logo: "/img/western-union-logo.png" },
    { name: "Fabindia", icon: ShoppingBag, region: "India", logo: "/img/fabindia-logo.png" },
    { name: "Heineken", icon: Beer, region: "Global", logo: "/img/heinekenlogo.png" },
    { name: "Sony TV", icon: Tv, region: "Asia", logo: "/img/sony-logo.svg" },
  ]

  const stats = [
    { value: "117M+", label: "Users Reached" },
    { value: "13B+", label: "Transactions" },
    { value: "10+", label: "Countries" },
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
                Proven Enterprise Trust
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-light">
              <span className="bg-gradient-to-r from-[oklch(0.55_0.3_260)] to-[oklch(0.7_0.3_75)] bg-clip-text text-transparent">
                Trusted Globally by Industry
              </span>
              <span className="font-medium text-foreground"> Leaders</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Powering AI transformation across banking, retail, and enterprise
          </p>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 border-l border-t border-border">
          {clients.map((client, index) => {
            const Icon = client.icon
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
                  {/* Icon - bottom right */}
                  <div className="absolute bottom-0 right-0 w-10 h-10 border border-border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-accent/50 group-hover:bg-background z-10">
                    <Icon className="w-4 h-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />
                  </div>
                  
                  {/* Logo */}
                  {client.logo ? (
                    <div className="mb-3 h-8 flex items-center pr-12">
                      <div className="relative w-24 h-8">
                        <Image
                          src={client.logo}
                          alt={client.name}
                          width={96}
                          height={32}
                          className="object-contain object-left transition-all duration-300"
                          style={{
                            maxHeight: '32px',
                            height: 'auto',
                            width: 'auto'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 mb-3" />
                  )}
                  
                  <div className="flex-1 pr-12">
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

        {/* Stats */}
        <div className="mt-4 pt-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center cursor-default"
              >
                <p className="text-3xl md:text-4xl font-light text-foreground transition-all duration-300 group-hover:tracking-wider">
                  {stat.value}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground mt-2 uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
