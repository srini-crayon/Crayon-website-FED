"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Mic, Sparkles, Video, UserCircle, Users, Database, BarChart3 } from "lucide-react"

const tabs = [
  { id: "customer", label: "Customer Experience" },
  { id: "employee", label: "Employee Experience" },
  { id: "data", label: "Data Experience" },
]

const customerTrends = [
  {
    title: "From Clicks to Conversations",
    description: "Voice will outsell clicks — financial services will soon be driven by natural conversations",
    icon: Mic,
    color: "#04ab8b",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c}22 0%, ${c}08 100%)` }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -inset-8 rounded-full animate-pulse" style={{ backgroundColor: `${c}20` }} />
            <div className="absolute -inset-4 rounded-full" style={{ backgroundColor: `${c}30` }} />
            <div className="relative h-16 w-16 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: c }}>
              <Mic className="h-8 w-8" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-1 items-end justify-center">
            {[0.3, 0.6, 1, 0.8, 0.4, 0.9, 0.5, 0.7, 1, 0.6, 0.8, 0.4].map((h, i) => (
              <div key={i} className="w-2 rounded-t" style={{ height: `${h * 32}px`, backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "The Invisible Hyper-Personal Assistant",
    description: "Tomorrow's financial assistant will be invisible but always available, and totally hyper personal",
    icon: Sparkles,
    color: "#F05283",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${c}22 0%, ${c}08 100%)` }}>
        <div className="relative w-full max-w-xs">
          <div className="bg-white border rounded-2xl p-3 shadow-lg" style={{ borderColor: `${c}40` }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c}25` }}>
                <Sparkles className="h-4 w-4" style={{ color: c }} />
              </div>
              <span className="text-xs font-medium text-foreground">AI Assistant</span>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: `${c}10` }}>
              <p className="text-xs text-muted-foreground">Show me the latest discounts on premium headphones</p>
            </div>
            <div className="mt-2 flex gap-2">
              {[c, "#394fa1", "#ffc334"].map((col, i) => (
                <div key={i} className="h-12 w-12 rounded-lg" style={{ backgroundColor: `${col}20` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Video is the New Storefront",
    description: "Consumers connect emotionally through stories, not words or static images",
    icon: Video,
    color: "#ffc334",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c}30 0%, ${c}10 100%)` }}>
        <div className="relative">
          <div className="w-32 h-44 bg-white border-4 rounded-2xl overflow-hidden shadow-xl" style={{ borderColor: `${c}60` }}>
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${c}35, #F0528325)` }} />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] text-white font-medium">LIVE</span>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-10 w-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: c }}>
                <Video className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

const employeeTrends = [
  {
    title: "Every CxO Will Have Their Own Personal Concierge",
    description: "Enable all CxOs with personal concierges to query the data directly on all aspects of their business, including predictive and scenario based answers",
    icon: UserCircle,
    color: "#0082C0",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${c}25 0%, ${c}08 100%)` }}>
        <div className="relative w-full max-w-sm">
          <div className="bg-white border rounded-xl p-4 shadow-lg" style={{ borderColor: `${c}50` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: c }}>
                <UserCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">CxO Concierge</p>
                <p className="text-xs text-muted-foreground">Ask anything about your business</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg flex items-center px-3" style={{ backgroundColor: `${c}18` }}>
                  <span className="text-xs" style={{ color: c }}>Revenue forecast Q4?</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg flex items-center px-3" style={{ backgroundColor: "#F0528320" }}>
                  <span className="text-xs" style={{ color: "#F05283" }}>Customer churn analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Every Employee Will Have a Digital Co-Worker",
    description: "Enable all employees with automation co-pilots to help them work smarter, faster, and more creatively — boosting productivity while keeping the bank's human touch intact",
    icon: Users,
    color: "#974095",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c}28 0%, ${c}10 100%)` }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: "#f3f4f6", borderColor: `${c}40` }}>
              <Users className="h-8 w-8" style={{ color: "#6b7280" }} />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium bg-white px-2 py-0.5 rounded-full border shadow-sm" style={{ borderColor: `${c}40` }}>You</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1 w-8 rounded" style={{ backgroundColor: `${c}50` }} />
            <div className="h-1 w-8 rounded" style={{ backgroundColor: c }} />
            <div className="h-1 w-8 rounded" style={{ backgroundColor: `${c}50` }} />
          </div>
          <div className="relative">
            <div className="h-16 w-16 rounded-full flex items-center justify-center border-2 text-white" style={{ backgroundColor: c, borderColor: c }}>
              <Sparkles className="h-8 w-8" />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: c }}>AI</span>
          </div>
        </div>
      </div>
    ),
  },
]

const dataTrends = [
  {
    title: "Unified Intelligence Across Data Sets",
    description: "Every enterprise will (try to) create a unified intelligence across data sets — breaking silos and enabling holistic insights",
    icon: Database,
    color: "#00AE8E",
    visual: (c: string) => {
      const a = "#394fa1", b = "#F05283"
      return (
        <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c}25 0%, ${a}15 50%, ${b}12 100%)` }}>
          <div className="relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: `${a}25`, borderColor: `${a}50` }}>
                <Database className="h-6 w-6" style={{ color: a }} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 translate-y-8 -translate-x-8">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: `${b}25`, borderColor: `${b}50` }}>
                <Database className="h-5 w-5" style={{ color: b }} />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 translate-y-8 translate-x-8">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center border-2" style={{ backgroundColor: `${c}30`, borderColor: `${c}60` }}>
                <Database className="h-5 w-5" style={{ color: c }} />
              </div>
            </div>
            <div className="h-20 w-20 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${a} 0%, ${b} 50%, ${c} 100%)` }}>
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <Sparkles className="h-8 w-8" style={{ color: c }} />
              </div>
            </div>
            <svg className="absolute inset-0 -z-10" width="160" height="160" viewBox="0 0 160 160">
              <line x1="80" y1="80" x2="80" y2="20" stroke={a} strokeWidth="2" strokeDasharray="4" opacity={0.4} />
              <line x1="80" y1="80" x2="30" y2="130" stroke={b} strokeWidth="2" strokeDasharray="4" opacity={0.4} />
              <line x1="80" y1="80" x2="130" y2="130" stroke={c} strokeWidth="2" strokeDasharray="4" opacity={0.4} />
            </svg>
          </div>
        </div>
      )
    },
  },
  {
    title: "From Dashboards to Co-pilots",
    description: "Every enterprise will move from dashboards to co-pilots — from passive reporting to active intelligence that guides decisions",
    icon: BarChart3,
    color: "#394fa1",
    visual: (c: string) => (
      <div className="relative h-48 rounded-xl overflow-hidden flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${c}20 0%, #F0528315 100%)` }}>
        <div className="flex items-center gap-6">
          <div className="text-center opacity-70">
            <div className="h-24 w-20 rounded-lg border p-2" style={{ backgroundColor: "#f9fafb", borderColor: `${c}30` }}>
              <div className="flex gap-1 h-full items-end">
                {["40%", "70%", "50%", "90%"].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t" style={{ height: h, backgroundColor: `${c}50` }} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dashboard</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: c }} />
            <svg className="h-4 w-4" style={{ color: c }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-center">
            <div className="h-24 w-20 rounded-lg border-2 p-2 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: `${c}15`, borderColor: c }}>
              <Sparkles className="h-8 w-8" style={{ color: c }} />
              <div className="w-full space-y-1">
                <div className="h-1 w-full rounded" style={{ backgroundColor: `${c}50` }} />
                <div className="h-1 w-3/4 rounded" style={{ backgroundColor: `${c}50` }} />
              </div>
            </div>
            <p className="text-xs font-medium mt-2" style={{ color: c }}>Co-pilot</p>
          </div>
        </div>
      </div>
    ),
  },
]

const tabContent = {
  customer: customerTrends,
  employee: employeeTrends,
  data: dataTrends,
}

export function TrendsSection() {
  const [activeTab, setActiveTab] = useState<"customer" | "employee" | "data">("customer")
  const trends = tabContent[activeTab]
  const isFirstTabMount = useRef(true)

  const tabsContainerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)
  const [greyLineStyle, setGreyLineStyle] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    if (!tabsContainerRef.current || !activeTab) {
      setIndicatorStyle(null)
      return
    }
    const tabEl = tabRefs.current.get(activeTab)
    if (!tabEl) {
      setIndicatorStyle(null)
      return
    }
    const timer = setTimeout(() => {
      if (!tabsContainerRef.current || !tabEl) return
      const containerRect = tabsContainerRef.current.getBoundingClientRect()
      const tabRect = tabEl.getBoundingClientRect()
      setIndicatorStyle({ left: tabRect.left - containerRect.left, width: tabRect.width })
    }, 0)
    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    if (!tabsContainerRef.current) {
      setGreyLineStyle(null)
      return
    }
    const timer = setTimeout(() => {
      if (!tabsContainerRef.current) return
      const containerRect = tabsContainerRef.current.getBoundingClientRect()
      const first = tabRefs.current.get(tabs[0]?.id)
      const last = tabRefs.current.get(tabs[tabs.length - 1]?.id)
      if (first && last) {
        const firstRect = first.getBoundingClientRect()
        const lastRect = last.getBoundingClientRect()
        setGreyLineStyle({ left: firstRect.left - containerRect.left, width: lastRect.right - firstRect.left })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    if (isFirstTabMount.current) {
      isFirstTabMount.current = false
      return
    }
    window.dispatchEvent(new CustomEvent("banking-reobserve"))
  }, [activeTab])

  return (
    <section className="pt-0 pb-20 md:pb-20 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-sm font-medium text-primary uppercase tracking-wider scale-in">AI Mega Trends</span>
          <h2
            className="mb-0 text-balance fade-in-blur"
            style={{
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              fontSize: "28px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "44.8px",
              letterSpacing: "-1.28px",
              background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginTop: "4px",
              marginBottom: "8px",
              willChange: "opacity, transform, filter",
            }}
          >
            What Could an AI-First Bank Look Like in 3 Years?
          </h2>
        </div>

        <div className="relative w-full flex justify-center items-center pt-6 mb-12 fade-in-section">
          <div ref={tabsContainerRef} className="relative flex gap-8 flex-wrap justify-center">
            {greyLineStyle && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: `${greyLineStyle.left}px`,
                  width: `${greyLineStyle.width}px`,
                  height: "2px",
                  backgroundColor: "#E5E7EB",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
            )}
            {indicatorStyle && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "-1px",
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: "2px",
                  backgroundColor: "#000",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
            )}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(tab.id, el)
                  else tabRefs.current.delete(tab.id)
                }}
                onClick={() => setActiveTab(tab.id as "customer" | "employee" | "data")}
                className="relative pb-2 px-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? "#000" : "#344054",
                  paddingBottom: "12px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "grid gap-6",
            trends.length === 3 && "md:grid-cols-2 lg:grid-cols-3",
            trends.length === 2 && "md:grid-cols-2 max-w-4xl mx-auto"
          )}
        >
          {trends.map((trend, index) => {
            const c = (trend as { color?: string }).color ?? "#394fa1"
            return (
              <Card
                key={index}
                className="rounded-2xl border border-gray-100 bg-white py-0 gap-0 shadow-none hover:shadow-lg transition-all duration-300 overflow-hidden stagger-item"
              >
                <CardContent className="p-0">
                  {typeof trend.visual === "function" ? trend.visual(c) : trend.visual}
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${c}20` }}
                      >
                        <trend.icon className="h-5 w-5" style={{ color: c }} />
                      </div>
                      <h4 className="font-semibold text-base text-foreground leading-tight">{trend.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">{trend.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
