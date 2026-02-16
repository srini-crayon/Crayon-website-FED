"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Search, ChevronDown } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Marquee } from "@/components/banking/marquee"

/** Founded From Singapore bar: icon path (place asset in public/img/) */
const FOUNDED_SINGAPORE_ICON_SRC = "/img/founded-singapore-icon.png"

/** Just ask button: 32×32 logo on the right (place asset in public/img/) */
const JUST_ASK_LOGO_SRC = "/img/just-ask-logo.png"

/** Card category → icon in public/img/agents */
const CATEGORY_ICON_SRC: Record<string, string> = {
  "Workflows & Automations": "/img/agents/workflows-icon.png",
  "AI Research Prompts": "/img/agents/research-icon.png",
  Sequences: "/img/agents/sequences-icon.png",
  Conversations: "/img/agents/conversations-icon.png",
}

const TEMPLATE_CARDS = [
  { category: "Workflows & Automations", title: "Ask Happy Customers for Referrals", author: "BY CRAYON DATA" },
  { category: "Workflows & Automations", title: "Ask Happy Customers for Reviews", author: "BY CRAYON DATA" },
  { category: "AI Research Prompts", title: "Assign as B2B or B2C", author: "BY CRAYON DATA" },
  { category: "Workflows & Automations", title: "Automatically Hit No-Shows", author: "BY CRAYON DATA" },
  { category: "Workflows & Automations", title: "Call When Email is Opened or Clicked", author: "BY CRAYON DATA" },
  { category: "Sequences", title: "Congratulate on New Role", author: "BY CRAYON DATA" },
  { category: "Sequences", title: "Conversation Starter Cold Calling Script", author: "By Nick Ross, Senior SDR Manager at Klue" },
  { category: "Sequences", title: "Convert Inbound Leads", author: "BY CRAYON DATA" },
  { category: "Workflows & Automations", title: "Create Deal When Contact Is Interested", author: "BY CRAYON DATA" },
  { category: "Conversations", title: "Demo Call Scorecard", author: "BY CRAYON DATA" },
  { category: "Conversations", title: "Discovery Call Scorecard", author: "BY CRAYON DATA" },
  { category: "Workflows & Automations", title: "End Sequence for Outdated Contacts", author: "BY CRAYON DATA" },
]

export default function IndustryBankingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLabel, setFilterLabel] = useState("Recommended")
  const [justAskValue, setJustAskValue] = useState("")

  // Scroll animations with IntersectionObserver (same pattern as agents, our-values)
  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 200 })
      } else {
        setTimeout(callback, 100)
      }
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains("fade-in-section")) {
                entry.target.classList.add("fade-in-visible")
              } else if (entry.target.classList.contains("slide-in-left")) {
                entry.target.classList.add("slide-in-visible")
              } else if (entry.target.classList.contains("slide-in-right")) {
                entry.target.classList.add("slide-in-visible")
              } else if (entry.target.classList.contains("scale-in")) {
                entry.target.classList.add("scale-in-visible")
              } else if (entry.target.classList.contains("fade-in-blur")) {
                entry.target.classList.add("fade-in-blur-visible")
              } else if (entry.target.classList.contains("stagger-item")) {
                entry.target.classList.add("stagger-visible")
              }
              observer.unobserve(entry.target)
            }
          })
        })
      },
      observerOptions
    )

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      )
      animatedElements.forEach((el) => observer.observe(el))
    }

    scheduleObservation(observeElements)

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      )
      animatedElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      {/* Breadcrumb + Back — Nav breadcrumb List: 1328×48, left 42px */}
      <section className="pt-10 pb-2 fade-in-section">
        <div
          className="mx-auto w-full flex items-center"
          style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px", height: "48px" }}
        >
          <Link
            href="/agents-store"
            className="inline-flex items-center shrink-0 rounded-lg border border-[#D0D5DD] bg-white hover:bg-gray-50 transition-colors box-border"
            style={{
              width: "72.17px",
              height: "28px",
              paddingLeft: "13px",
              paddingRight: "12px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#344054",
            }}
          >
            <ArrowLeft
              className="shrink-0"
              width={12}
              height={12}
              style={{ color: "#181818" }}
              aria-hidden
            />
            <span className="ml-1.5">Back</span>
          </Link>
          <Breadcrumb className="ml-4">
            <BreadcrumbList
              className="gap-2 items-center"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", lineHeight: "16px" }}
            >
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/agents-store"
                  style={{ fontWeight: 400, color: "#475467" }}
                  className="hover:text-[#101828]"
                >
                  Agent Store
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="[&>svg]:size-4 [&>svg]:stroke-[1.33px]" style={{ color: "#D0D5DD" }} />
              <BreadcrumbItem>
                <BreadcrumbPage style={{ fontWeight: 500, color: "#101828" }}>
                  AI for <span style={{ color: "#2563EB" }}>Banking</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Heading + Description */}
      <section className="pt-4 pb-4 fade-in-section">
        <div
          className="mx-auto w-full"
          style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}
        >
          <h1
            className="mb-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "30px",
              color: "#101828",
            }}
          >
            AI for <span style={{ color: "#2563EB" }}>Banking</span>
          </h1>
          <p
            className="max-w-[1260px]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "16px",
              color: "#667085",
            }}
          >
            The Conversational AI Assistant for Banking enables seamless customer engagement across chat, voice, and web. Tailored to banking, it understands industry terminology, workflows, and compliance needs. It supports use cases like account inquiries, transactions, ATM locators, customer query resolution. With rapid deployment frameworks, banks can go live in weeks, not months. Built-in integrations streamline operations and reduce contact center load. The result: 24/7 personalized, secure, and cost-efficient digital banking experiences.
          </p>
        </div>
      </section>

      {/* Search + Filter — animation on inner div so section has no transform (avoids top trim when zoomed) */}
      <section className="pt-2 pb-6 overflow-visible">
        <div className="slide-in-left mx-auto w-full flex flex-wrap items-center gap-3 overflow-visible" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <div
            className="industry-banking-search relative flex items-center flex-1 min-w-[200px] max-w-[963px] h-10 rounded-[32px] bg-[#F8F8F8]"
          >
            <Search className="absolute left-3.5 w-5 h-5 shrink-0 pointer-events-none" style={{ color: "#828282" }} aria-hidden />
            <input
              type="search"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-transparent border-0 pl-11 pr-4 rounded-[32px] outline-none placeholder:text-[#828282] focus:ring-0"
              style={{
                fontFamily: "Arial, sans-serif",
                fontWeight: 400,
                fontSize: "19.5px",
                lineHeight: "22px",
                color: "#181818",
              }}
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-[#D0D5DD] bg-white shadow-sm hover:bg-gray-50 transition-colors"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "20px",
              color: "#344054",
              minWidth: "150px",
              boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.04)",
            }}
          >
            {filterLabel}
            <ChevronDown className="w-4 h-4" style={{ color: "#344054" }} />
          </button>
        </div>
      </section>

      {/* Cards grid — same width/padding as search bar, grid centered within that */}
      <section className="pb-16">
        <div className="mx-auto w-full" style={{ maxWidth: "1328px", paddingLeft: "42px", paddingRight: "24px" }}>
          <div className="w-full" style={{ maxWidth: "1074px" }}>
            <div className="industry-banking-cards grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-start">
            {TEMPLATE_CARDS.map((card, i) => {
              const iconSrc = CATEGORY_ICON_SRC[card.category] ?? "/img/agents/workflows-icon.png"
              return (
                <Link
                  key={i}
                  href="#"
                  className="stagger-item block rounded-lg bg-[#F5F5F5] overflow-hidden text-left hover:bg-[#EBEBEB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                  style={{
                    width: "100%",
                    minHeight: "257px",
                    textDecoration: "none",
                  }}
                >
                  <div className="relative p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start">
                      <span
                        className="text-[13.3px] leading-[14px] tracking-[0.169px]"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}
                      >
                        {card.category}
                      </span>
                      <div className="flex items-center justify-center shrink-0 rounded-lg overflow-hidden" style={{ width: 48, height: 48 }}>
                        <img
                          src={iconSrc}
                          alt=""
                          width={48}
                          height={48}
                          className="object-contain w-full h-full opacity-90"
                        />
                      </div>
                    </div>
                    <h3
                      className="mt-8 flex-1 text-[22.5px] leading-8 tracking-[0.169px]"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}
                    >
                      {card.title}
                    </h3>
                    <span
                      className="mt-2 text-[10px] leading-[15px] tracking-[0.5px] uppercase"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "rgba(0, 0, 0, 0.87)" }}
                    >
                      {card.author}
                    </span>
                  </div>
                </Link>
              )
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Just ask — text input; animation on inner div to avoid bottom trim from section transform */}
      <section className="flex justify-center pt-12 pb-6 overflow-visible">
        <div className="scale-in">
          <div
            className="just-ask-input-wrapper relative flex items-center min-w-[200px] w-full max-w-[400px] h-12 rounded-[100px] px-4 gap-2 backdrop-blur-[2px] transition-opacity hover:opacity-95 border-0 outline-none"
          style={{
            background: "rgba(237, 237, 237, 0.4)",
            backdropFilter: "blur(2px)",
          }}
        >
          <input
            type="text"
            value={justAskValue}
            onChange={(e) => setJustAskValue(e.target.value)}
            placeholder="Just ask..."
            className="just-ask-input flex-1 min-w-0 h-full bg-transparent border-0 rounded-[100px] outline-none shadow-none placeholder:text-[#101828]/70 text-[15px] leading-[20px] focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#101828",
            }}
            aria-label="Just ask"
          />
          <span className="flex shrink-0 w-8 h-8 items-center justify-center" aria-hidden>
            <img
              src={JUST_ASK_LOGO_SRC}
              alt=""
              width={32}
              height={32}
              className="object-contain w-full h-full"
            />
          </span>
        </div>
        </div>
      </section>

      {/* Above footer scroll */}
      <section className="fade-in-section w-full mt-12 flex justify-center" style={{ height: "52px", background: "#F3F4F7" }}>
        <div className="h-full overflow-hidden w-full max-w-[1511px] flex items-center">
          <Marquee className="h-6 w-full [--gap:12px]" speed="slow" seamless>
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="flex flex-row items-center gap-3 shrink-0 min-w-0"
                style={{ height: "24px" }}
              >
                <span className="relative flex shrink-0 w-[18px] h-[18px] align-middle" aria-hidden>
                  <img
                    src={FOUNDED_SINGAPORE_ICON_SRC}
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain object-center w-full h-full"
                  />
                </span>
                <span
                  className="text-base leading-6 whitespace-nowrap shrink-0"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, color: "#374151" }}
                >
                  Founded From Singapore
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>
    </div>
  )
}
