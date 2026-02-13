"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Layers, Rocket, Search, Settings } from "lucide-react";
import HeroCta from "../../components/HeroCta";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

type PillShape = "circle" | "triangle" | "square";

type PillItem = {
  label: string;
  shape: PillShape;
  color: string;
};

function renderTag(item: PillItem, key: string) {
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
      {item.shape === "circle" && (
        <div className="shrink-0 rounded-full" style={{ backgroundColor: item.color, width: "12px", height: "12px" }} />
      )}
      {item.shape === "triangle" && (
        <div
          className="shrink-0"
          style={{
            backgroundColor: item.color,
            width: "12px",
            height: "12px",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          }}
        />
      )}
      {item.shape === "square" && (
        <div className="shrink-0 rounded" style={{ backgroundColor: item.color, width: "12px", height: "12px" }} />
      )}
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "20px",
          color: "#344054",
        }}
      >
        {item.label}
      </span>
    </div>
  );
}

export default function TangramAIPage() {
  const DEPLOY_PART1 = "Built to integrate and govern";
  const DEPLOY_PART2 = "Scale across the enterprise.";
  const deployColorGreen = "#22C55E";
  const deployColorPink = "#EC4899";
  // deployPhase: 0 = typing green, 1 = deleting green, 2 = typing pink, 3 = deleting pink
  const [deployPhase, setDeployPhase] = useState(0);
  const [deployTyped, setDeployTyped] = useState("");
  const [whatYouGetExpanded, setWhatYouGetExpanded] = useState<string>("01");

  // Rotate gradient animation for hero CTA button (match ISV page)
  useEffect(() => {
    const element = document.querySelector(".hero-cta-border-gradient") as HTMLElement;
    if (!element) return;
    let angle = 0;
    let animationFrameId: number;
    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      animationFrameId = requestAnimationFrame(rotateGradient);
    };
    rotateGradient();
    return () => animationFrameId != null && cancelAnimationFrame(animationFrameId);
  }, []);

  // Deploy line: green part types then deletes to empty, then pink part types then deletes; repeat
  useEffect(() => {
    const isGreen = deployPhase === 0 || deployPhase === 1;
    const target = isGreen ? DEPLOY_PART1 : DEPLOY_PART2;
    const doneTyping = deployTyped === target && deployPhase === 0;
    const doneDeletingGreen = deployTyped === "" && deployPhase === 1;
    const doneTypingPink = deployTyped === target && deployPhase === 2;
    const doneDeletingPink = deployTyped === "" && deployPhase === 3;

    const timeout = window.setTimeout(
      () => {
        if (doneTyping) {
          setDeployPhase(1); // start deleting green
          return;
        }
        if (doneDeletingGreen) {
          setDeployPhase(2); // start typing pink
          return;
        }
        if (doneTypingPink) {
          setDeployPhase(3); // start deleting pink
          return;
        }
        if (doneDeletingPink) {
          setDeployPhase(0); // start typing green again
          return;
        }
        const next =
          deployPhase === 1 || deployPhase === 3
            ? deployTyped.slice(0, Math.max(0, deployTyped.length - 1))
            : target.slice(0, deployTyped.length + 1);
        setDeployTyped(next);
      },
      doneTyping || doneTypingPink ? 1200 : doneDeletingGreen || doneDeletingPink ? 0 : deployPhase === 1 || deployPhase === 3 ? 25 : 45
    );

    return () => window.clearTimeout(timeout);
  }, [deployPhase, deployTyped]);

  const capabilityPills: PillItem[] = useMemo(
    () => [
      { label: "Conversational AI & Advisory", shape: "circle", color: "#10B981" },
      { label: "Document Passing & Analysis", shape: "triangle", color: "#3B82F6" },
      { label: "image processing", shape: "square", color: "#FBBF24" },
      { label: "Video Processing", shape: "circle", color: "#1D4ED8" },
      { label: "Voice and Meeting", shape: "triangle", color: "#F59E0B" },
      { label: "Data Analysis and Insights", shape: "circle", color: "#F43F5E" },
      { label: "Content generation", shape: "circle", color: "#9333EA" },
      { label: "Process Automation", shape: "triangle", color: "#4F46E5" },
      { label: "Data Transformation", shape: "square", color: "#34D399" },
    ],
    []
  );

  const agentPills: PillItem[] = useMemo(
    () => [
      { label: "Code Assist", shape: "circle", color: "#A3A3A3" },
      { label: "KYC Genie", shape: "square", color: "#34D399" },
      { label: "CXO Concierge", shape: "circle", color: "#1D4ED8" },
      { label: "Travel AI", shape: "triangle", color: "#7C3AED" },
      { label: "Personal Finance Assistant", shape: "circle", color: "#F43F5E" },
      { label: "Image Data Extraction Assistant", shape: "square", color: "#FBBF24" },
      { label: "Wealth RM Assistant", shape: "circle", color: "#FB7185" },
      { label: "RFP Response Generator", shape: "triangle", color: "#F59E0B" },
      { label: "Accounts Payable Automation", shape: "square", color: "#10B981" },
      { label: "Requirement Analyst", shape: "circle", color: "#1D4ED8" },
      { label: "Policy Compliance Analyst", shape: "circle", color: "#F43F5E" },
      { label: "Voice Based Mobile Banking", shape: "square", color: "#FBBF24" },
      { label: "Corporate Transaction Advisor", shape: "circle", color: "#F43F5E" },
      { label: "Best Data Management", shape: "square", color: "#10B981" },
    ],
    []
  );

  const duplicatedCaps = useMemo(() => [...capabilityPills, ...capabilityPills, ...capabilityPills], [capabilityPills]);
  const duplicatedAgents = useMemo(() => [...agentPills, ...agentPills, ...agentPills, ...agentPills], [agentPills]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-screen flex flex-col justify-center"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 60%, #F7F3FF 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(38% 22% at 50% 78%, rgba(132, 102, 255, 0.18) 0%, rgba(255,255,255,0) 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1100px] px-6 pb-16 pt-12 md:pt-16 text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <Image
              src="/img/tangram-logo.svg"
              alt="tangram.ai"
              width={150}
              height={40}
              priority
              style={{ height: 36, width: "auto" }}
            />
          </div>

          <div
            className="mx-auto mb-6 h-px w-12 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #D1D5DB, transparent)" }}
            aria-hidden
          />

          <h1
            className="mx-auto text-balance"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "56px",
              lineHeight: "62px",
              color: "#0B1B1A",
            }}
          >
            Accelerate AI Success
          </h1>

          <p
            className="mx-auto mt-5 max-w-3xl text-balance"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "26px",
              lineHeight: "34px",
              color: "#0B1B1A",
            }}
          >
            From idea to impact — without rebuilding from scratch.
          </p>

          <p
            className="mx-auto mt-2 max-w-3xl"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "26px",
              lineHeight: "34px",
              color: "#0B1B1A",
            }}
          >
            Deploy modular, production-grade AI agents —{" "}
            {deployPhase === 0 || deployPhase === 1 ? (
              <>
                <span style={{ display: "inline", fontWeight: 600, color: deployColorGreen }}>
                  {deployTyped}
                </span>
                <span aria-hidden="true" className="stream-cursor" style={{ background: deployColorGreen }} />
              </>
            ) : (
              <>
                <span style={{ display: "inline", fontWeight: 600, color: deployColorPink }}>
                  {deployTyped}
                </span>
                <span aria-hidden="true" className="stream-cursor" style={{ background: deployColorPink }} />
              </>
            )}
          </p>

          <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-3">
            <div className="overflow-hidden relative">
              <div
                className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: "100px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: "100px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }}
              />
              <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "150s" }}>
                {duplicatedCaps.map((c, i) => renderTag(c, `cap-${i}`))}
              </div>
            </div>
            <div className="overflow-hidden relative">
              <div
                className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: "100px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }}
              />
              <div
                className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
                style={{ width: "100px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }}
              />
              <div
                className="flex gap-3 animate-scroll-tags-reverse"
                style={{ width: "fit-content", animationDuration: "180s" }}
              >
                {duplicatedAgents.map((c, i) => renderTag(c, `agent-${i}`))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center items-center gap-4 scale-in scale-in-visible">
            <Link
              href="/agents"
              className="hero-cta-border-gradient border-gradient relative text-white rounded-[4px] px-[28px] transition-all"
              style={{
                willChange: "transform",
                display: "flex",
                height: "48px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "normal",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                position: "relative",
                padding: "20px 28px",
                boxShadow: "0 0 20px rgba(255, 109, 27, 0.3), 0 0 40px rgba(75, 138, 255, 0.2), 0 0 60px rgba(107, 95, 255, 0.1)",
                "--gradient-angle": "0deg",
                border: "none",
                outline: "none",
                cursor: "pointer",
                opacity: 1,
              } as React.CSSProperties & { "--gradient-angle"?: string }}
            >
              <span
                style={{
                  position: "relative",
                  zIndex: 10,
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                See Tangram in Action
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tangram Is Already in Production */}
      <section
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center fade-in-visible"
        style={{ background: "#F9FAFB" }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-balance fade-in-blur fade-in-blur-visible"
              style={{
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "39.2px",
                letterSpacing: "-0.56px",
                marginBottom: "16px",
                background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Tangram Is Already in Production
            </h2>
            <p
              className="fade-in-section fade-in-visible mx-auto max-w-3xl"
              style={{
                color: "#111827",
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
              }}
            >
              This isn&apos;t a beta. Tangram is live, running, and delivering impact inside large enterprises.
            </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white text-left">
              <div className="p-0">
                <Image src="/img/deployment1.svg" alt="" width={920} height={420} unoptimized className="w-full h-auto" />
              </div>
              <div
                className="px-6 pb-6 pt-5"
                style={{
                  color: "#111827",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                LIVE in Production and 12+ POCs in flight across banking, Retail, commerce, and operations.
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white text-left">
              <div className="p-0">
                <Image src="/Section_6_2.png" alt="" width={920} height={420} className="w-full h-auto" />
              </div>
              <div
                className="px-6 pb-6 pt-5"
                style={{
                  color: "#111827",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                15–22% uplift in customer experience through personalization
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white text-left">
              <div className="p-0">
                <Image src="/Section_6_3.png" alt="" width={920} height={420} className="w-full h-auto" />
              </div>
              <div
                className="px-6 pb-6 pt-5"
                style={{
                  color: "#111827",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                40% lower drop-offs through agent-driven onboarding
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#E5E7EB] bg-white text-left">
              <div className="p-0">
                <Image src="/Section_6_4.png" alt="" width={920} height={420} className="w-full h-auto" />
              </div>
              <div
                className="px-6 pb-6 pt-5"
                style={{
                  color: "#111827",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                60% reduction in manual effort with chained agents
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-[#E5E7EB] pt-12">
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "-0.48px",
                textAlign: "center",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              Built for Real-World Load
            </h3>
            <p
              className="mx-auto max-w-3xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#6B7280",
              }}
            >
              These aren&apos;t sandbox experiments — they&apos;re high-volume journeys, complex workflows, and mission-critical operations now
              running on Tangram.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { t: "High-Volume Journeys", bg: "#EAF2FF", c: "#2563EB" },
                { t: "Complex Workflows", bg: "#EEF2FF", c: "#4F46E5" },
                { t: "Mission-Critical Operations", bg: "#F5F3FF", c: "#7C3AED" },
              ].map((p) => (
                <span
                  key={p.t}
                  className="rounded-full border border-[#E5E7EB] px-4 py-2"
                  style={{
                    background: p.bg,
                    color: p.c,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {p.t}
                </span>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* AI success made easy */}
      <section
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center fade-in-visible"
        style={{ background: "#F9FAFB" }}
      >
        <div className="mx-auto w-full max-w-[1100px] px-6 text-center">
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: 32,
                lineHeight: "40px",
                background: "linear-gradient(90deg, #F05283 0%, #8F2B8C 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                marginBottom: 6,
              }}
            >
              AI success made easy.
            </h2>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: "24px",
                color: "#111827",
              }}
            >
              Find. Try. Pick. Launch.
            </p>

          <div className="mt-12 flex flex-col md:flex-row md:items-stretch md:justify-center md:gap-0 w-full">
            {[
              {
                title: "Find Your Use Case",
                desc: "Explore ready-made industry use cases.",
                icon: <Search size={26} />,
                glow: "rgba(139, 92, 246, 0.18)",
                iconBg: "rgba(124, 58, 237, 0.12)",
                iconColor: "#7C3AED",
              },
              {
                title: "Try an agent",
                desc: "Test the right AI copilot for your need.",
                icon: <Layers size={26} />,
                glow: "rgba(236, 72, 153, 0.16)",
                iconBg: "rgba(236, 72, 153, 0.10)",
                iconColor: "#EC4899",
              },
              {
                title: "Pick your stack",
                desc: "Choose your preferred platform or model.",
                icon: <Settings size={26} />,
                glow: "rgba(245, 158, 11, 0.16)",
                iconBg: "rgba(245, 158, 11, 0.10)",
                iconColor: "#B45309",
              },
              {
                title: "Launch your trial",
                desc: "Experience the future of work in minutes.",
                icon: <Rocket size={26} />,
                glow: "rgba(16, 185, 129, 0.16)",
                iconBg: "rgba(16, 185, 129, 0.10)",
                iconColor: "#047857",
              },
            ].map((card, index) => (
              <span key={card.title} className="flex items-stretch md:items-center">
                {index > 0 && (
                  <span
                    className="hidden md:block shrink-0 self-center"
                    style={{
                      width: "clamp(20px, 4vw, 40px)",
                      minWidth: 20,
                      height: 2,
                      borderRadius: 1,
                      background: "linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)",
                    }}
                    aria-hidden
                  />
                )}
                <Card
                  className="rounded-[24px] border border-[#E5E7EB] bg-white py-0 shadow-none md:flex-1 md:min-w-0"
                >
                  <CardContent className="px-6 py-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full"
                        style={{
                          background: card.iconBg,
                          boxShadow: `0 18px 40px ${card.glow}`,
                          color: card.iconColor,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          lineHeight: "20px",
                          color: "#111827",
                          marginBottom: 6,
                        }}
                      >
                        {card.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          lineHeight: "18px",
                          color: "#6B7280",
                        }}
                      >
                        {card.desc}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Tangram */}
      <section
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center fade-in-visible"
        style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F7F0E8 76.44%, #FAFAFA 100%)" }}
      >
        <div className="mx-auto w-full max-w-[1100px] px-6 text-center">
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 28,
              lineHeight: "36px",
              background: "linear-gradient(90deg, #F05252 0%, #FF9231 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              marginBottom: 10,
            }}
          >
            Why Choose Tangram?
          </h2>
          <p
            className="fade-in-section fade-in-visible mx-auto max-w-3xl"
            style={{
              color: "#111827",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "24px",
            }}
          >
            The Problem isn't the Model. It's the Last Mile. Most AI platforms stop at "cool demos." Tangram is built to cut costs
            and create lift - in production.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { text: "API-native agents that integrate with your stack — instantly", img: "/card1.png", tint: "#FDE8EF" },
              { text: "Designed for large, complex operations", img: "/card2.png", tint: "#EEF2FF" },
              { text: "Faster GTM. Lighter lift. Multipliers everywhere.", img: "/card3.png", tint: "#ECFDF5" },
            ].map((c) => (
              <Card key={c.text} className="overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white py-0 shadow-none">
                <div className="p-5" style={{ background: c.tint }}>
                  <Image src={c.img} alt="" width={860} height={520} className="w-full h-auto" />
                </div>
                <div className="px-6 py-6">
                  <p
                    style={{
                      color: "#111827",
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "25.5px",
                    }}
                  >
                    {c.text}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-start bg-white fade-in-visible">
        <div className="mx-auto w-full max-w-[1100px] px-6">
          <div className="text-center">
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: 28,
                lineHeight: "36px",
                background: "linear-gradient(90deg, #8F2B8C 0%, #614BDB 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                marginBottom: 10,
              }}
            >
              What You Get with Tangram.ai?
            </h2>
            <p
              className="mb-18 max-w-4xl md:max-w-5xl w-full px-4 sm:px-6 mx-auto fade-in-section fade-in-visible"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#111827",
                textAlign: "center",
                fontStyle: "normal",
              }}
            >
              Tangram isn't a tool - it's a platform for GenAI adoption. With Tangram, enterprises unlock
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {[
                { id: "01", n: "01.", t: "Composability", desc: "AI you can plug in anywhere — across systems, teams, or journeys.", img: "/img/Composability.svg" },
                { id: "02", n: "02.", t: "Agentic Workflows", desc: "Automated workflows that adapt and learn from your business processes.", img: "/img/Agentic Workflows.svg" },
                { id: "03", n: "03.", t: "Faster Time-to-Value", desc: "Deploy AI solutions in days, not months, with pre-built components.", img: "/img/Faster Time-to-Value.svg" },
                { id: "04", n: "04.", t: "Lower TCO", desc: "Reduce total cost of ownership with efficient, scalable AI infrastructure.", img: "/img/Lower TCO.svg" },
                { id: "05", n: "05.", t: "Enterprise-Grade Deployment", desc: "Production-ready AI with security, compliance, and governance built-in.", img: "/img/Enterprise-Grade Deployment.svg" },
              ].map((item) => {
                const isExpanded = whatYouGetExpanded === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setWhatYouGetExpanded(item.id)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setWhatYouGetExpanded(item.id))}
                    className="cursor-pointer border-b border-[#E5E7EB]"
                    style={{
                      width: "100%",
                      paddingTop: 26,
                      paddingRight: 24,
                      paddingBottom: 24,
                      paddingLeft: 26,
                      backgroundColor: "transparent",
                      boxSizing: "border-box",
                      transition: "opacity 0.2s ease-in-out",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        style={{
                          display: "inline-block",
                          width: 44,
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          fontSize: 17,
                          lineHeight: "24px",
                          color: isExpanded ? "#FF9231" : "#9CA3AF",
                        }}
                      >
                        {item.n}
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: 17,
                            lineHeight: "24px",
                            color: isExpanded ? "#111827" : "#6B7280",
                          }}
                        >
                          {item.t}
                        </div>
                        <div
                          className="transition-all duration-300 ease-out"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontSize: 15,
                            lineHeight: "22px",
                            color: "#374151",
                            opacity: isExpanded ? 1 : 0,
                            maxHeight: isExpanded ? 80 : 0,
                            overflow: "hidden",
                            marginTop: 6,
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative w-full overflow-hidden rounded-[8px] bg-white flex items-center justify-center">
              {(() => {
                const activeItem = [
                  { id: "01", img: "/img/Composability.svg", alt: "Tangram.ai - Composability" },
                  { id: "02", img: "/img/Agentic Workflows.svg", alt: "Tangram.ai - Agentic Workflows" },
                  { id: "03", img: "/img/Faster Time-to-Value.svg", alt: "Tangram.ai - Faster Time-to-Value" },
                  { id: "04", img: "/img/Lower TCO.svg", alt: "Tangram.ai - Lower TCO" },
                  { id: "05", img: "/img/Enterprise-Grade Deployment.svg", alt: "Tangram.ai - Enterprise-Grade Deployment" },
                ].find((item) => item.id === whatYouGetExpanded) || { img: "/img/Composability.svg", alt: "Tangram.ai - Composability" };
                return (
                  <Image
                    key={whatYouGetExpanded}
                    src={activeItem.img}
                    alt={activeItem.alt}
                    width={560}
                    height={527}
                    className="object-contain transition-opacity duration-300"
                    style={{ color: "transparent", width: 560, height: 527 }}
                    unoptimized
                  />
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-white fade-in-section fade-in-visible py-16 md:py-20 lg:py-24 min-h-[70vh] flex items-center">
        <div className="text-center w-full px-8 md:px-12 lg:px-16">
            <h2
              className="max-w-xl mx-auto whitespace-nowrap"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: 32,
                lineHeight: "normal",
                textAlign: "center",
                background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Accelerate growth with Tangram.ai
            </h2>
            <p
              className="mb-18 max-w-4xl md:max-w-5xl w-full px-4 sm:px-6 mx-auto fade-in-section fade-in-visible"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "24px",
                color: "#111827",
                textAlign: "center",
                fontStyle: "normal",
              }}
            >
              Our Partners are at the forefront of Enterprise AI transformation, and their success stories speak volumes. By partnering
              with Tangram.ai, they have helped businesses like yours reimagine how work gets done, service is delivered, and processes
              are automated, delivering real business value with AI.
            </p>
            <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-start md:justify-center md:gap-12">
              {[
                {
                  bg: "url('/img/Acceleratecardbg.svg')",
                  tag: "JOIN AS AN ISV PARTNER",
                  title: "Tangram.ai ISV",
                  desc: "Our partners are certified Tangram.ai channel partners, technology partners, or independent software vendors (ISV).",
                  cta: "BECOME A ISV",
                  href: "/tangram-ai-isv",
                },
                {
                  bg: "url('/img/Acceleratecardbg1.svg')",
                  tag: "JOIN AS A RESELLER PARTNER",
                  title: "Tangram.ai Reseller",
                  desc: "Our Reseller program allows you to access Tangram.ai resources, support and professional services for your projects.",
                  cta: "BECOME A RESELLER",
                  href: "/tangram-ai-reseller",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="relative overflow-hidden rounded-[8px] p-10 text-left w-full min-h-[320px]"
                  style={{
                    backgroundImage: c.bg,
                    backgroundSize: "100% auto",
                    backgroundPosition: "center top",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div
                    className="inline-flex items-center rounded-[4px] bg-white px-4 py-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: 11,
                      letterSpacing: "0.8px",
                      color: "#111827",
                      textTransform: "uppercase",
                      marginBottom: 14,
                    }}
                  >
                    {c.tag}
                  </div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: 24,
                      color: "#111827",
                      marginBottom: 6,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      lineHeight: "18px",
                      color: "#6B7280",
                      maxWidth: 430,
                      marginBottom: 22,
                    }}
                  >
                    {c.desc}
                  </div>
                  <Button
                    asChild
                    className="h-9 rounded-[4px] bg-black text-white hover:bg-black/90 uppercase tracking-[0.6px] text-[12px]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <Link href={c.href}>{c.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* Final CTA */}
      <HeroCta variant="striped" showPill={false} />
    </div>
  );
}
