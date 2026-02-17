"use client"

import Image from "next/image"
import { Shield, Lock, Server, FileCheck, Key, Users, TestTube, Clock, Globe, Layers } from "lucide-react"

const certifications = [
  {
    id: "01",
    name: "DPDP Standards",
    description: "Data Protection & Privacy Standards certified",
    logo: "/img/dpdp-act-2023.png",
  },
  {
    id: "02",
    name: "ISO 27001",
    description: "Information Security Management certified",
    logo: "/img/iso-27001.png",
  },
  {
    id: "03",
    name: "SOC 2 Type II",
    description: "Security & Availability Controls audited",
    logo: "/img/soc2.png",
  },
  {
    id: "04",
    name: "GDPR",
    description: "Full Data Protection Compliance",
    logo: "/img/gdpr-compliant.png",
  },
]

const securityFeatures = [
  { text: "End-to-end encryption", icon: Key },
  { text: "Regular penetration testing", icon: TestTube },
  { text: "Global data residency", icon: Globe },
  { text: "Role-based access control", icon: Users },
  { text: "99.99% uptime SLA", icon: Clock },
  { text: "Multi-tenant architecture", icon: Layers },
]

export function SecuritySection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Group 1410104285 / 1410104274 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
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
                Security
              </span>
            </div>
            <h2
              className="tracking-tight"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                fontWeight: 300,
                fontSize: "36px",
                lineHeight: "40px",
                background: "linear-gradient(90deg, #1C69E3 0%, #00B388 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Enterprise-Grade Security
            </h2>
          </div>
          <p
            className="max-w-sm flex items-center md:text-right"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#737373",
            }}
          >
            Meeting the highest standards required by global enterprises and financial institutions.
          </p>
        </div>

        {/* Two columns - Group 1410104286: left HorizontalBorder list, right Group 1410104276 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Certifications list */}
          <div className="space-y-0 border-t border-[#E5E5E5]">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="relative flex items-center gap-4 py-5 border-b border-[#E5E5E5]"
                style={{ minHeight: "89px" }}
              >
                <span
                  className="font-mono flex items-center shrink-0"
                  style={{
                    fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: "15px",
                    letterSpacing: "1px",
                    color: "#737373",
                  }}
                >
                  {cert.id}
                </span>
                <div
                  className="w-10 h-10 shrink-0 flex items-center justify-center box-border border overflow-hidden"
                  style={{ border: "1px solid #E5E5E5" }}
                >
                  {cert.logo ? (
                    <Image
                      src={cert.logo}
                      alt={cert.name}
                      width={40}
                      height={40}
                      className="object-contain"
                      style={{ opacity: 0.7 }}
                    />
                  ) : (
                    <Shield className="w-4 h-4" style={{ color: "#737373" }} strokeWidth={1.33333} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="flex items-center"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#0A0A0A",
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    className="flex items-center mt-0.5"
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#737373",
                    }}
                  >
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Features (Group 1410104275) + Visual (Overlay+Border with ENCRYPTED/COMPLIANT/AUDITED/SECURED) */}
          <div className="flex flex-col">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
              {securityFeatures.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  <feature.icon
                    className="w-4 h-4 shrink-0"
                    strokeWidth={1.33333}
                    style={{ color: "rgba(10, 10, 10, 0.6)" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "rgba(10, 10, 10, 0.8)",
                    }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Overlay+Border - Group 1410104276 bottom part */}
            <div
              className="relative box-border border mt-auto"
              style={{
                minHeight: "192px",
                background: "rgba(245, 245, 245, 0.4)",
                border: "1px solid #E5E5E5",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background:
                    "linear-gradient(180deg, #E5E5E5 4.17%, rgba(229, 229, 229, 0) 4.17%), linear-gradient(90deg, #E5E5E5 4.17%, rgba(229, 229, 229, 0) 4.17%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Pulsing rings */}
                  <div
                    className="absolute inset-0 rounded-full border box-border -m-2 animate-ping"
                    style={{
                      border: "1px solid rgba(28, 105, 227, 0.4)",
                      animationDuration: "3s",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border box-border -m-2 animate-ping"
                    style={{
                      border: "1px solid rgba(0, 179, 136, 0.35)",
                      animationDuration: "3s",
                      animationDelay: "1s",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border box-border -m-2 animate-ping"
                    style={{
                      border: "1px solid rgba(207, 87, 200, 0.3)",
                      animationDuration: "3s",
                      animationDelay: "2s",
                    }}
                  />
                  <div
                    className="relative w-16 h-16 flex items-center justify-center box-border rounded-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid rgba(245, 245, 245, 0.6)",
                    }}
                  >
                    <Shield
                      className="w-6 h-6 animate-pulse"
                      strokeWidth={2}
                      style={{
                        color: "rgba(10, 10, 10, 0.7)",
                        animationDuration: "2s",
                      }}
                    />
                  </div>
                </div>
              </div>
              <span
                className="absolute left-3 top-3 font-mono"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#737373",
                }}
              >
                ENCRYPTED
              </span>
              <span
                className="absolute right-3 top-3 font-mono"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#737373",
                }}
              >
                COMPLIANT
              </span>
              <span
                className="absolute left-3 bottom-3 font-mono"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#737373",
                }}
              >
                AUDITED
              </span>
              <span
                className="absolute right-3 bottom-3 font-mono"
                style={{
                  fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#737373",
                }}
              >
                SECURED
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
