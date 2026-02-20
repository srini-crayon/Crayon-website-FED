"use client";

import { useState } from "react";
import {
  Target,
  Settings,
  Shield,
  LineChart,
} from "lucide-react";
import { SchedulerDialog } from "../catalyst/sections/scheduler-dialog";

/* What Labs Does — Group 1410104288: 5 cards 297.7×183; num + dot + title + description */
const whatLabsDoesCards = [
  { num: "01", color: "#FF9231", title: "High-impact use cases", description: "Identify high-impact, revenue or efficiency-led use cases." },
  { num: "02", color: "#722ED1", title: "Data readiness & integration", description: "Assess data readiness and integration feasibility." },
  { num: "03", color: "#F5319D", title: "Design AI workflows", description: "Design AI workflows aligned to enterprise constraints." },
  { num: "04", color: "#E17100", title: "Rapidly prototype", description: "Rapidly prototype to test assumptions." },
  { num: "05", color: "#8F2B8C", title: "Validate before scale", description: "Validate business value before scale." },
];

/* How It Works — 4 evaluation criteria with icons (same style as Factory Capabilities) */
const howItWorksRows = [
  { icon: Target, label: "Business impact", iconColor: "#4F39F6", circleGradient: "linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 100%)" },
  { icon: Settings, label: "Technical feasibility", iconColor: "#0069A8", circleGradient: "linear-gradient(135deg, #DFF2FE 0%, #FFFFFF 100%)" },
  { icon: Shield, label: "Governance readiness", iconColor: "#A800B7", circleGradient: "linear-gradient(135deg, #FAE8FF 0%, #FFFFFF 100%)" },
  { icon: LineChart, label: "Scalability potential", iconColor: "#009966", circleGradient: "linear-gradient(135deg, #D0FAE5 0%, #FFFFFF 100%)" },
];

/* The Outcome — 4 numbered cards */
const outcomeColumns = [
  { num: "01", barColor: "#1C69E3", textColor: "#1C69E3", title: "A prioritized AI roadmap" },
  { num: "02", barColor: "#4C1D95", textColor: "#4C1D95", title: "Validated use cases" },
  { num: "03", barColor: "#E17100", textColor: "#E17100", title: "Executive alignment" },
  { num: "04", barColor: "#F5319D", textColor: "#F5319D", title: "A clear path to production" },
];

export default function LabsPage() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState<Date | null>(null);

  const handleCta = () => setSchedulerOpen(true);

  const handleSlotConfirm = (slot: Date | null) => {
    setScheduledSlot(slot);
    if (slot) console.info("[Labs Scheduler] Slot:", slot.toISOString());
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
        {/* Hero — 72px gap to next section (3×24px) */}
        <main className="relative min-h-[520px] flex flex-col items-center justify-center px-4 sm:px-6 py-9">
          <div
            className="absolute left-0 top-0 w-full pointer-events-none"
            style={{
              width: "100%",
              maxWidth: 1512,
              height: 520,
              background: "radial-gradient(100% 100% at 50% 0%, #F0E5FF 0%, #FFFFFF 100%)",
            }}
            aria-hidden
          />
          {/* Section content at top */}
          <div
            className="relative z-10 w-full mx-auto text-center flex flex-col items-center justify-center rounded-[4px]"
            style={{ width: "100%", maxWidth: 855, minHeight: 308, opacity: 1, gap: 24 }}
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
              Labs
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
              Discover. Prioritize. Prove.
            </h1>
            <p
              className="flex items-center justify-center text-center max-w-[855px] mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#45556C",
              }}
            >
              Enterprise AI doesn't begin with technology. It begins with clarity. Labs is where enterprises move from scattered AI curiosity to focused, high-impact use cases. It is a structured discovery and experimentation environment designed to answer one critical question:
            </p>
            {/* Group 1410104307: 64px divider; question Poppins 500 #1D293D; paragraph Poppins 400 #45556C */}
            <div className="flex flex-col items-center gap-4 w-full mx-auto" style={{ maxWidth: 644 }}>
              <span className="h-px flex-shrink-0" style={{ width: 64, background: "rgba(69, 85, 108, 0.8)" }} aria-hidden />
              <p
                className="text-center"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#1D293D",
                  maxWidth: 456,
                }}
              >
                Where can AI create measurable business value — now?
              </p>
              <p
                className="flex items-center justify-center text-center max-w-[644px] mx-auto"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#45556C",
                }}
              >
                We help leadership teams cut through noise, identify priority use cases, and rapidly validate ideas before committing enterprise resources.
              </p>
            </div>
          </div>
        </main>

        {/* 1. What Labs Does — 72px gap between sections */}
        <section className="relative w-full min-h-[700px] py-9 px-4 sm:px-6 flex flex-col items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 w-full pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #FAFCFD 0%, #F2F5FF 100%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 w-full mx-auto flex flex-col items-center" style={{ maxWidth: 1244.81 }}>
            {/* Group 1410104275 / 1410104274: 769×134 — label + heading + subtitle; gap to cards ~42px per spec */}
            <div className="text-center mx-auto" style={{ maxWidth: 769, marginBottom: 42 }}>
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
                  What Labs Does
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
                Labs brings direction to experimentation
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
                We work with business and technology teams to:
              </p>
            </div>
            {/* What Labs Does: 5 cards — compact height, more gap between cards (same as Foundry) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full" style={{ maxWidth: 1244.81 }}>
              {whatLabsDoesCards.map((card) => (
                <div
                  key={card.num}
                  className="box-border flex flex-col gap-3 text-left p-4 bg-white"
                  style={{
                    width: "100%",
                    maxWidth: 297.7,
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
            {/* Closing line only — no divider; single line */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <p
                className="text-center whitespace-nowrap"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#1D293D",
                }}
              >
                This is not random experimentation. It is disciplined discovery.
              </p>
            </div>
          </div>
        </section>

        {/* 2. How It Works — 72px gap; no min-height to avoid empty space below */}
        <section className="relative py-9 px-4 sm:px-6 flex flex-col items-center">
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
          <div className="relative z-10 w-full mx-auto flex flex-col items-center" style={{ maxWidth: 1092 }}>
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
                  How It Works
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
                Focused sprints, clear criteria
              </h2>
              <p
                className="text-center mx-auto"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: "24px",
                  color: "#4B5563",
                  maxWidth: 720,
                }}
              >
                Labs engagements typically run in focused sprints. We align stakeholders. Define the opportunity space. Test quickly using Tangram's modular AI capabilities. Validate impact with real users. Every idea is evaluated against:
              </p>
            </div>
            {/* Group 1410104281: 1092×156 — 4 items, each 180px; 72×72 circle gradient 135deg; icon 28×28; label Poppins 400 16px #1D293D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center" style={{ maxWidth: 1092, minHeight: 156 }}>
              {howItWorksRows.map((row) => (
                <div key={row.label} className="flex flex-col items-center text-center flex-none" style={{ width: 180 }}>
                  <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full shrink-0 mb-3"
                    style={{ background: row.circleGradient, borderRadius: "50%" }}
                  >
                    <row.icon className="h-7 w-7 shrink-0" style={{ color: row.iconColor }} aria-hidden />
                  </div>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 16,
                      lineHeight: "24px",
                      color: "#1D293D",
                      width: 180,
                    }}
                  >
                    {row.label}
                  </p>
                </div>
              ))}
            </div>
            {/* Container: 64px divider (same as Factory) */}
            <div className="mt-12 flex flex-col items-center gap-4" style={{ maxWidth: 690 }}>
              <span className="h-px" style={{ width: 64, background: "rgba(226, 232, 240, 0.8)" }} aria-hidden />
            </div>
          </div>
        </section>

        {/* 3. The Outcome — 72px gap */}
        <section className="py-9 px-4 sm:px-6 bg-white flex flex-col items-center">
          <div className="w-full mx-auto flex flex-col items-center" style={{ maxWidth: 1284, minHeight: 449.5 }}>
            {/* Group 1410104304 — label + heading; wider so heading wraps to 2 lines */}
            <div className="text-center mb-10 mx-auto" style={{ maxWidth: 560, minHeight: 105.5 }}>
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
                  The Outcome
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
                Ready to move from ideas to validated use cases?
              </h2>
            </div>
            {/* Background: flex row, gap 24px, 1284×180; cards 303×180, border-left, 3×16 bar, Geist Mono 12px, Inter 500 20px #111827 */}
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
              Labs ensures AI starts with purpose — not pilots without direction.
            </p>
            {/* Actions — Group spec: 232×96, padding 24px 0; link to enquiry */}
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
                Talk to an expert
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
