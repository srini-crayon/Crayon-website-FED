"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Search } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Marquee } from "@/components/banking/marquee"
import type { IndustryBankingConfig } from "./config"

const FOUNDED_SINGAPORE_ICON_SRC = "/img/founded-singapore-icon.png"
const JUST_ASK_LOGO_SRC = "/img/just-ask-logo.png"

const CATEGORY_ICON_SRC: Record<string, string> = {
  "Workflows & Automations": "/img/agents/workflows-icon.png",
  "AI Research Prompts": "/img/agents/research-icon.png",
  Sequences: "/img/agents/sequences-icon.png",
  Conversations: "/img/agents/conversations-icon.png",
}

type Props = {
  config: IndustryBankingConfig
  /** Optional: base path for back link when on a bank-specific page (e.g. /industry/banking) */
  backToBankingBase?: boolean
}

export function IndustryBankingContent({ config, backToBankingBase = false }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [businessFunctionFilter, setBusinessFunctionFilter] = useState<string>("All")
  const [justAskValue, setJustAskValue] = useState("")

  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 200 })
      } else {
        setTimeout(callback, 100)
      }
    }
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            if (entry.target.classList.contains("fade-in-section")) entry.target.classList.add("fade-in-visible")
            else if (entry.target.classList.contains("slide-in-left")) entry.target.classList.add("slide-in-visible")
            else if (entry.target.classList.contains("slide-in-right")) entry.target.classList.add("slide-in-visible")
            else if (entry.target.classList.contains("scale-in")) entry.target.classList.add("scale-in-visible")
            else if (entry.target.classList.contains("fade-in-blur")) entry.target.classList.add("fade-in-blur-visible")
            else if (entry.target.classList.contains("stagger-item")) entry.target.classList.add("stagger-visible")
            observer.unobserve(entry.target)
          })
        })
      },
      observerOptions
    )
    const observeElements = () => {
      document.querySelectorAll(".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item").forEach((el) => observer.observe(el))
    }
    scheduleObservation(observeElements)
    return () => {
      document.querySelectorAll(".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item").forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  const businessFunctions = config.businessFunctions as string[]
  const parts = config.featuresStr.split(";").map((s) => s.trim()).filter(Boolean)
  const featuresHeading = parts[0] ?? "Key capabilities"
  const featuresList = parts.length > 1 ? parts.slice(1) : []
  const features = featuresList.map((item) => {
    const dashMatch = item.match(/^([^–\-]{2,80})\s*[–\-]\s*(.+)$/)
    if (dashMatch) return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
    return { title: item, description: "" }
  })

  const q = searchQuery.trim().toLowerCase()
  const filteredCards = config.cards.filter((card) => {
    const matchFunction = businessFunctionFilter === "All" || card.businessFunction === businessFunctionFilter
    const matchSearch = !q || card.title.toLowerCase().includes(q) || card.category.toLowerCase().includes(q) || card.businessFunction.toLowerCase().includes(q)
    return matchFunction && matchSearch
  })

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      <section className="pt-10 pb-2 fade-in-section">
        <div className="mx-auto w-full flex items-center" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px", height: "48px" }}>
          <Link
            href={backToBankingBase ? "/industry/banking" : "/agents-store"}
            className="inline-flex items-center shrink-0 rounded-lg border border-[#D0D5DD] bg-white hover:bg-gray-50 transition-colors box-border"
            style={{ width: "72.17px", height: "28px", paddingLeft: "13px", paddingRight: "12px", fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#344054" }}
          >
            <ArrowLeft className="shrink-0" width={12} height={12} style={{ color: "#181818" }} aria-hidden />
            <span className="ml-1.5">{backToBankingBase ? "Banking" : "Back"}</span>
          </Link>
          <Breadcrumb className="ml-4">
            <BreadcrumbList className="gap-2 items-center" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/agents-store" style={{ fontWeight: 400, color: "#475467" }} className="hover:text-[#101828]">Agent Store</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:size-4 [&>svg]:stroke-[1.33px]" style={{ color: "#D0D5DD" }} />
              <BreadcrumbItem>
                <BreadcrumbPage style={{ fontWeight: 500, color: "#101828" }}>
                  AI for <span style={{ color: "#2563EB" }}>{config.label}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      <section className="pt-4 pb-4 fade-in-section">
        <div className="mx-auto w-full" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <h1 className="mb-2" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "20px", lineHeight: "30px", color: "#101828" }}>
            AI for <span style={{ color: "#2563EB" }}>{config.label}</span>
          </h1>
          <p className="max-w-[1260px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#667085" }}>
            {config.description}
          </p>
        </div>
      </section>

      <section className="pt-4 pb-6 fade-in-section">
        <div className="mx-auto w-full" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <h2 className="mb-2" style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "20px", lineHeight: "30px", color: "#101828" }}>Features</h2>
          <p className="max-w-[1260px] mb-6" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#667085" }}>{featuresHeading}</p>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ maxWidth: "1074px" }}>
            {features.map((f, i) => (
              <div key={i} className="rounded-lg p-6 bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors" style={{ fontFamily: "Inter, sans-serif", minHeight: "120px" }}>
                <h3 style={{ fontWeight: 400, fontSize: "22.5px", lineHeight: "32px", letterSpacing: "0.169px", color: "rgba(0, 0, 0, 0.87)", marginBottom: "8px" }}>{f.title}</h3>
                {f.description && <p style={{ fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#667085", margin: 0 }}>{f.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-2 pb-4 overflow-visible">
        <div className="slide-in-left mx-auto w-full overflow-visible" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="industry-banking-search relative flex items-center flex-1 min-w-[200px] max-w-[963px] h-10 rounded-[32px] bg-[#F8F8F8]">
              <Search className="absolute left-3.5 w-5 h-5 shrink-0 pointer-events-none" style={{ color: "#828282" }} aria-hidden />
              <input
                type="search"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-0 pl-11 pr-4 rounded-[32px] outline-none placeholder:text-[#828282] focus:ring-0"
                style={{ fontFamily: "Arial, sans-serif", fontWeight: 400, fontSize: "19.5px", lineHeight: "22px", color: "#181818" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2" style={{ maxWidth: "1074px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "16px", color: "#667085", marginRight: "4px" }}>Business function:</span>
            {businessFunctions.map((fn) => {
              const isActive = businessFunctionFilter === fn
              return (
                <button
                  key={fn}
                  type="button"
                  onClick={() => setBusinessFunctionFilter(fn)}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                    lineHeight: "18px",
                    color: isActive ? "#FFFFFF" : "#344054",
                    background: isActive ? "#2563EB" : "#FFFFFF",
                    borderColor: isActive ? "#2563EB" : "#D0D5DD",
                    boxShadow: isActive ? "0px 1px 2px rgba(16, 24, 40, 0.04)" : "none",
                  }}
                >
                  {fn}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto w-full" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <div className="w-full" style={{ maxWidth: "1074px" }}>
            <div className="industry-banking-cards grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-start">
              {filteredCards.map((card, i) => {
                const iconSrc = CATEGORY_ICON_SRC[card.category] ?? "/img/agents/workflows-icon.png"
                return (
                  <Link
                    key={i}
                    href="#"
                    className="stagger-item block rounded-lg bg-[#F5F5F5] overflow-hidden text-left hover:bg-[#EBEBEB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                    style={{ width: "100%", minHeight: "257px", textDecoration: "none" }}
                  >
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="flex justify-between items-start">
                        <span className="text-[13.3px] leading-[14px] tracking-[0.169px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}>{card.category}</span>
                        <div className="flex items-center justify-center shrink-0 rounded-lg overflow-hidden" style={{ width: 48, height: 48 }}>
                          <img src={iconSrc} alt="" width={48} height={48} className="object-contain w-full h-full opacity-90" />
                        </div>
                      </div>
                      <h3 className="mt-8 flex-1 text-[22.5px] leading-8 tracking-[0.169px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}>{card.title}</h3>
                      <span className="mt-2 text-[10px] leading-[15px] tracking-[0.5px] uppercase" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}>{card.author}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center pt-12 pb-6 overflow-visible">
        <div className="scale-in">
          <div className="just-ask-input-wrapper relative flex items-center min-w-[200px] w-full max-w-[400px] h-12 rounded-[100px] px-4 gap-2 backdrop-blur-[2px] transition-opacity hover:opacity-95 border-0 outline-none" style={{ background: "rgba(237, 237, 237, 0.4)", backdropFilter: "blur(2px)" }}>
            <input
              type="text"
              value={justAskValue}
              onChange={(e) => setJustAskValue(e.target.value)}
              placeholder="Just ask..."
              className="just-ask-input flex-1 min-w-0 h-full bg-transparent border-0 rounded-[100px] outline-none shadow-none placeholder:text-[#101828]/70 text-[15px] leading-[20px] focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, color: "#101828" }}
              aria-label="Just ask"
            />
            <span className="flex shrink-0 w-8 h-8 items-center justify-center" aria-hidden>
              <img src={JUST_ASK_LOGO_SRC} alt="" width={32} height={32} className="object-contain w-full h-full" />
            </span>
          </div>
        </div>
      </section>

      <section className="fade-in-section w-full mt-12 flex justify-center" style={{ height: "52px", background: "#F3F4F7" }}>
        <div className="h-full overflow-hidden w-full max-w-[1511px] flex items-center">
          <Marquee className="h-6 w-full [--gap:12px]" speed="slow" seamless>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-row items-center gap-3 shrink-0 min-w-0" style={{ height: "24px" }}>
                <span className="relative flex shrink-0 w-[18px] h-[18px] align-middle" aria-hidden>
                  <img src={FOUNDED_SINGAPORE_ICON_SRC} alt="" width={18} height={18} className="object-contain object-center w-full h-full" />
                </span>
                <span className="text-base leading-6 whitespace-nowrap shrink-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, color: "#374151" }}>Founded From Singapore</span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </div>
  )
}
