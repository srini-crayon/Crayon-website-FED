"use client";

import { useState } from "react";
import { Shield, Lock, Server, FileCheck, ArrowUpRight, Key, Users, TestTube, Clock, Globe, Layers } from "lucide-react";
import Image from "next/image";

const certifications = [
  {
    id: "01",
    name: "ISO 27001",
    description: "Information Security Management System certified",
    icon: Shield,
    logo: "/img/iso-27001.png",
  },
  {
    id: "02",
    name: "ISO 27701",
    description: "Privacy Information Management certified",
    icon: Lock,
    logo: "/img/iso-27701.png",
  },
  {
    id: "03",
    name: "SOC 2 Type II",
    description: "Security & Availability Controls audited",
    icon: Server,
    logo: "/img/soc2.png",
  },
  {
    id: "04",
    name: "GDPR",
    description: "Full Data Protection Compliance",
    icon: FileCheck,
    logo: "/img/gdpr-compliant.png",
  },
];

const securityFeatures = [
  { text: "End-to-end encryption", icon: Key },
  { text: "Role-based access control", icon: Users },
  { text: "Regular penetration testing", icon: TestTube },
  { text: "99.99% uptime SLA", icon: Clock },
  { text: "Global data residency", icon: Globe },
  { text: "Multi-tenant architecture", icon: Layers },
];

export function SecuritySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[1px] bg-foreground/40 dark:bg-foreground/50" />
              <span className="text-xs font-mono text-foreground/70 dark:text-foreground/80 tracking-widest uppercase">
                Security
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light">
              <span className="bg-gradient-to-r from-[oklch(0.55_0.2_260)] to-[oklch(0.65_0.2_175)] bg-clip-text text-transparent">
                Enterprise-Grade
              </span>
              <span className="font-medium text-foreground"> Security</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm md:text-right">
            Meeting the highest standards required by global enterprises and financial institutions.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Certifications */}
          <div className="space-y-0 border-t border-border">
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative border-b border-border py-6 cursor-pointer"
              >
                {/* Background fill micro-interaction */}
                <div
                  className={`absolute inset-0 bg-muted/50 transition-transform duration-500 ease-out origin-left ${
                    hoveredIndex === index ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                <div className="relative flex items-center gap-6">
                  {/* Number */}
                  <span className="text-[10px] font-mono text-muted-foreground tracking-widest w-6">
                    {cert.id}
                  </span>

                  {/* Icon/Logo */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center border transition-all duration-300 relative overflow-hidden ${
                      hoveredIndex === index
                        ? "border-accent bg-accent/5"
                        : "border-border"
                    }`}
                  >
                    {cert.logo ? (
                      <div className="relative w-full h-full p-1.5">
                        <Image
                          src={cert.logo}
                          alt={cert.name}
                          fill
                          className="object-contain transition-opacity duration-300"
                          style={{
                            opacity: hoveredIndex === index ? 1 : 0.7
                          }}
                        />
                      </div>
                    ) : null}
                    <cert.icon
                      className={`w-4 h-4 transition-colors duration-300 absolute ${
                        cert.logo ? 'opacity-0' : ''
                      } ${
                        hoveredIndex === index ? "text-accent" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {cert.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    className={`w-4 h-4 transition-all duration-300 ${
                      hoveredIndex === index
                        ? "text-accent translate-x-0.5 -translate-y-0.5 opacity-100"
                        : "text-muted-foreground/30 opacity-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right - Features + Visual */}
          <div className="flex flex-col justify-between">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-12">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <feature.icon className="w-4 h-4 text-foreground/60 dark:text-foreground/70 transition-all duration-300 group-hover:scale-110 group-hover:text-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground/80 dark:text-foreground/90 transition-colors duration-300 group-hover:text-foreground">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Minimal Visual */}
            <div className="relative h-48 border border-border bg-muted/40 dark:bg-muted/30">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20 dark:opacity-15">
                <div className="h-full w-full" style={{
                  backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px),
                                    linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }} />
              </div>

              {/* Center element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 w-20 h-20 -m-2 border animate-ping" style={{ 
                    borderColor: 'oklch(0.55 0.2 260 / 0.4)',
                    animationDuration: '3s' 
                  }} />
                  <div className="absolute inset-0 w-20 h-20 -m-2 border animate-ping" style={{ 
                    borderColor: 'oklch(0.65 0.2 175 / 0.35)',
                    animationDuration: '3s', 
                    animationDelay: '1s' 
                  }} />
                  <div className="absolute inset-0 w-20 h-20 -m-2 border animate-ping" style={{ 
                    borderColor: 'oklch(0.65 0.2 330 / 0.3)',
                    animationDuration: '3s', 
                    animationDelay: '2s' 
                  }} />
                  
                  {/* Shield */}
                  <div className="w-16 h-16 border border-accent/60 dark:border-accent/50 flex items-center justify-center bg-background/80 dark:bg-background/70">
                    <Shield className="w-6 h-6 text-foreground/70 dark:text-foreground/80 animate-pulse" style={{ animationDuration: '2s' }} />
                  </div>
                </div>
              </div>

              {/* Corner labels */}
              <span className="absolute top-3 left-3 text-[10px] font-mono text-muted-foreground">
                ENCRYPTED
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground">
                COMPLIANT
              </span>
              <span className="absolute bottom-3 left-3 text-[10px] font-mono text-muted-foreground">
                AUDITED
              </span>
              <span className="absolute bottom-3 right-3 text-[10px] font-mono text-muted-foreground">
                SECURED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
