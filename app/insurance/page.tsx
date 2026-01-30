"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import HeroCta from "../../components/HeroCta"
import { Mic, Sparkles, Video, UserCircle, Users, Database, BarChart2, ChevronRight, Gift, FileText, Wallet, HelpCircle, Plane, ArrowRight, UserCog, LayoutGrid, TrendingUp, FileBarChart, Leaf, ShieldCheck, FlaskConical, FileCheck, AlertTriangle, Calculator, MessageSquare, ClipboardList, Search, Camera, Gauge, Target, Layers, Rocket } from "lucide-react"

const capabilities = [
  { icon: "circle" as const, color: "#04ab8b", text: "Claims Processing" },
  { icon: "triangle" as const, color: "#394fa1", text: "Risk Assessment" },
  { icon: "square" as const, color: "#ffc334", text: "Underwriting AI" },
  { icon: "circle" as const, color: "#394fa1", text: "Policy Management" },
  { icon: "triangle" as const, color: "#ffc334", text: "Fraud Detection" },
  { icon: "circle" as const, color: "#ed407b", text: "Customer Service" },
  { icon: "circle" as const, color: "#974095", text: "Document Analysis" },
  { icon: "triangle" as const, color: "#394fa1", text: "Agentic Workflows" },
]

const agentNames = [
  { icon: "circle" as const, color: "#F05283", text: "Claims Assistant" },
  { icon: "triangle" as const, color: "#FFC334", text: "Risk Analyzer" },
  { icon: "square" as const, color: "#00AE8E", text: "Policy Advisor" },
  { icon: "circle" as const, color: "#394fa1", text: "Underwriting Co-Pilot" },
  { icon: "triangle" as const, color: "#974095", text: "Fraud Shield" },
]

const megaTabs = [
  { id: "cx", label: "01 Customer Experience" },
  { id: "ex", label: "02 Employee Experience" },
  { id: "dx", label: "03 Data Experience" },
]

// Three cards as on v0: icon/illustration + title + description
const megaTrendCards = [
  {
    id: "clicks",
    title: "From Clicks to Conversations",
    body: "Voice will outsell clicks — financial services will soon be driven by natural conversations",
    illustration: "mic" as const, // mic in circles + sound bars
  },
  {
    id: "assistant",
    title: "The Invisible Hyper-Personal Assistant",
    body: "Tomorrow's financial assistant will be invisible but always available, and totally hyper personal",
    illustration: "chat" as const, // AI Assistant UI + bubble + 3 placeholder squares
    chatLabel: "AI Assistant",
    chatBubble: "Show me the latest discounts on premium headphones",
  },
  {
    id: "video",
    title: "Video is the New Storefront",
    body: "Consumers connect emotionally through stories, not words or static images",
    illustration: "video" as const, // camera in phone frame + LIVE badge
  },
]

// Idea Starters: 3 sections — Customer Experience (5), Employee Productivity (5), Data Accelerator (3)
const ideaTabs = [
  { id: "customer", label: "Customer Experience", count: 5 },
  { id: "employee", label: "Employee Productivity", count: 5 },
  { id: "data", label: "Data Accelerator", count: 3 },
] as const

const ideaAgents = {
  customer: [
    { Icon: FileCheck, title: "Claims Assistant", desc: "AI-powered claims processing that analyzes damage photos, estimates repair costs, and generates detailed reports instantly.", tag: "Customer", href: "https://agents.tngrm.ai/agents/agent_006", external: true },
    { Icon: MessageSquare, title: "Insurance Chatbot", desc: "24/7 conversational AI that answers policy questions, provides quotes, and guides customers through claims filing.", tag: "Customer", href: "https://agents.tngrm.ai/agents/agent_043", external: true },
    { Icon: Calculator, title: "Quote Generator", desc: "Intelligent quote engine that provides personalized insurance recommendations based on customer needs and risk profile.", tag: "Customer", href: "https://agents.tngrm.ai/agents/agent_005", external: true },
    { Icon: HelpCircle, title: "Policy Advisor", desc: "Natural language assistant that explains coverage options, helps customers understand their policies, and suggests upgrades.", tag: "Customer", href: "https://agents.tngrm.ai/agents/agent_004", external: true },
    { Icon: ShieldCheck, title: "Coverage Analyzer", desc: "Smart tool that reviews existing policies and identifies gaps in coverage with personalized recommendations.", tag: "Customer", href: "https://agents.tngrm.ai/agents/agent_008", external: true },
  ],
  employee: [
    { Icon: UserCog, title: "Underwriting Co-Pilot", desc: "AI assistant that analyzes risk factors, reviews applications, and provides underwriting recommendations to agents.", tag: "Employee", href: "https://agents.tngrm.ai/agents/agent_001", external: true },
    { Icon: FileBarChart, title: "Claims Analyst", desc: "Automated claims analysis that processes documents, identifies fraud patterns, and prioritizes claims for review.", tag: "Employee", href: "https://agents.tngrm.ai/agents/agent_154", external: true },
    { Icon: AlertTriangle, title: "Risk Assessment Engine", desc: "Advanced risk modeling that evaluates customer profiles and predicts claim likelihood with detailed analytics.", tag: "Employee", href: "https://tngrm.ai/agents/agent_029", external: true },
    { Icon: ClipboardList, title: "Policy Management System", desc: "Intelligent policy administration that automates renewals, updates, and compliance tracking across portfolios.", tag: "Employee", href: "https://agents.tngrm.ai/agents/agent_017", external: true },
    { Icon: Search, title: "Fraud Detection AI", desc: "Real-time fraud detection that analyzes patterns, flags suspicious claims, and helps prevent insurance fraud.", tag: "Employee", href: "https://tngrm.ai/agents/agent_016", external: true },
  ],
  data: [
    { Icon: Database, title: "Insurance Data Hub", desc: "Unified data platform that ingests claims, policies, and customer data for comprehensive analytics and insights.", tag: "Data", href: "https://agents.tngrm.ai/agents/agent_017", iconColor: "#EA580C", external: true },
    { Icon: BarChart2, title: "Predictive Analytics", desc: "Advanced analytics that forecast trends, predict claim volumes, and optimize pricing strategies using ML models.", tag: "Data", href: "https://tngrm.ai/agents/agent_016", iconColor: "#EA580C", external: true },
    { Icon: TrendingUp, title: "Performance Dashboard", desc: "Real-time dashboards that track KPIs, monitor agent performance, and provide actionable business intelligence.", tag: "Data", href: "https://tngrm.ai/agents/agent_012", iconColor: "#EA580C", external: true },
  ],
}

function renderTag(cap: { icon: "circle" | "triangle" | "square"; color: string; text: string }, key: string) {
  return (
    <div
      key={key}
      className="flex items-center whitespace-nowrap shrink-0"
      style={{
        height: "32px",
        paddingTop: "5.5px",
        paddingRight: "9px",
        paddingBottom: "6.5px",
        paddingLeft: "9px",
        gap: "5px",
        borderRadius: "999px",
        borderWidth: "0.5px",
        borderStyle: "solid",
        borderColor: "#DEE2E6",
        backgroundColor: "#FFFFFF",
      }}
    >
      {cap.icon === "circle" && <div className="shrink-0 rounded-full" style={{ backgroundColor: cap.color, width: "12px", height: "12px" }} />}
      {cap.icon === "triangle" && <div className="shrink-0" style={{ backgroundColor: cap.color, width: "12px", height: "12px", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />}
      {cap.icon === "square" && <div className="shrink-0 rounded" style={{ backgroundColor: cap.color, width: "12px", height: "12px" }} />}
      <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "20px", color: "#344054" }}>{cap.text}</span>
    </div>
  )
}

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState(megaTabs[0].id)
  const [ideaTab, setIdeaTab] = useState<"customer" | "employee" | "data">("customer")
  const [selectedStage, setSelectedStage] = useState<number>(1)
  const [selectedUseCase, setSelectedUseCase] = useState<string>("Predictive Demand Sensing Engine")
  const [selectedPhase, setSelectedPhase] = useState<number>(1)
  const pageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = document.querySelector(".insurance-border-gradient") as HTMLElement
    if (!element) return
    let angle = 0
    const rotate = () => {
      angle = (angle + 1) % 360
      element.style.setProperty("--gradient-angle", `${angle}deg`)
      requestAnimationFrame(rotate)
    }
    rotate()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              if (e.target.classList.contains("fade-in-section")) e.target.classList.add("fade-in-visible")
              if (e.target.classList.contains("fade-in-blur")) e.target.classList.add("fade-in-blur-visible")
              if (e.target.classList.contains("scale-in")) e.target.classList.add("scale-in-visible")
              if (e.target.classList.contains("stagger-item")) e.target.classList.add("stagger-visible")
              observer.unobserve(e.target)
            }
          })
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )
    const els = document.querySelectorAll(".fade-in-section, .fade-in-blur, .scale-in, .stagger-item")
    els.forEach((el) => observer.observe(el))
    return () => { els.forEach((el) => observer.unobserve(el)); observer.disconnect() }
  }, [])

  const duplicatedCaps = [...capabilities, ...capabilities, ...capabilities]
  const duplicatedAgents = [...agentNames, ...agentNames, ...agentNames, ...agentNames]

  return (
    <div ref={pageContainerRef} className="flex flex-col" style={{ transform: "translateZ(0)", willChange: "scroll-position", scrollBehavior: "smooth" }}>
      {/* Hero — same layout/styling as Bank's Partnership section */}
      <section
        id="hero"
        className="relative overflow-hidden min-h-[90vh] py-16 md:py-20 lg:py-24 flex items-center w-full fade-in-section"
        style={{
          backgroundImage: "url('/img/indexbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          contain: "layout style paint",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative text-center" style={{ zIndex: 1, pointerEvents: "none" }}>
          <div className="text-center" style={{ pointerEvents: "auto" }}>
            <div className="mt-0 flex justify-center scale-in" style={{ marginBottom: "18px", willChange: "transform" }}>
              <div
                className="inline-flex items-center gap-2 border bg-white"
                style={{
                  paddingTop: "6px",
                  paddingRight: "16px",
                  paddingBottom: "6px",
                  paddingLeft: "16px",
                  borderRadius: "10px",
                  borderColor: "#E5E7EB",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div className="relative h-4 w-4">
                  <Image src="/chat_icon.png" alt="bot" fill className="object-contain" style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }} />
                </div>
                <span className="whitespace-nowrap" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "18px", letterSpacing: "0%", verticalAlign: "middle", color: "#111827" }}>
                  From Pilot to Platform
                </span>
              </div>
            </div>
            <div className="mb-0 text-balance mx-auto block">
              <h1 className="fade-in-blur" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "52px", lineHeight: "48px", letterSpacing: "0%", textAlign: "center", color: "#091917", margin: "0 auto", marginBottom: "14px", willChange: "opacity, transform, filter" }}>
                Insurance & AI
              </h1>
              <div className="fade-in-section" style={{ fontFamily: "Poppins, sans-serif", fontSize: "28px", lineHeight: "1.4", textAlign: "center", color: "#091917", margin: "14px auto 64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0", willChange: "opacity, transform" }}>
                <p style={{ margin: 0, lineHeight: "1.4", color: "#091917" }}>Simplifying AI Success for Insurance.</p>
                <p style={{ margin: 0, lineHeight: "1.4", color: "#091917" }}>From pilot to platform — with proven agentic solutions designed for modern insurance operations.</p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl overflow-hidden fade-in-section" style={{ marginBottom: "64px", willChange: "opacity, transform" }}>
              <div className="flex flex-col gap-3">
                <div className="overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: "100px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }} />
                  <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: "100px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }} />
                  <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "300s" }}>{duplicatedCaps.map((c, i) => renderTag(c, `r1-${i}`))}</div>
                </div>
                <div className="overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: "100px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }} />
                  <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none" style={{ width: "100px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }} />
                  <div className="flex gap-3 animate-scroll-tags-reverse" style={{ width: "fit-content", animationDuration: "300s" }}>{duplicatedAgents.map((c, i) => renderTag(c, `r2-${i}`))}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center scale-in">
              <Link
                href="/agents"
                className="insurance-border-gradient border-gradient relative text-white rounded-[4px] px-[28px] transition-transform duration-300 hover:scale-105"
                style={{ display: "flex", height: "48px", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "normal", letterSpacing: "0.5px", textTransform: "uppercase", position: "relative", padding: "20px 28px", boxShadow: "0 0 20px rgba(255,109,27,0.3), 0 0 40px rgba(75,138,255,0.2), 0 0 60px rgba(107,95,255,0.1)", "--gradient-angle": "0deg", willChange: "transform" } as React.CSSProperties & { "--gradient-angle"?: string }}
              >
                <span style={{ position: "relative", zIndex: 10, color: "#FFF", textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontStyle: "normal", fontWeight: 500, lineHeight: "normal", letterSpacing: "0.5px", textTransform: "uppercase" }}>Explore All 100+ Agents</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Mega Trends — 3 cards with illustrations matching v0 Crayon site */}
      <section id="mega-trends" className="fade-in-section py-16 md:py-20 lg:py-24 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 max-w-6xl mx-auto">
          <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "Poppins, sans-serif", color: "#2563eb" }}>AI Mega Trends</p>
          <h2 className="mb-8 text-center text-xl md:text-2xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>What Could an AI-First Insurance Company Look Like in 3 Years?</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {megaTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                style={{
                  borderColor: activeTab === t.id ? "#111827" : "transparent",
                  color: activeTab === t.id ? "#111827" : "#6B7280",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Customer Experience (cx): 3 cards */}
          {activeTab === "cx" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="flex justify-center mb-4 shrink-0">
                  <div className="flex flex-col items-center py-3 px-5 rounded-xl w-full" style={{ backgroundColor: "#F0F9FF", minHeight: "160px" }}>
                    {/* Mic + concentric ripples: white mic in solid blue circle, 3 lighter rings */}
                    <div className="relative flex items-center justify-center mb-3" style={{ width: "88px", height: "88px" }}>
                      <div className="absolute rounded-full border-2" style={{ width: "88px", height: "88px", borderColor: "#E0F2FE" }} />
                      <div className="absolute rounded-full border-2" style={{ width: "72px", height: "72px", borderColor: "#BAE6FD" }} />
                      <div className="absolute rounded-full border-2" style={{ width: "56px", height: "56px", borderColor: "#7DD3FC" }} />
                      <div className="absolute rounded-full flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "#2563eb" }}>
                        <Mic className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    {/* Sound wave: ~17 bars, light blue, rounded tops, taller in middle */}
                    <div className="flex items-end justify-center gap-0.5" style={{ height: "24px" }}>
                      {[2, 3, 4, 5, 7, 9, 11, 13, 11, 9, 7, 5, 4, 3, 2].map((h, i) => (
                        <div key={i} className="rounded-t" style={{ width: "3px", height: `${h * 2}px`, backgroundColor: "#7DD3FC", minHeight: "4px" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0">{megaTrendCards[0].title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">{megaTrendCards[0].body}</p>
              </div>
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="mb-4 shrink-0">
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-[#E5E7EB] flex flex-col" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", minHeight: "160px" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#86efac" }}>
                        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#111827" }}>AI Assistant</span>
                    </div>
                    <div className="rounded-xl px-3 py-2.5 mb-2 text-left" style={{ backgroundColor: "#E9EBEE", color: "#374151", fontSize: "11px" }}>Show me the latest discounts on premium headphones</div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (<div key={i} className="h-8 flex-1 rounded-lg" style={{ backgroundColor: "#F0F3F7", minWidth: "48px" }} />))}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth">{megaTrendCards[1].title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">{megaTrendCards[1].body}</p>
              </div>
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="flex justify-center mb-4 shrink-0">
                  <div className="relative rounded-2xl flex items-center justify-center border overflow-hidden" style={{ width: "84px", minHeight: "160px", background: "linear-gradient(180deg, #E0F2FE 0%, #A7F3D0 100%)", borderColor: "#D1D5DB" }}>
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Video className="w-6 h-6 text-[#111827]" strokeWidth={2} />
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5" style={{ backgroundColor: "#DC2626" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[9px] font-bold text-white tracking-wide">LIVE</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth">{megaTrendCards[2].title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">{megaTrendCards[2].body}</p>
              </div>
            </div>
          )}

          {/* Employee Experience (ex): same card style as 01 Customer Experience — uniform tile height and width */}
          {activeTab === "ex" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* CxO Concierge — white card: dark green icon with white person, dark grey title, grey subtitle, two vertical suggestion chips */}
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="mb-4 shrink-0">
                  <div className="rounded-xl p-4 bg-white border border-[#E5E7EB] flex flex-col" style={{ minHeight: "160px" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#065F46" }}>
                        <UserCircle className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-sm font-bold" style={{ color: "#374151" }}>CxO Concierge</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: "#6B7280" }}>Ask anything about your business.</p>
                    <div className="flex flex-col gap-2">
                      <div className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>Revenue forecast Q4?</div>
                      <div className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium" style={{ backgroundColor: "#D1FAE5", color: "#047857" }}>Customer churn analysis</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0">Every CxO Will Have Their Own Personal Concierge.</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">Enable all CxOs with personal concierges to query the data directly on all aspects of their business, including predictive and scenario based answers.</p>
              </div>
              {/* Every Employee Will Have a Digital Co-Worker — You (grey circle+oval) | equals (3 lines) | AI (blue circle+oval) on light blue gradient */}
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="flex justify-center mb-4 shrink-0">
                  <div className="rounded-xl p-5 flex items-center justify-center gap-5 w-full" style={{ background: "linear-gradient(90deg, #BAE6FD 0%, #E0F2FE 100%)", minHeight: "160px" }}>
                    {/* You: grey circle with Users + white oval label below */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E5E7EB" }}>
                        <Users className="w-6 h-6" style={{ color: "#374151" }} strokeWidth={2} />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border" style={{ borderColor: "#D1D5DB", color: "#374151" }}>You</span>
                    </div>
                    {/* Equals: three horizontal lines stacked */}
                    <div className="flex flex-col justify-center gap-1">
                      <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: "#374151" }} />
                      <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: "#374151" }} />
                      <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: "#374151" }} />
                    </div>
                    {/* AI: blue circle with white Sparkles + darker blue oval label below */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: "#2563eb" }}>
                        <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-white" style={{ backgroundColor: "#1d4ed8" }}>AI</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0">Every Employee Will Have a Digital Co-Worker.</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">Enable all employees with automation co-pilots to help them work smarter, faster, and more creatively — boosting productivity while keeping the insurance company&apos;s human touch intact.</p>
              </div>
            </div>
          )}

          {/* Data Experience (dx): same 3 cards as Customer for now */}
          {activeTab === "dx" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Unified Intelligence Across Data Sets — central sparkle in white circle with blue→green gradient ring; 3 DBs: top blue, bottom-left green, bottom-right orange; peach background */}
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 shadow-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="flex justify-center mb-4 shrink-0">
                  <div className="relative flex items-center justify-center rounded-xl py-5 px-4 w-full" style={{ minHeight: "160px", backgroundColor: "#FFF5F5" }}>
                    {/* Top: light blue rounded-square DB */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-11 h-11 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: "#DBEAFE", borderColor: "#2563eb" }}>
                      <Database className="w-5 h-5" style={{ color: "#2563eb" }} strokeWidth={2} />
                    </div>
                    {/* Center: white fill + thick blue→green gradient ring + blue Sparkles */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(white, white) padding-box, linear-gradient(180deg, #2563eb 0%, #22c55e 100%) border-box", border: "5px solid transparent" }}
                    >
                      <Sparkles className="w-7 h-7" style={{ color: "#2563eb" }} strokeWidth={2} />
                    </div>
                    {/* Bottom-left: light green rounded-square DB */}
                    <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: "#D1FAE5", borderColor: "#059669" }}>
                      <Database className="w-5 h-5" style={{ color: "#059669" }} strokeWidth={2} />
                    </div>
                    {/* Bottom-right: light orange rounded-square DB */}
                    <div className="absolute bottom-3 right-4 w-10 h-10 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: "#FFEDD5", borderColor: "#EA580C" }}>
                      <Database className="w-5 h-5" style={{ color: "#EA580C" }} strokeWidth={2} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <Database className="w-4 h-4 shrink-0" style={{ color: "#EA580C" }} strokeWidth={2} />
                  <h3 className="text-base font-bold text-[#111827]">Unified Intelligence Across Data Sets</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">Every enterprise will (try to) create a unified intelligence across data sets — breaking silos and enabling holistic insights.</p>
              </div>
              {/* From Dashboards to Co-pilots — Dashboard (grey icon+label) | arrow (dash+chevron in blue) | Co-pilot (blue card: sparkle+2 lines, label below) */}
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 shadow-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="flex justify-center items-end gap-4 mb-4 shrink-0" style={{ minHeight: "160px" }}>
                  {/* Dashboard: grey rounded rect with BarChart2, "Dashboard" in light grey below */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
                      <BarChart2 className="w-7 h-7" style={{ color: "#9CA3AF" }} strokeWidth={2} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Dashboard</span>
                  </div>
                  {/* Arrow: horizontal dash with chevron beneath, medium blue */}
                  <div className="flex flex-col items-center gap-0.5 pb-1">
                    <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                    <ChevronRight className="w-5 h-5" style={{ color: "#3b82f6" }} strokeWidth={2} />
                  </div>
                  {/* Co-pilot: light blue card, darker blue border, Sparkles + 2 lines; "Co-pilot" in dark blue below */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-lg border-2 flex flex-col items-center justify-center p-3" style={{ width: "88px", height: "72px", borderColor: "#2563eb", backgroundColor: "#E0F2FE" }}>
                      <Sparkles className="w-5 h-5 mb-1.5" style={{ color: "#2563eb" }} strokeWidth={2} />
                      <div className="w-full h-0.5 rounded" style={{ backgroundColor: "#2563eb" }} />
                      <div className="w-[80%] h-0.5 rounded mt-1" style={{ backgroundColor: "#2563eb" }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "#2563eb" }}>Co-pilot</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-2 shrink-0">
                  <BarChart2 className="w-4 h-4 shrink-0" style={{ color: "#EA580C" }} strokeWidth={2} />
                  <h3 className="text-base font-bold text-[#111827]">From Dashboards to Co-pilots</h3>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0">Every enterprise will move from dashboards to co-pilots — from passive reporting to active intelligence that guides decisions.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Value Chain Stage Intro & Use Cases */}
      <section id="value-chain" className="fade-in-section py-16 md:py-20 lg:py-24 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "Poppins, sans-serif", color: "#2563eb" }}>
            Value-Chain-Led Use-Case Map
          </p>
          <h2 className="mb-4 text-balance" style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "44.8px", letterSpacing: "-1.28px", color: "#111827" }}>
            Transforming Insurance Operations, Stage by Stage
          </h2>
          <p className="mb-12 max-w-4xl mx-auto text-center" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
            The transformation from a digital-first insurer to an AI-native enterprise requires a granular deconstruction of the value chain. This section maps the "Sense, Onboard, Decide, Execute, Support, Measure" lifecycle against specific operational friction points, embedding intelligence at critical nodes to create a defensible competitive advantage.
          </p>

          {/* Workflow Diagram - Single Horizontal Line with Sequential Flow */}
          <div className="mb-12 w-full overflow-hidden">
            <div className="flex items-center justify-center gap-2 md:gap-3 pb-4" style={{ fontFamily: "Poppins, sans-serif", width: "100%" }}>
              {/* Stage 1 - Sense & Originate */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(1); setSelectedUseCase("Predictive Demand Sensing Engine"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 1 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 1 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 1 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>1</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Sense & Originate</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Market Intelligence & Product Design)</div>
                </div>
              </div>

              {/* Arrow 1 → 2 */}
              <div className="flex-shrink-0 flex items-center" style={{ width: "16px", flexShrink: 0 }}>
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#9CA3AF" }} strokeWidth={2} />
              </div>

              {/* Stage 2 - Onboard & Acquire */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(2); setSelectedUseCase("Propensity-to-Buy & LTV Lead Scoring"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 2 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 2 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 2 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>2</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Onboard & Acquire</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Marketing & Distribution)</div>
                </div>
              </div>

              {/* Arrow 2 → 3 */}
              <div className="flex-shrink-0 flex items-center" style={{ width: "16px", flexShrink: 0 }}>
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#9CA3AF" }} strokeWidth={2} />
              </div>

              {/* Stage 3 - Assess & Decide */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(3); setSelectedUseCase("Dynamic Telematics Pricing Engine (Motor)"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 3 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 3 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 3 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>3</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Assess & Decide</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Underwriting & Risk)</div>
                </div>
              </div>

              {/* Arrow 3 → 4 */}
              <div className="flex-shrink-0 flex items-center" style={{ width: "16px", flexShrink: 0 }}>
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#9CA3AF" }} strokeWidth={2} />
              </div>

              {/* Stage 4 - Execute & Deliver */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(4); setSelectedUseCase("Smart Payment Routing & Recovery"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 4 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 4 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 4 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>4</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Execute & Deliver</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Policy Management)</div>
                </div>
              </div>

              {/* Arrow 4 → 5 */}
              <div className="flex-shrink-0 flex items-center" style={{ width: "16px", flexShrink: 0 }}>
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#9CA3AF" }} strokeWidth={2} />
              </div>

              {/* Stage 5 - Support & Recover */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(5); setSelectedUseCase("Computer Vision Damage Estimation (Motor)"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 5 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 5 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 5 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>5</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Support & Recover</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Claims & Service)</div>
                </div>
              </div>

              {/* Arrow 5 → 6 */}
              <div className="flex-shrink-0 flex items-center" style={{ width: "16px", flexShrink: 0 }}>
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#9CA3AF" }} strokeWidth={2} />
              </div>

              {/* Stage 6 - Measure, Report & Govern */}
              <div className="relative cursor-pointer" style={{ flex: "1 1 0", minWidth: "0", maxWidth: "170px" }} onClick={() => { setSelectedStage(6); setSelectedUseCase("Automated Regulatory Reporting"); }}>
                <div
                  className="h-40 flex flex-col justify-center items-center p-4 md:p-6 relative transition-all duration-200 hover:scale-105 rounded-xl"
                  style={{
                    backgroundColor: selectedStage === 6 ? "#F9FAFB" : "#FFFFFF",
                    border: selectedStage === 6 ? "2px solid #111827" : "1px solid #E5E7EB",
                    boxShadow: selectedStage === 6 ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2" style={{ lineHeight: "1", color: "#111827" }}>6</div>
                  <div className="text-sm md:text-base font-bold text-center mb-1 leading-tight" style={{ color: "#111827" }}>Measure, Report & Govern</div>
                  <div className="text-[10px] md:text-xs text-center leading-tight" style={{ color: "#6B7280" }}>(Analytics & Insights)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptive Paragraph Below Workflow - Dynamic based on selected stage */}
          {selectedStage === 1 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 1: Sense & Originate (Market Intelligence & Product Design)</strong><br />
              Current product development cycles are largely reactive, driven by lagging indicators such as quarterly reports or competitor moves. While innovation has been achieved, sustaining velocity requires moving from intuition-based ideation to data-driven prediction. Manual market research results in slow identification of emerging risk pools and generic product definitions that fail to capitalize on micro-segmentation opportunities.
            </p>
          )}
          {selectedStage === 2 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 2: Onboard & Acquire</strong><br />
              Rising CAC ($200-$900 per policy) and quote abandonment challenge growth. Static lead routing treats high-LTV prospects the same as low-value leads. KYC verification bottlenecks slow onboarding.
            </p>
          )}
          {selectedStage === 3 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 3: Assess & Decide</strong><br />
              Core profitability engine. Static proxies (age, gender, car make) cause adverse selection—safe drivers overpriced, risky drivers underpriced. Non-standard risks require manual review, destroying instant value.
            </p>
          )}
          {selectedStage === 4 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 4: Execute & Deliver</strong><br />
              Policy issuance is automated, but payment failures and contract confusion persist. Customers discover coverage gaps only at claim time. Rigid payment schedules don't match customer liquidity.
            </p>
          )}
          {selectedStage === 5 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 5: Support & Recover</strong><br />
              Claims are the moment of truth (70-85% of premiums). Manual FNOL intake, subjective damage assessment, and delayed fraud detection drive high OpEx. Routine queries consume agent time.
            </p>
          )}
          {selectedStage === 6 && (
            <p className="text-center max-w-4xl mx-auto mb-8" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
              <strong style={{ color: "#111827" }}>Stage 6: Measure, Report & Govern</strong><br />
              Regulatory reporting is manual and retrospective, prone to data quality issues. AI model drift threatens performance and requires continuous monitoring for fair treatment and solvency.
            </p>
          )}

          {/* Interactive Tags/Buttons - Dynamic Use Cases based on selected stage */}
          {selectedStage === 1 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Predictive Demand Sensing Engine", label: "Predictive Demand Sensing Engine" },
                { id: "Competitor Pricing & Product Monitor", label: "Competitor Pricing & Product Monitor" },
                { id: "Persona & Micro-Segmentation Generator", label: "Persona & Micro-Segmentation Generator" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage === 2 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Propensity-to-Buy & LTV Lead Scoring", label: "Propensity-to-Buy & LTV Lead Scoring" },
                { id: "Conversational Sales Concierge (GenAI)", label: "Conversational Sales Concierge (GenAI)" },
                { id: "Intelligent Document Processing (IDP) for KYC", label: "Intelligent Document Processing (IDP) for KYC" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage === 3 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Dynamic Telematics Pricing Engine (Motor)", label: "Dynamic Telematics Pricing Engine (Motor)" },
                { id: "Algorithmic SME Risk Scoring", label: "Algorithmic SME Risk Scoring" },
                { id: "Visual Risk Assessment (Pet / Motor)", label: "Visual Risk Assessment (Pet / Motor)" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage === 4 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Smart Payment Routing & Recovery", label: "Smart Payment Routing & Recovery" },
                { id: "Hyper-Personalized Policy Explainers", label: "Hyper-Personalized Policy Explainers" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage === 5 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Computer Vision Damage Estimation (Motor)", label: "Computer Vision Damage Estimation (Motor)" },
                { id: "Network-Based Fraud Detection", label: "Network-Based Fraud Detection" },
                { id: "Proactive Claims Copilot", label: "Proactive Claims Copilot" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage === 6 && (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {[
                { id: "Automated Regulatory Reporting", label: "Automated Regulatory Reporting" },
                { id: "MLOps & Governance Dashboard", label: "MLOps & Governance Dashboard" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setSelectedUseCase(id)}
                  className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                  style={{
                    borderColor: selectedUseCase === id ? "#111827" : "transparent",
                    color: selectedUseCase === id ? "#111827" : "#6B7280",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {selectedStage !== 1 && selectedStage !== 2 && selectedStage !== 3 && selectedStage !== 4 && selectedStage !== 5 && selectedStage !== 6 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Use cases for this stage will be added here.
              </p>
            </div>
          )}

          {/* Use Case Details Section - Show for Stage 1, Stage 2, Stage 3, Stage 4, Stage 5, and Stage 6 */}
          {(selectedStage === 1 || selectedStage === 2 || selectedStage === 3 || selectedStage === 4 || selectedStage === 5 || selectedStage === 6) && (
            <div className="mt-12 min-h-[400px]">
              <div className="max-w-5xl mx-auto">
                {selectedUseCase === "Predictive Demand Sensing Engine" && (
                  <div key="predictive-demand">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Predictive Demand Sensing Engine
                      </h3>
                      <div className="space-y-6">
                              {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Identify emerging insurance needs (e.g., micro-mobility, freelance liability) 3-6 months before market saturation.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Product Managers
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Strategy Team
                            </span>
                          </div>
                        </div>

                        {/* NLP / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              NLP
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Predictive Analytics
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Time-Series Analysis
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Social sentiment</li>
                            <li>Search trends</li>
                            <li>Regulatory drafts (IA)</li>
                            <li>Vehicle registration data</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Trend reports</li>
                            <li>New product concepts</li>
                            <li>Demand volume forecasts</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUseCase === "Competitor Pricing & Product Monitor" && (
                  <div key="competitor-pricing">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Competitor Pricing & Product Monitor
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Real-time monitoring of competitor pricing structures, coverage changes, and marketing messaging across the KSA market.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Actuaries
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Marketing
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Product Teams
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Web Scraping
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              NLP
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Regression Analysis
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Competitor websites</li>
                            <li>Aggregator data</li>
                            <li>Social media ads</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Real-time pricing alerts</li>
                            <li>Competitive positioning heatmaps</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedUseCase === "Persona & Micro-Segmentation Generator" && (
                  <div key="persona-segmentation">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Persona & Micro-Segmentation Generator
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Dynamically cluster the customer base to create hyper-personalized product variants (e.g., "Weekend Off-Roaders") rather than broad demographics.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Marketing
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Product Design
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Unsupervised ML
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Clustering (K-Means)
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Tawuniya historical claims</li>
                            <li>Geospatial usage data</li>
                            <li>Lifestyle app integration</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Detailed persona profiles</li>
                            <li>Tailored coverage packages</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 2 Use Cases */}
                {selectedStage === 2 && selectedUseCase === "Propensity-to-Buy & LTV Lead Scoring" && (
                  <div key="propensity-ltv">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Propensity-to-Buy & LTV Lead Scoring
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Optimize marketing spend by bidding higher only for leads with high predicted LTV and low churn probability.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Digital Marketing
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Sales
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Supervised Learning
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              XGBoost/LightGBM
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Web behavior logs</li>
                            <li>Device metadata</li>
                            <li>Third-party enrichment data</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 2 && selectedUseCase === "Conversational Sales Concierge (GenAI)" && (
                  <div key="sales-concierge">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Conversational Sales Concierge (GenAI)
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Reduce quote abandonment by guiding users through complex coverage selections (e.g., SME Health) via natural language.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Potential Customers
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Generative AI (LLM - RAG)
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Chat logs</li>
                            <li>Policy wordings</li>
                            <li>FAQ databases</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 2 && selectedUseCase === "Intelligent Document Processing (IDP) for KYC" && (
                  <div key="idp-kyc">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Intelligent Document Processing (IDP) for KYC
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Instant extraction and verification of Saudi National ID, Istimara, and Commercial Registration documents.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Onboarding Operations
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Computer Vision
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              OCR
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              NLP
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Document images (uploaded)</li>
                            <li>Ministry of Commerce/Interior APIs</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 3 Use Cases */}
                {selectedStage === 3 && selectedUseCase === "Dynamic Telematics Pricing Engine (Motor)" && (
                  <div key="telematics-pricing">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Dynamic Telematics Pricing Engine (Motor)
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Price motor policies based on real driving behavior (braking, speed, time of day) instead of static proxies.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Underwriters
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Actuaries
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Deep Learning (RNN/LSTM)
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              IoT Analytics
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Telematics streams (Mobile App / OBD)</li>
                            <li>Najm accident records</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Safety Score</li>
                            <li>Dynamic Premium Multiplier</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Augmented / Autonomous – monthly renewal pricing is automated
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Shifts pricing from annual static tables to dynamic, behavior-based adjustments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 3 && selectedUseCase === "Algorithmic SME Risk Scoring" && (
                  <div key="sme-risk-scoring">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Algorithmic SME Risk Scoring
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Enable "instant bind" for SME policies through automated financial and operational risk assessment using alternative data.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              SME Underwriters
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Graph Analytics
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              NLP
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Commercial registries</li>
                            <li>Social reviews</li>
                            <li>Credit bureau data</li>
                            <li>Bank transaction APIs</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Risk Grade</li>
                            <li>Recommended Credit Limit / Premium</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Augmented – system recommends decision; human approval required for large limits
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            SME underwriting time reduced from days to minutes for standard business codes
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 3 && selectedUseCase === "Visual Risk Assessment (Pet / Motor)" && (
                  <div key="visual-risk-assessment">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Visual Risk Assessment (Pet / Motor)
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Remotely verify asset condition and detect pre-existing damage to prevent fraud at policy inception.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Underwriters
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Computer Vision
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>User-uploaded images/videos of car or pet</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Condition Report</li>
                            <li>Pre-existing Damage Flags</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Autonomous – AI validates "clean" assets and flags damaged ones for review
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Eliminates physical pre-inspection surveyors for ~90% of policies
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 4 Use Cases */}
                {selectedStage === 4 && selectedUseCase === "Smart Payment Routing & Recovery" && (
                  <div key="payment-routing">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Smart Payment Routing & Recovery
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Minimize policy lapses by predicting optimal retry timing and payment method after failures.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Billing Operations
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Predictive Analytics
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Transaction history</li>
                            <li>Geidea gateway codes</li>
                            <li>Payroll calendar data</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Retry Schedule</li>
                            <li>Payment Method Selection</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Autonomous – system manages dunning logic
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Moves collections from static rules to behavior-based dynamic scheduling
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 4 && selectedUseCase === "Hyper-Personalized Policy Explainers" && (
                  <div key="policy-explainers">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Hyper-Personalized Policy Explainers
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Reduce expectation gaps by generating plain-language (Arabic) explanations tailored to each customer.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Customers
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Generative AI (Text-to-Video / Text)
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Policy schedule</li>
                            <li>Customer profile data</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Personalized explainer video / PDF</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Autonomous – generated automatically at policy binding
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Policy delivery includes personalized videos explaining coverage, increasing transparency
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 5 Use Cases */}
                {selectedStage === 5 && selectedUseCase === "Computer Vision Damage Estimation (Motor)" && (
                  <div key="damage-estimation">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Computer Vision Damage Estimation (Motor)
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Instantly estimate repair costs from accident photos to enable rapid settlements.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Claims Adjusters
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Customers
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Computer Vision (CNN)
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Accident photos</li>
                            <li>Spare parts databases</li>
                            <li>Labor rates</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Damage Severity</li>
                            <li>Repair Cost Estimate</li>
                            <li>Total Loss Flag</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Augmented – AI estimates; human approval or auto-settlement under SAR 3k
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Settlement offers in minutes; adjusters focus on complex cases
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 5 && selectedUseCase === "Network-Based Fraud Detection" && (
                  <div key="fraud-detection">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Network-Based Fraud Detection
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Detect organized fraud rings and suspicious behavior before claim payout.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Fraud Investigators (SIU)
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Graph Neural Networks
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Anomaly Detection
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Claims history</li>
                            <li>Najm data</li>
                            <li>Device fingerprinting</li>
                            <li>Social links</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Fraud Probability Score</li>
                            <li>Investigation Case Pack</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Augmented – AI flags cases, investigators validate
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Shifts fraud detection from post-payment to pre-payment
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 5 && selectedUseCase === "Proactive Claims Copilot" && (
                  <div key="claims-copilot">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Proactive Claims Copilot
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Reduce inbound calls by proactively sharing claim updates.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Customer Service
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              NLP
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              RPA
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Claims workflow status</li>
                            <li>CRM data</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>WhatsApp/App notifications with claim explanations</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Autonomous – triggered by workflow events
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Reduces "Where is my claim?" calls by ~70%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stage 6 Use Cases */}
                {selectedStage === 6 && selectedUseCase === "Automated Regulatory Reporting" && (
                  <div key="regulatory-reporting">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        Automated Regulatory Reporting
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Enable real-time compliance with automated regulatory report generation.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Compliance
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Risk Teams
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              RPA
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Natural Language Generation (NLG)
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Operational databases</li>
                            <li>Regulatory taxonomies</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Draft regulatory reports</li>
                            <li>Compliance dashboards</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Automated – drafts generated for review
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Compliance moves from monthly reporting to continuous monitoring
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStage === 6 && selectedUseCase === "MLOps & Governance Dashboard" && (
                  <div key="mlops-governance">
                    <div className="bg-white rounded-2xl border border-[#E4E4E7] p-8 md:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}>
                      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Poppins, sans-serif", color: "#111827" }}>
                        MLOps & Governance Dashboard
                      </h3>
                      <div className="space-y-6">
                        {/* Objective */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Objective
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Monitor AI model performance, bias, and drift to ensure ethical and accurate decisions.
                          </p>
                        </div>

                        {/* Users */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Users
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Data Scientists
                            </span>
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                              Risk Officers
                            </span>
                          </div>
                        </div>

                        {/* AI Type / Technologies */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            AI Type
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>
                              Statistical Monitoring
                            </span>
                          </div>
                        </div>

                        {/* Data Inputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Data Inputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Model inference logs</li>
                            <li>Ground truth data</li>
                          </ul>
                        </div>

                        {/* Outputs */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Outputs
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-base" style={{ color: "#374151" }}>
                            <li>Model health alerts</li>
                            <li>Retraining triggers</li>
                            <li>Bias reports</li>
                          </ul>
                        </div>

                        {/* Autonomy Level */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Autonomy Level
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Automated – continuous monitoring
                          </p>
                        </div>

                        {/* Workflow Change */}
                        <div>
                          <h4 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>
                            Workflow Change
                          </h4>
                          <p className="text-base leading-relaxed" style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}>
                            Model maintenance becomes systematic with automated retraining pipelines
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 3b: Business & Technical Depth — Card Style */}
      <section id="business-technical-depth" className="fade-in-section py-16 md:py-20 lg:py-24 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 max-w-6xl mx-auto">
          <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "Poppins, sans-serif", color: "#2563eb" }}>
            Business & Technical Depth
          </p>
          <h2 className="mb-8 text-center text-xl md:text-2xl font-bold text-[#111827]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Use Case Deep Dive: Business Logic & Technical Architecture
          </h2>
          <p className="mb-10 max-w-4xl mx-auto text-center" style={{ fontFamily: "Poppins", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
            Deep dive into high-priority use cases: business value drivers and technical architecture for Tree's environment.
          </p>

          {/* Use Case Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Computer Vision Claims Automation */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 card-hover stagger-item" style={{ fontFamily: "Poppins, sans-serif" }}>
              <div className="flex justify-center mb-4 shrink-0">
                <div className="flex flex-col items-center py-3 px-5 rounded-xl w-full" style={{ backgroundColor: "#F0F9FF", minHeight: "160px" }}>
                  {/* Camera icon with visual elements */}
                  <div className="relative flex items-center justify-center mb-3" style={{ width: "88px", height: "88px" }}>
                    <div className="absolute rounded-full border-2" style={{ width: "88px", height: "88px", borderColor: "#E0F2FE" }} />
                    <div className="absolute rounded-full border-2" style={{ width: "72px", height: "72px", borderColor: "#BAE6FD" }} />
                    <div className="absolute rounded-full border-2" style={{ width: "56px", height: "56px", borderColor: "#7DD3FC" }} />
                    <div className="absolute rounded-full flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "#2563eb" }}>
                      <Camera className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  {/* Grid pattern representing image analysis */}
                  <div className="flex items-center justify-center gap-1" style={{ height: "24px" }}>
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((w, i) => (
                      <div key={i} className="rounded" style={{ width: `${w * 3}px`, height: "12px", backgroundColor: "#7DD3FC", minWidth: "8px" }} />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth" style={{ fontFamily: "Poppins, sans-serif" }}>Computer Vision Claims Automation</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Business:</strong> 3-7 day process → &lt;15 minutes. 40-60% LAE reduction. Instant settlements boost NPS.
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Technical:</strong> High data readiness (Tawuniya's labeled images). Requires Najm API, Bytesforce integration, anti-spoofing.
              </p>
            </div>

            {/* Card 2: Dynamic Telematics Pricing */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 card-hover stagger-item" style={{ fontFamily: "Poppins, sans-serif" }}>
              <div className="flex justify-center mb-4 shrink-0">
                <div className="rounded-xl p-5 flex items-center justify-center w-full" style={{ background: "linear-gradient(90deg, #BAE6FD 0%, #E0F2FE 100%)", minHeight: "160px" }}>
                  {/* Speedometer/Gauge icon */}
                  <div className="relative flex items-center justify-center" style={{ width: "100px", height: "100px" }}>
                    <div className="absolute rounded-full border-4" style={{ width: "100px", height: "100px", borderColor: "#2563eb", borderTopColor: "transparent", borderRightColor: "transparent", transform: "rotate(-45deg)" }} />
                    <div className="absolute rounded-full flex items-center justify-center" style={{ width: "60px", height: "60px", backgroundColor: "#2563eb" }}>
                      <Gauge className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    {/* Needle indicator */}
                    <div className="absolute" style={{ width: "2px", height: "30px", backgroundColor: "#111827", transform: "rotate(45deg) translateY(-20px)", transformOrigin: "bottom center" }} />
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth" style={{ fontFamily: "Poppins, sans-serif" }}>Dynamic Telematics Pricing</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Business:</strong> Behavior-based pricing. Safe drivers save 20-30%. Daily app engagement attracts best risks.
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Technical:</strong> Medium data readiness. Requires Telematics SDK, Najm Connect, edge processing. High complexity.
              </p>
            </div>

            {/* Card 3: Generative AI Sales & Service Concierge */}
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 card-hover stagger-item" style={{ fontFamily: "Poppins, sans-serif" }}>
                <div className="mb-4 shrink-0">
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-[#E5E7EB] flex flex-col" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)", minHeight: "160px" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#86efac" }}>
                      <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: "#111827" }}>AI Concierge</span>
                  </div>
                  <div className="rounded-xl px-3 py-2.5 mb-2 text-left" style={{ backgroundColor: "#E9EBEE", color: "#374151", fontSize: "11px" }}>Is my cat covered for dental?</div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (<div key={i} className="h-8 flex-1 rounded-lg" style={{ backgroundColor: "#F0F3F7", minWidth: "48px" }} />))}
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth" style={{ fontFamily: "Poppins, sans-serif" }}>Generative AI Sales & Service</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Business:</strong> 10x volume, same staff. 24/7 Khaleeji Arabic support. Massive cost reduction, higher conversion.
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Technical:</strong> High data readiness (policy docs, FAQs). Requires LLM, Bytesforce AI Middle Office, Vector DB, guardrails.
              </p>
            </div>

            {/* Card 4: Network-Based Fraud Detection */}
            <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 md:p-6 flex flex-col min-h-[320px] h-full min-w-0 card-hover stagger-item" style={{ fontFamily: "Poppins, sans-serif" }}>
              <div className="flex justify-center mb-4 shrink-0">
                <div className="relative rounded-xl p-5 flex items-center justify-center w-full" style={{ backgroundColor: "#FEF2F2", minHeight: "160px" }}>
                  {/* Network/Graph visualization */}
                  <div className="relative" style={{ width: "120px", height: "120px" }}>
                    {/* Central node */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#DC2626", zIndex: 10 }}>
                      <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    {/* Connected nodes - pre-calculated positions to avoid hydration mismatch */}
                    {[
                      { angle: 0, x: 100, y: 60 },
                      { angle: 60, x: 80, y: 95 },
                      { angle: 120, x: 20, y: 95 },
                      { angle: 180, x: 20, y: 60 },
                      { angle: 240, x: 20, y: 25 },
                      { angle: 300, x: 80, y: 25 },
                    ].map((node, i) => (
                      <div key={i}>
                        <div className="absolute w-1" style={{ left: "50%", top: "50%", width: "40px", height: "2px", backgroundColor: "#FCA5A5", transform: `rotate(${node.angle}deg)`, transformOrigin: "left center", zIndex: 1 }} />
                        <div className="absolute w-4 h-4 rounded-full" style={{ left: `${node.x - 8}px`, top: `${node.y - 8}px`, backgroundColor: "#EF4444", zIndex: 5 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2 shrink-0 transition-colors-smooth" style={{ fontFamily: "Poppins, sans-serif" }}>Network-Based Fraud Detection</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Business:</strong> Detects fraud rings via network analysis. 1% improvement = millions saved. Enables competitive pricing.
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed flex-1 min-h-0" style={{ fontFamily: "Poppins, sans-serif" }}>
                <strong>Technical:</strong> High data readiness (Najm database). Requires Najm API, Bytesforce integration, Neo4j graph DB.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Prioritization & Use-Case Typing */}
      <section id="prioritization" className="fade-in-section py-16 md:py-20 lg:py-24 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "Poppins, sans-serif", color: "#2563eb" }}>
            Prioritization & Use-Case Typing
          </p>
          <h2 className="mb-4 text-balance" style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "44.8px", letterSpacing: "-1.28px", background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Strategic Portfolio Prioritization
          </h2>
          <p className="mb-12 max-w-4xl mx-auto text-center" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
            Prioritized portfolio for rapid impact across three strategic tiers.
          </p>

          {/* Tier Cards - Single Horizontal Line */}
          <div className="w-full overflow-hidden">
            <div className="flex items-stretch gap-4 md:gap-6" style={{ width: "100%", fontFamily: "Poppins, sans-serif" }}>
              {/* Tier 1: Quick Wins */}
              <div className="flex-1 min-w-0 rounded-2xl border-2 border-[#E4E4E7] p-4 md:p-6 card-hover stagger-item flex flex-col" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", borderLeft: "4px solid #10B981" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: "#10B981" }}>1</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold mb-1.5" style={{ color: "#111827" }}>Tier 1: Quick Wins</h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#047857" }}>High Impact</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}>Low/Med Complexity</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold mb-3" style={{ color: "#374151" }}>Focus: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Efficiency & Customer Experience</span></p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="border-l-2 pl-3" style={{ borderColor: "#10B981" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>GenAI Customer Service Concierge</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>RAG-powered concierge using policy docs. High visibility, immediate cost savings.</p>
                  </div>
                  <div className="border-l-2 pl-3" style={{ borderColor: "#10B981" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>AI Claims Triage (Motor)</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>AI triage: Total Loss vs. Repairable. High volume, immediate adjuster workload reduction.</p>
                  </div>
                </div>
              </div>

              {/* Tier 2: Platform Builders */}
              <div className="flex-1 min-w-0 rounded-2xl border-2 border-[#E4E4E7] p-4 md:p-6 flex flex-col" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", borderLeft: "4px solid #2563eb" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: "#2563eb" }}>2</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold mb-1.5" style={{ color: "#111827" }}>Tier 2: Platform Builders</h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#047857" }}>High Impact</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>High Complexity</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold mb-3" style={{ color: "#374151" }}>Focus: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Core Transformation & Risk</span></p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="border-l-2 pl-3" style={{ borderColor: "#2563eb" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Computer Vision Damage Estimation</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>Motor claims automation. Requires extensive integration and training data.</p>
                  </div>
                  <div className="border-l-2 pl-3" style={{ borderColor: "#2563eb" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Automated Underwriting Engine (SME/Pet)</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>Scales non-motor lines profitably. Builds the company&apos;s &quot;Risk Brain.&quot;</p>
                  </div>
                  <div className="border-l-2 pl-3" style={{ borderColor: "#2563eb" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Network-Based Fraud Detection</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>Critical for growth. Protects loss ratio as business scales.</p>
                  </div>
                </div>
              </div>

              {/* Tier 3: Transformational Bets */}
              <div className="flex-1 min-w-0 rounded-2xl border-2 border-[#E4E4E7] p-4 md:p-6 card-hover stagger-item flex flex-col" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", borderLeft: "4px solid #8B5CF6" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: "#8B5CF6" }}>3</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold mb-1.5" style={{ color: "#111827" }}>Tier 3: Transformational Bets</h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#EDE9FE", color: "#6D28D9" }}>Strategic</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>High Complexity</span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold mb-3" style={{ color: "#374151" }}>Focus: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Differentiation & New Markets</span></p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="border-l-2 pl-3" style={{ borderColor: "#8B5CF6" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Telematics / UBI</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>Complex IoT ecosystem. Creates massive competitive advantage vs. traditional insurers.</p>
                  </div>
                  <div className="border-l-2 pl-3" style={{ borderColor: "#8B5CF6" }}>
                    <h4 className="text-sm font-bold mb-1" style={{ color: "#111827" }}>Predictive Demand Sensing</h4>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>Shifts Tree from &quot;selling what we have&quot; to &quot;building what is needed.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Staged Roadmap Construction */}
      <section id="roadmap" className="fade-in-section py-16 md:py-20 lg:py-24 bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest" style={{ fontFamily: "Poppins, sans-serif", color: "#2563eb" }}>
            Staged Roadmap Construction
          </p>
          <h2 className="mb-4 text-balance" style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "44.8px", letterSpacing: "-1.28px", background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            A Phased Journey to Cognitive Insurance
          </h2>
          <p className="mb-12 max-w-4xl mx-auto text-center" style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#374151", lineHeight: "24px" }}>
            Phased journey with clear gates. Value-critical use cases prioritized.
          </p>

          {/* Phase Navigation Tabs */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 justify-center items-center">
            {/* Phase 1 */}
            <button
              onClick={() => setSelectedPhase(1)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 card-hover ${
                selectedPhase === 1 ? "bg-white shadow-lg" : "bg-gray-50"
              }`}
              style={{
                border: selectedPhase === 1 ? "2px solid #10B981" : "2px solid transparent",
                fontFamily: "Poppins, sans-serif",
                minWidth: "200px",
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedPhase === 1 ? "bg-[#10B981]" : "bg-gray-300"
                }`}
              >
                <Target className={`w-5 h-5 ${selectedPhase === 1 ? "text-white" : "text-gray-500"}`} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: selectedPhase === 1 ? "#6B7280" : "#9CA3AF" }}>
                  Phase 1
                </p>
                <p className={`text-sm font-semibold ${selectedPhase === 1 ? "text-[#111827]" : "text-gray-500"}`}>
                  Prove & Prepare
                </p>
              </div>
            </button>

            {/* Phase 2 */}
            <button
              onClick={() => setSelectedPhase(2)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 card-hover ${
                selectedPhase === 2 ? "bg-white shadow-lg" : "bg-gray-50"
              }`}
              style={{
                border: selectedPhase === 2 ? "2px solid #2563eb" : "2px solid transparent",
                fontFamily: "Poppins, sans-serif",
                minWidth: "200px",
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedPhase === 2 ? "bg-[#2563eb]" : "bg-gray-300"
                }`}
              >
                <Layers className={`w-5 h-5 ${selectedPhase === 2 ? "text-white" : "text-gray-500"}`} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: selectedPhase === 2 ? "#6B7280" : "#9CA3AF" }}>
                  Phase 2
                </p>
                <p className={`text-sm font-semibold ${selectedPhase === 2 ? "text-[#111827]" : "text-gray-500"}`}>
                  Scale & Integrate
                </p>
              </div>
            </button>

            {/* Phase 3 */}
            <button
              onClick={() => setSelectedPhase(3)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 card-hover ${
                selectedPhase === 3 ? "bg-white shadow-lg" : "bg-gray-50"
              }`}
              style={{
                border: selectedPhase === 3 ? "2px solid #8B5CF6" : "2px solid transparent",
                fontFamily: "Poppins, sans-serif",
                minWidth: "200px",
              }}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedPhase === 3 ? "bg-[#8B5CF6]" : "bg-gray-300"
                }`}
              >
                <Rocket className={`w-5 h-5 ${selectedPhase === 3 ? "text-white" : "text-gray-500"}`} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: selectedPhase === 3 ? "#6B7280" : "#9CA3AF" }}>
                  Phase 3
                </p>
                <p className={`text-sm font-semibold ${selectedPhase === 3 ? "text-[#111827]" : "text-gray-500"}`}>
                  Transform & Differentiate
                </p>
              </div>
            </button>
          </div>

          {/* Phase Content */}
          <div className="bg-white rounded-2xl border-2 border-[#E4E4E7] p-6 md:p-8 lg:p-10" style={{ fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)", minHeight: "500px" }}>
            {/* Phase 1 Content */}
            {selectedPhase === 1 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#10B981" }}>
                    <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "#111827" }}>
                      Prove & Prepare
                    </h3>
                    <p className="text-base font-semibold" style={{ color: "#10B981" }}>
                      Months 0 – 6
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
                    Theme: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Frictionless Foundation</span>
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                    Deploy visible AI in customer channels. Establish data infrastructure.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Workstreams */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Workstreams
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#10B981" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 1 (Tech)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Data Lakehouse on Google Cloud KSA. Pipeline Bytesforce & App data. SAMA-compliant governance.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#10B981" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 2 (AI Product)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Launch GenAI Chatbot (Beta) for FAQs.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#10B981" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 3 (Claims)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Deploy Photo Upload in App. Run CV models in Shadow Mode to validate accuracy.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Readiness Gate */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Readiness Gate
                    </h4>
                    <div className="bg-[#F0FDF4] rounded-xl p-5 border-2" style={{ borderColor: "#10B981" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#10B981" }}>
                          <FileCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>
                            Gate Requirements
                          </p>
                          <ul className="space-y-2">
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#10B981" }}>•</span>
                              <span>SAMA approval for cloud architecture</span>
                            </li>
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#10B981" }}>•</span>
                              <span>Hiring of Head of AI/Data</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2 Content */}
            {selectedPhase === 2 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2563eb" }}>
                    <Layers className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "#111827" }}>
                      Scale & Integrate
                    </h3>
                    <p className="text-base font-semibold" style={{ color: "#2563eb" }}>
                      Months 6 – 18
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
                    Theme: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Deep Core Automation</span>
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                    Move AI into decisioning layer: Underwriting & Settlement.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Workstreams */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Workstreams
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#2563eb" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 1 (Claims)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Automated Settlement for Motor claims &lt; SAR 3,000 (high confidence).
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#2563eb" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 2 (Underwriting)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Algorithmic Risk Scoring for SME & Pet. Enable Instant Bind.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#2563eb" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 3 (UBI)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Launch Tree Drive pilot. Build Saudi-specific risk model.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#2563eb" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 4 (Fraud)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Integrate Fraud Scoring API into claims workflow (pre-payment gate).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Readiness Gate */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Readiness Gate
                    </h4>
                    <div className="bg-[#EFF6FF] rounded-xl p-5 border-2" style={{ borderColor: "#2563eb" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#2563eb" }}>
                          <FileCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>
                            Gate Requirements
                          </p>
                          <ul className="space-y-2">
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#2563eb" }}>•</span>
                              <span>Phase 1 deliverables validated and operational</span>
                            </li>
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#2563eb" }}>•</span>
                              <span>Regulatory approvals for automated decisioning</span>
                            </li>
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#2563eb" }}>•</span>
                              <span>Sufficient data quality for model deployment</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 3 Content */}
            {selectedPhase === 3 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#8B5CF6" }}>
                    <Rocket className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1" style={{ color: "#111827" }}>
                      Transform & Differentiate
                    </h3>
                    <p className="text-base font-semibold" style={{ color: "#8B5CF6" }}>
                      Months 18 – 36
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-lg font-semibold mb-2" style={{ color: "#111827" }}>
                    Theme: <span style={{ color: "#6B7280", fontWeight: "normal" }}>Autonomous Ecosystem</span>
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: "#374151" }}>
                    AI drives product creation and ecosystem integration.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Workstreams */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Workstreams
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#8B5CF6" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 1 (UBI)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Shift Motor book to Dynamic Pricing (driving score-based renewals).
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#8B5CF6" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 2 (Product)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Launch Predictive Product Design. AI identifies a niche (e.g., "E-Sports Equipment Insurance") and auto-generates the underwriting rules.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#8B5CF6" }}>
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                            Workstream 3 (Ecosystem)
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                            Open Embedded AI APIs. Partners integrate Tree's risk engine into their POS systems.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Readiness Gate */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#6B7280" }}>
                      Readiness Gate
                    </h4>
                    <div className="bg-[#F5F3FF] rounded-xl p-5 border-2" style={{ borderColor: "#8B5CF6" }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#8B5CF6" }}>
                          <FileCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2" style={{ color: "#111827" }}>
                            Gate Requirements
                          </p>
                          <ul className="space-y-2">
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#8B5CF6" }}>•</span>
                              <span>Phase 2 operations scaled and stable</span>
                            </li>
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#8B5CF6" }}>•</span>
                              <span>Sufficient telematics data for pricing models</span>
                            </li>
                            <li className="text-sm leading-relaxed flex items-start gap-2" style={{ color: "#374151" }}>
                              <span style={{ color: "#8B5CF6" }}>•</span>
                              <span>API infrastructure and partner agreements in place</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Idea Starters from Our Labs — 3 tabs: Customer Experience 5, Employee Productivity 5, Data Accelerator 3 */}
      <section id="idea-starters" className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] relative" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #E8F7F4 76.44%, #FAFAFA 100%)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16" style={{ position: "relative", zIndex: 1 }}>
          <p className="mb-1 text-sm font-medium uppercase tracking-wide text-[#6B7280] text-center" style={{ fontFamily: "Poppins, sans-serif" }}>Idea Starters from Our Labs</p>
          <h2 className="mb-2 text-balance" style={{ textAlign: "center", fontFamily: "Poppins", fontSize: "28px", fontStyle: "normal", fontWeight: 600, lineHeight: "44.8px", letterSpacing: "-1.28px", background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Agentic Solutions for Insurance
          </h2>
          <p className="mb-2 max-w-4xl mx-auto" style={{ textAlign: "center", fontFamily: "Poppins", fontSize: "16px", color: "#111827", lineHeight: "24px" }}>
            Ready-to-deploy AI agents from the Tangram Store, customized for insurance operations.
          </p>
          <p className="mb-6 text-center text-sm text-[#6B7280]" style={{ fontFamily: "Poppins, sans-serif" }}>Click any card to try the live demo</p>

          {/* Tabs: Customer Experience 5 | Employee Productivity 5 | Data Accelerator 3 */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 border-b border-[#E5E7EB]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {ideaTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setIdeaTab(t.id)}
                className="px-1 pb-3 -mb-px text-sm font-medium transition-colors border-b-2 whitespace-nowrap"
                style={{
                  borderColor: ideaTab === t.id ? "#111827" : "transparent",
                  color: ideaTab === t.id ? "#111827" : "#6B7280",
                }}
              >
                {t.label} {t.count}
              </button>
            ))}
          </div>

          {/* Agent tiles — uniform: icon in gray circle, Demo top-right, title, desc, tag bottom-left */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-12 max-w-6xl mx-auto" style={{ gap: "clamp(12px, 2vw, 20px)" }}>
            {(ideaAgents[ideaTab] || []).map((a) => {
              const Icon = a.Icon
              const cardClass = "block border bg-white overflow-hidden rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow relative flex flex-col min-h-[220px]"
              const cardStyle = { borderColor: "#E4E4E7", fontFamily: "Poppins, sans-serif" } as React.CSSProperties
              const cardContent = (
                <>
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-white" style={{ backgroundColor: "#2563eb" }}>Demo <ArrowRight className="w-3 h-3" /></span>
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
                      <Icon className="w-6 h-6" style={{ color: ("iconColor" in a && a.iconColor) ? a.iconColor : "#2563eb" }} strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#111827] mb-1.5 text-sm leading-tight">{a.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-snug flex-1" style={{ fontSize: "13px" }}>{a.desc}</p>
                  <div className="mt-3 pt-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ backgroundColor: "#DBEAFE", color: "#2563eb" }}>{a.tag}</span>
                  </div>
                </>
              )
              return ("external" in a && a.external) ? (
                <a key={a.title} href={a.href} target="_blank" rel="noopener noreferrer" aria-label={`Try live demo: ${a.title} (opens in new tab)`} className={cardClass} style={cardStyle}>{cardContent}</a>
              ) : (
                <Link key={a.title} href={a.href} aria-label={`Try live demo: ${a.title}`} className={cardClass} style={cardStyle}>{cardContent}</Link>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Link href="/agents" className="inline-flex items-center justify-center rounded-[4px] bg-[#091917] text-white font-medium text-sm hover:bg-[#091917]/90 transition-colors" style={{ fontFamily: "Poppins, sans-serif", padding: "12px 24px" }}>Explore All 100+ Agents</Link>
          </div>
        </div>
      </section>

      {/* Same HeroCta box as homepage bottom: Enquire Now, Turn GenAI…, Talk to us + Start with a pilot */}
      <div id="stop-piloting" className="fade-in-section">
        <HeroCta />
      </div>

    </div>
  )
}
