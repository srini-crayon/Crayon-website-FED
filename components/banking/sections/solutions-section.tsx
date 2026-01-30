"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Gift, ShoppingBag, Wallet, MessageCircleQuestion, Plane,
  UserCog, LayoutGrid, TrendingUp, FileBarChart, Leaf,
  HardDrive, ShieldCheck, FlaskConical
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface SolutionCardProps {
  readonly solution: {
    readonly name: string
    readonly url: string
    readonly description: string
    readonly icon: LucideIcon
  }
  readonly color: string
}

function SolutionCard({ solution, color }: SolutionCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = solution.icon

  return (
    <a
      href={solution.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block stagger-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ textDecoration: "none" }}
    >
      <Card
        className="agent-card-enhanced flex flex-col overflow-hidden bg-white w-full cursor-pointer relative rounded-2xl border border-gray-100 shadow-none hover:shadow-lg transition-all duration-300 p-0"
        style={{
          height: "360px",
          maxWidth: "442px",
        }}
      >
        {/* Icon Section - Matching Agent Card Image Area */}
        <div
          className="relative flex-shrink-0 w-full rounded-t-2xl overflow-hidden"
          style={{
            height: "180px",
            minHeight: "180px",
            maxHeight: "180px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)`,
            marginTop: "0",
          }}
        >
          {/* Gradient Image Border - Visible only on sides/edges as rectangular frame */}
          {/* Top border */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 0,
              height: "12px",
              backgroundImage: "url('/Mask_img_contact.png')",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
            }}
          />
          {/* Bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 0,
              height: "12px",
              backgroundImage: "url('/Mask_img_contact.png')",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
            }}
          />
          {/* Left border */}
          <div
            className="absolute top-0 bottom-0 left-0 pointer-events-none"
            style={{
              zIndex: 0,
              width: "12px",
              backgroundImage: "url('/Mask_img_contact.png')",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
            }}
          />
          {/* Right border */}
          <div
            className="absolute top-0 bottom-0 right-0 pointer-events-none"
            style={{
              zIndex: 0,
              width: "12px",
              backgroundImage: "url('/Mask_img_contact.png')",
              backgroundSize: "auto",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
            }}
          />
          <Icon 
            className="transition-all duration-300" 
            style={{ 
              color, 
              zIndex: 2, 
              position: "relative",
              width: "56px",
              height: "56px",
            }} 
          />
        </div>

        {/* Content Section */}
        <CardContent
          className="flex flex-col flex-1 w-full p-4"
          style={{
            minHeight: "auto",
            flex: "1 1 auto",
            gap: "0",
            overflow: "hidden",
          }}
        >
          {/* Title with Badge */}
          <div className="flex items-start justify-between gap-2 flex-shrink-0 mb-2">
            <h3 className="line-clamp-2 flex-1 font-semibold text-base text-foreground leading-tight transition-all duration-300" style={{
              fontFamily: "Poppins, sans-serif",
              color: isHovered ? "transparent" : "#101828",
              background: isHovered ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
              backgroundClip: isHovered ? "text" : "unset",
              WebkitBackgroundClip: isHovered ? "text" : "unset",
              WebkitTextFillColor: isHovered ? "transparent" : "unset",
              minHeight: "40px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {solution.name}
            </h3>
            <span
              className="flex-shrink-0 rounded px-2 py-1 text-xs font-medium"
              style={{
                background: "#FFF0E0",
                color: "#A75510",
              }}
            >
              Solution
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 flex-shrink-0 text-sm text-muted-foreground leading-relaxed mb-3" style={{
            fontFamily: "Poppins, sans-serif",
            minHeight: "36px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {solution.description}
          </p>

          {/* Demo Link - Styled as Tag */}
          <div className="flex flex-shrink-0 w-full mt-auto">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Demo
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
const solutions = [
  { category: "Customer Experience", name: "Personalization HDFC", url: "https://myoffers.smartbuy.hdfcbank.com/home", description: "AI-powered personalized offers marketplace for banking customers", icon: Gift },
  { category: "Customer Experience", name: "Personalization ADIB", url: "https://ae.adibsmartdeals.com/", description: "Smart deals platform with personalized recommendations", icon: ShoppingBag },
  { category: "Customer Experience", name: "Personal Finance Assistant", url: "https://agents.tngrm.ai/agents/agent_006", description: "Intelligent financial guidance and planning assistant", icon: Wallet },
  { category: "Customer Experience", name: "Just ASK", url: "https://agents.tngrm.ai/agents/agent_043", description: "Natural language banking queries and support", icon: MessageCircleQuestion },
  { category: "Customer Experience", name: "Travel AI", url: "https://agents.tngrm.ai/agents/agent_005", description: "Smart travel recommendations and booking assistance", icon: Plane },
  { category: "Employee Productivity", name: "CXO Concierge", url: "https://agents.tngrm.ai/agents/agent_004", description: "Executive insights and decision support on demand", icon: UserCog },
  { category: "Employee Productivity", name: "OMP (Offer Management)", url: "https://agents.tngrm.ai/agents/agent_154", description: "Unified offer management and campaign platform", icon: LayoutGrid },
  { category: "Employee Productivity", name: "Wealth RM", url: "https://agents.tngrm.ai/agents/agent_008", description: "Relationship manager assistant for wealth management", icon: TrendingUp },
  { category: "Employee Productivity", name: "Earnings Analyst", url: "https://agents.tngrm.ai/agents/agent_001", description: "Financial analysis and earnings report automation", icon: FileBarChart },
  { category: "Employee Productivity", name: "ESG Co-Pilot", url: "https://tngrm.ai/agents/agent_029", description: "Sustainability reporting and ESG compliance assistant", icon: Leaf },
  { category: "Data Accelerator", name: "DATA STUDIO", url: "https://agents.tngrm.ai/agents/agent_017", description: "Enterprise data ingestion and enrichment platform", icon: HardDrive },
  { category: "Data Accelerator", name: "Automated Controls Monitoring", url: "https://tngrm.ai/agents/agent_016", description: "Real-time control systems and compliance monitoring", icon: ShieldCheck },
  { category: "Data Accelerator", name: "TEST DATA STUDIO", url: "https://tngrm.ai/agents/agent_012", description: "Synthetic test data generation and management", icon: FlaskConical },
]

const categories = [
  { id: "Customer Experience", label: "Customer Experience", count: solutions.filter(s => s.category === "Customer Experience").length },
  { id: "Employee Productivity", label: "Employee Productivity", count: solutions.filter(s => s.category === "Employee Productivity").length },
  { id: "Data Accelerator", label: "Data Accelerator", count: solutions.filter(s => s.category === "Data Accelerator").length },
]

const cardColors = ["#04ab8b", "#394fa1", "#ffc334", "#ed407b", "#974095"]

export function SolutionsSection() {
  const [activeTab, setActiveTab] = useState("Customer Experience")
  const filteredSolutions = solutions.filter(s => s.category === activeTab)
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
      const first = tabRefs.current.get(categories[0]?.id)
      const last = tabRefs.current.get(categories[categories.length - 1]?.id)
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
    <section
      className="relative py-16 md:py-20 fade-in-section"
      style={{
        background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(232, 246, 247, 1) 76.44%, rgba(255, 255, 255, 1) 100%)",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-0 items-center text-center mb-12">
          <span className="block text-sm font-medium text-primary uppercase tracking-wider scale-in">SOLUTIONS FROM OUR LABS</span>
          <h2
            className="text-balance fade-in-blur"
            style={{
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              fontSize: "32px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              willChange: "opacity, transform, filter",
            }}
          >
            Agentic Solutions for Banks
          </h2>
          <p
            className="fade-in-section"
            style={{
              color: "#091917",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              maxWidth: "1100px",
              margin: "0 auto",
              willChange: "opacity, transform",
            }}
          >
            Ready-to-deploy AI agents from the Tangram Store, customized for banking operations
          </p>
        </div>

        <div className="relative w-full flex justify-center items-center pt-6 mb-12 fade-in-section">
          <div
            ref={tabsContainerRef}
            className="relative flex gap-8 flex-wrap justify-center"
          >
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
            {categories.map((cat) => (
              <button
                key={cat.id}
                ref={(el) => {
                  if (el) tabRefs.current.set(cat.id, el)
                  else tabRefs.current.delete(cat.id)
                }}
                onClick={() => setActiveTab(cat.id)}
                className="relative pb-2 px-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: activeTab === cat.id ? 600 : 500,
                  color: activeTab === cat.id ? "#000" : "#344054",
                  paddingBottom: "12px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {filteredSolutions.map((solution, index) => {
            const color = cardColors[index % cardColors.length]
            return (
              <SolutionCard
                key={solution.name}
                solution={solution}
                color={color}
              />
            )
          })}
        </div>

        <div className="flex justify-center mt-8 scale-in">
          <Button asChild size="lg" variant="default" className="gap-2">
            <a href="https://tngrm.ai" target="_blank" rel="noopener noreferrer">
              Explore All 100+ Agents
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
