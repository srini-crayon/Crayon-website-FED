"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  BarChart3,
  Repeat,
  Workflow,
  Shield,
  Globe,
  ArrowUpRight,
  FileText,
  Gauge,
  Network,
} from "lucide-react";
import { SchedulerDialog } from "../catalyst/sections/scheduler-dialog";

/* Hero & CTA copy (inlined from former content.ts) */
const factoryHero = {
  eyebrow: "Factory",
  title: "Scale & Operationalize Enterprise AI",
  description:
    "Factory is Crayon Data's scale and governance engine. It takes what works from Labs and Foundry and embeds it enterprise-wide—with governance, compliance, and repeatability built in.",
};
const factoryResultCta = "Talk to an AI Expert";

/* The Result — Group 1410104303: 1284×449.5; cards 303×180; bar + Geist Mono + Inter title */
const outcomeColumns = [
  { num: "01", barColor: "#1C69E3", textColor: "#1C69E3", title: "AI as business-as-usual" },
  { num: "02", barColor: "#4C1D95", textColor: "#4C1D95", title: "Governed and compliant deployments" },
  { num: "03", barColor: "#E17100", textColor: "#E17100", title: "Cross-functional adoption" },
  { num: "04", barColor: "#F5319D", textColor: "#F5319D", title: "Measurable enterprise impact" },
];

/* Differentiation: numbered cards — Group 1410104306 spec (1244.81×476); card accent colors */
const differentiatorCards = [
  { num: "01", color: "#FF9231", title: "Repeatability", description: "Standardised frameworks that ensure every deployment follows a proven path" },
  { num: "02", color: "#722ED1", title: "Operational Discipline", description: "Moving AI from experimental labs to the core of business operations" },
  { num: "03", color: "#F5319D", title: "Governance by Design", description: "Compliance and safety are baked into the architecture, not added later" },
  { num: "04", color: "#8F2B8C", title: "Enterprise-wide Adoption", description: "Tools built for scale across diverse geographies and functions" },
];

/* Capabilities — Group 1410104281: 1092×156; each item 180px; 72×72 circle gradient 135deg; icon color; label Poppins 400 16px #1D293D */
const capabilityRows = [
  { icon: ArrowUpRight, label: "Scaling agents across departments", iconColor: "#4F39F6", circleGradient: "linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 100%)" },
  { icon: FileText, label: "Standardizing design patterns and data frameworks", iconColor: "#0069A8", circleGradient: "linear-gradient(135deg, #DFF2FE 0%, #FFFFFF 100%)" },
  { icon: Shield, label: "Embedding governance and compliance models", iconColor: "#A800B7", circleGradient: "linear-gradient(135deg, #FAE8FF 0%, #FFFFFF 100%)" },
  { icon: Gauge, label: "Ensuring auditability and performance monitoring", iconColor: "#BB4D00", circleGradient: "linear-gradient(135deg, #FEF3C6 0%, #FFFFFF 100%)" },
  { icon: Network, label: "Deep integration into enterprise systems", iconColor: "#009966", circleGradient: "linear-gradient(135deg, #D0FAE5 0%, #FFFFFF 100%)" },
];

export default function FactoryPage() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState<Date | null>(null);

  const handleCta = () => setSchedulerOpen(true);

  const handleSlotConfirm = (slot: Date | null) => {
    setScheduledSlot(slot);
    if (slot) console.info("[Factory Scheduler] Slot:", slot.toISOString());
  };

  return (
    <>
      <SchedulerDialog
        open={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        selectedSlot={scheduledSlot}
        onConfirm={handleSlotConfirm}
      />
      <div className="flex flex-col bg-white" style={{ fontFamily: "Poppins, sans-serif" }}>
        {/* Hero - Gradient layer; equal gap above and below content block */}
        <main className="relative min-h-[520px] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
          {/* Gradient: position absolute; left 0; top 0; full width, 520px height */}
          <div
            className="absolute left-0 top-0 w-full pointer-events-none"
            style={{
              height: 520,
              background: "radial-gradient(100% 100% at 50% 0%, #E5FFF2 0%, #FFFFFF 100%)",
            }}
            aria-hidden
          />
          {/* Section / Group 1410104244: 855×212; FACTORY Geist 14px; heading Poppins 42px; body Geist 16px; button 227×48 */}
          <div
            className="relative z-10 w-full mx-auto text-center flex flex-col items-center justify-center rounded-[4px]"
            style={{
              width: "100%",
              maxWidth: 855,
              minHeight: 212,
              opacity: 1,
              gap: 24,
            }}
          >
            <p
              className="uppercase flex items-center justify-center text-center"
              style={{
                fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: "20px",
                letterSpacing: "0.35px",
                color: "#45556C",
              }}
            >
              {factoryHero.eyebrow}
            </p>
            <h1
              className="flex items-center justify-center text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 42,
                lineHeight: "48px",
                color: "#091917",
              }}
            >
              {factoryHero.title}
            </h1>
            <p
              className="flex items-center justify-center text-center max-w-[855px] mx-auto"
              style={{
                fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#45556C",
              }}
            >
              {factoryHero.description}
            </p>
          </div>
        </main>

        {/* 1. Capabilities — gradient fills section (no white band or strip) */}
        <section className="relative w-full min-h-[700px] py-16 sm:py-20 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 w-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #FAFCFD 0%, #F2F5FF 100%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 w-full mx-auto flex flex-col items-center" style={{ maxWidth: 1092 }}>
            {/* Group 1410104272: 769×127 — Capabilities label + heading + subtitle */}
            <div className="text-center mb-12 mx-auto" style={{ maxWidth: 769 }}>
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#1F2937" }} aria-hidden />
                <p
                  className="text-center uppercase flex items-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "16px",
                    letterSpacing: "1.2px",
                    color: "#111827",
                  }}
                >
                  Capabilities
                </p>
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#1F2937" }} aria-hidden />
              </div>
              <h2
                className="text-center mb-4 bg-clip-text text-transparent"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 300,
                  fontSize: 36,
                  lineHeight: "40px",
                  backgroundImage: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Enterprise AI scales when product and execution move together
              </h2>
              <p
                className="text-center mx-auto"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#4B5563",
                  maxWidth: 554,
                }}
              >
                Factory institutionalizes AI across teams, functions, and geographies. We focus on:
              </p>
            </div>
            {/* Group 1410104281: 1092×156 — 5 items, each 180px; 72×72 circle gradient 135deg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full justify-items-center" style={{ maxWidth: 1092, minHeight: 156 }}>
              {capabilityRows.map((row) => (
                <div key={row.label} className="flex flex-col items-center text-center flex-none" style={{ width: 180 }}>
                  <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full shrink-0 mb-3"
                    style={{ background: row.circleGradient }}
                  >
                    <row.icon className="h-7 w-7" style={{ color: row.iconColor }} aria-hidden />
                  </div>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "#1D293D",
                    }}
                  >
                    {row.label}
                  </p>
                </div>
              ))}
            </div>
            {/* Container: 690×65; 64px divider; closing line 448px */}
            <div className="mt-12 flex flex-col items-center gap-4" style={{ maxWidth: 690 }}>
              <span className="h-px" style={{ width: 64, background: "rgba(226, 232, 240, 0.8)" }} aria-hidden />
              <p
                className="text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#1D293D",
                  maxWidth: 448,
                }}
              >
                AI does not remain a project. It becomes infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Differentiation — Group 1410104306: Rectangle 34624647 gradient bg; 1244.81×476; dividers #1F2937; heading gradient; cards 297.7×183 */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 flex flex-col items-center min-h-[700px]">
          {/* Rectangle 34624647: gradient background */}
          <div
            className="absolute left-0 top-0 w-full pointer-events-none"
            style={{
              width: "100%",
              maxWidth: 1512,
              height: 700,
              background: "linear-gradient(180deg, #F2F5FF 69.71%, #FFFFFF 100%)",
            }}
            aria-hidden
          />
          <div className="relative w-full mx-auto" style={{ maxWidth: 1244.81 }}>
            <div className="text-center mb-12 mx-auto" style={{ maxWidth: 769 }}>
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#1F2937" }} aria-hidden />
                <p
                  className="text-center uppercase flex items-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "16px",
                    letterSpacing: "1.2px",
                    color: "#111827",
                  }}
                >
                  Differentiation
                </p>
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#1F2937" }} aria-hidden />
              </div>
              <h2
                className="text-center mb-4 bg-clip-text text-transparent"
                style={{
                  fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                  fontWeight: 300,
                  fontSize: 36,
                  lineHeight: "40px",
                  backgroundImage: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                What Makes Factory Different
              </h2>
              <p
                className="text-center mx-auto"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#4B5563",
                  maxWidth: 554,
                }}
              >
                Most AI efforts stall at pilot stage. Factory builds the bridge to permanent capability.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {differentiatorCards.map((card) => (
                <div
                  key={card.num}
                  className="box-border bg-white flex flex-col gap-4 text-left p-5"
                  style={{
                    minHeight: 183,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full flex-shrink-0"
                      style={{ width: 6, height: 6, background: card.color }}
                      aria-hidden
                    />
                    <span
                      className="flex items-center"
                      style={{
                        fontFamily: "Geist Mono, var(--font-geist-mono), monospace",
                        fontWeight: 400,
                        fontSize: 10,
                        lineHeight: "15px",
                        letterSpacing: "1px",
                        color: card.color,
                      }}
                    >
                      {card.num}
                    </span>
                  </div>
                  <h3
                    className="font-medium"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: 18,
                      lineHeight: "26px",
                      color: card.color,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: "24px",
                      color: "#4B4B4B",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-center gap-4" style={{ maxWidth: 690, marginLeft: "auto", marginRight: "auto" }}>
              <span className="h-px" style={{ width: 64, background: "rgba(226, 232, 240, 0.8)" }} aria-hidden />
              <p
                className="text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#1D293D",
                }}
              >
                Scaling is structured — not chaotic.
              </p>
            </div>
          </div>
        </section>

        {/* 3. The Result — Group 1410104303: 1284×449.5; Group 1410104304 header 409×105.5; cards row 1284×180; bar 3×16 at 41,41 */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white flex flex-col items-center">
          <div className="w-full mx-auto flex flex-col items-center" style={{ maxWidth: 1284, minHeight: 449.5 }}>
            {/* Group 1410104304: 409×105.5 — label + heading */}
            <div className="text-center mb-10 mx-auto" style={{ maxWidth: 409, minHeight: 105.5 }}>
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#0A0A0A" }} aria-hidden />
                <p
                  className="text-center uppercase flex items-center"
                  style={{
                    fontFamily: "Geist Mono, var(--font-geist-mono), monospace",
                    fontWeight: 400,
                    fontSize: 11,
                    lineHeight: "16px",
                    letterSpacing: "1.1px",
                    color: "#0A0A0A",
                  }}
                >
                  The Result
                </p>
                <span className="h-px flex-shrink-0" style={{ width: 32, background: "#0A0A0A" }} aria-hidden />
              </div>
              <h2
                className="text-center flex items-center justify-center bg-clip-text text-transparent"
                style={{
                  fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                  fontWeight: 300,
                  fontSize: 36,
                  lineHeight: "40px",
                  backgroundImage: "linear-gradient(90deg, #0060FF 0%, #DC3DD5 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Ready to move AI into production?
              </h2>
            </div>
            {/* Background: flex row, gap 24px, 1284×180 */}
            <div className="flex flex-row flex-nowrap justify-center overflow-x-auto box-border" style={{ gap: 24, minHeight: 180 }}>
              {outcomeColumns.map((col) => (
                <div
                  key={col.num}
                  className="box-border bg-white flex-none flex flex-col relative shrink-0"
                  style={{
                    width: 303,
                    height: 180,
                    paddingLeft: 41,
                    paddingTop: 41,
                    paddingRight: 24,
                    paddingBottom: 24,
                    borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="flex-shrink-0 rounded-r-full"
                      style={{ width: 3, height: 16, background: col.barColor }}
                      aria-hidden
                    />
                    <span
                      style={{
                        fontFamily: "Geist Mono, var(--font-geist-mono), monospace",
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: "12px",
                        letterSpacing: "0.6px",
                        color: col.textColor,
                      }}
                    >
                      {col.num}
                    </span>
                  </div>
                  <p
                    className="font-medium text-slate-900"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 20,
                      lineHeight: "24px",
                      color: "#111827",
                    }}
                  >
                    {col.title}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="mt-10 text-center mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "24px",
                color: "#1D293D",
                maxWidth: 590,
              }}
            >
              Factory ensures AI runs at scale — securely, sustainably, and predictably.
            </p>
            {/* Actions — 232×96, padding 24px 0; link to enquiry (no green animation) */}
            <div
              className="flex flex-row items-center justify-center"
              style={{ width: 232, height: 96, padding: "24px 0" }}
            >
              <a
                href="http://localhost:4000/enquiry"
                className="flex items-center justify-center rounded-[4px] text-white hover:opacity-90 transition-opacity no-underline uppercase"
                style={{
                  width: 232,
                  height: 48,
                  background: "#000000",
                  boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.12)",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "21px",
                  letterSpacing: "0.5px",
                }}
              >
                {factoryResultCta}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
