"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import type * as Content from "./content";
import { cn } from "../../../lib/utils";
import {
  Boxes,
  Check,
  FlaskConical,
  Globe,
  Hourglass,
  Layers,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

type HeroContentType = typeof Content.heroContent;
type ProblemContentType = typeof Content.problemContent;
type WhyExistsContentType = typeof Content.whyExistsContent;
type DefinitionContentType = typeof Content.definitionContent;
type JourneyPathsType = typeof Content.journeyPaths;
type ExecutionLoopContentType = typeof Content.executionLoopContent;
type WhyChooseContentType = typeof Content.whyChooseContent;
type ModelTabsContentType = typeof Content.modelTabsContent;
type ReverseBuildContentType = typeof Content.reverseBuildContent;
type MaturityContentType = typeof Content.maturityContent;
type TwinEngineContentType = typeof Content.twinEngineContent;
type ProofPromiseContentType = typeof Content.proofPromiseContent;

type TalkHandler = () => void;

const primaryCtaClasses =
  "border-gradient relative text-white rounded-[4px] px-[28px] transition-transform duration-200 hover:scale-[1.02] flex h-12 items-center justify-center font-medium text-[14px] leading-none shadow-[0_12px_30px_rgba(0,0,0,0.12)]";
const secondaryCtaClasses =
  "px-5 py-3 text-sm shadow-[0_8px_20px_rgba(0,0,0,0.08)] transition-transform duration-150 hover:-translate-y-0.5 h-12";

const GradientButton = ({
  children,
  onClick,
  href,
  target,
  rel,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}) => {
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cn(primaryCtaClasses, className)}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cn(primaryCtaClasses, className)}>
      {children}
    </button>
  );
};

const SectionShell = ({
  id,
  eyebrow,
  title,
  subtitle,
  headerLayout = "left",
  titleClassName,
  titleStyle,
  subtitleClassName,
  subtitleStyle,
  children,
  background = "bg-white",
  sectionClassName,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  headerLayout?: "left" | "center";
  titleClassName?: string;
  titleStyle?: CSSProperties;
  subtitleClassName?: string;
  subtitleStyle?: CSSProperties;
  children: ReactNode;
  background?: string;
  sectionClassName?: string;
}) => (
  <section id={id} className={cn(background, sectionClassName ?? "py-16")}>
    <div className="mx-auto max-w-6xl px-6 space-y-6">
      {(eyebrow || title || subtitle) && (
        <div
          className={
            headerLayout === "center"
              ? "text-center flex flex-col gap-3 items-center"
              : "space-y-2 text-left"
          }
        >
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{eyebrow}</p>}
          {title && (
            <h2
              className={cn("text-3xl font-semibold md:text-4xl", headerLayout === "center" ? "text-[#161d26]" : "text-slate-900", titleClassName)}
              style={titleStyle}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn("max-w-3xl text-base text-slate-600", subtitleClassName)}
              style={subtitleStyle}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  </section>
);

export function HeroSection({
  data,
  onTalkToExpert,
}: {
  data: HeroContentType;
  onTalkToExpert: TalkHandler;
}) {
  return (
    <section className="relative overflow-hidden bg-white min-h-screen" id="hero">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
        }}
      />
      <div
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-10 text-center"
        style={{
          paddingInline: "32px",
        }}
      >
        <div className="space-y-4 text-center">
          {data.eyebrow ? (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
              {data.eyebrow}
            </p>
          ) : null}
          <div className="space-y-3 mx-auto text-center">
            <h1
              className="mb-4 text-center fade-in-blur fade-in-blur-visible"
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "42px",
                lineHeight: "48px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                maxWidth: "920px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "18px",
                willChange: "opacity, transform, filter",
              }}
            >
              {data.title}
            </h1>
            <p className="max-w-3xl text-lg font-semibold text-slate-800 mx-auto">{data.subtitle}</p>
            <p className="max-w-3xl text-base text-slate-600 mx-auto">{data.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <GradientButton onClick={onTalkToExpert}>{data.primaryCta}</GradientButton>
            <Button asChild variant="outline" className={secondaryCtaClasses}>
              <Link href="https://crayondata.ai/tangram" target="_blank" rel="noreferrer">
                {data.secondaryCta}
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}

export function ProblemStatementSection({ data }: { data: ProblemContentType }) {
  const getProblemIcon = (text: string) => {
    const normalized = text.toLowerCase()
    if (normalized.includes("isolated") || normalized.includes("pilot")) return Boxes
    if (normalized.includes("poc")) return FlaskConical
    if (normalized.includes("experiment")) return Hourglass
    if (normalized.includes("governance") || normalized.includes("compliance")) return ShieldCheck
    if (normalized.includes("adoption") || normalized.includes("user")) return Users
    return Boxes
  }

  const getProblemIconClasses = (text: string) => {
    const normalized = text.toLowerCase()
    if (normalized.includes("isolated") || normalized.includes("pilot")) {
      return { wrap: "bg-gradient-to-br from-indigo-100 to-white", icon: "text-indigo-600" }
    }
    if (normalized.includes("poc")) {
      return { wrap: "bg-gradient-to-br from-emerald-100 to-white", icon: "text-emerald-600" }
    }
    if (normalized.includes("experiment")) {
      return { wrap: "bg-gradient-to-br from-amber-100 to-white", icon: "text-amber-700" }
    }
    if (normalized.includes("governance") || normalized.includes("compliance")) {
      return { wrap: "bg-gradient-to-br from-sky-100 to-white", icon: "text-sky-700" }
    }
    if (normalized.includes("adoption") || normalized.includes("user")) {
      return { wrap: "bg-gradient-to-br from-fuchsia-100 to-white", icon: "text-fuchsia-700" }
    }
    return { wrap: "bg-gradient-to-br from-slate-100 to-white", icon: "text-slate-700" }
  }

  return (
    <SectionShell
      id="problem"
      title={data.title}
      subtitle={data.intro}
      headerLayout="center"
      titleClassName="fade-in-blur fade-in-blur-visible text-transparent bg-clip-text bg-gradient-to-r from-[#4c1d95] to-[#6b21a8] w-[720px] max-w-full"
      titleStyle={{ fontFamily: "Poppins" }}
      subtitleClassName="fade-in-section fade-in-visible text-sm md:text-base text-[#4b5563] text-center max-w-[780px] mx-auto"
      subtitleStyle={{ fontFamily: "Poppins" }}
      background="bg-gradient-to-b from-[#F8FAFC] to-white"
      sectionClassName="py-16 min-h-screen flex items-center"
    >
      <div className="pt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 items-center justify-center">
        {data.bullets.map((bullet, index) => {
          const normalized =
            typeof bullet === "string"
              ? (() => {
                  const [maybeTitle, ...rest] = bullet.split(":")
                  const title = (maybeTitle || "").trim()
                  const description = rest.join(":").trim() || title
                  return { title, description }
                })()
              : bullet

          const iconText = normalized.title || normalized.description
          const key = `${index}-${normalized.description}`
          const Icon = getProblemIcon(iconText)
          const iconClasses = getProblemIconClasses(iconText)

          return (
            <div key={key} className="flex flex-col items-center text-center gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  iconClasses.wrap
                )}
              >
                <Icon size={22} className={iconClasses.icon} aria-hidden />
              </div>
              <p className="text-sm md:text-base font-medium text-slate-800 max-w-[220px]">
                {normalized.description}
              </p>
            </div>
          )
        })}
      </div>
      {data.afterGridText ? (
        <p
          className="mt-12 text-center text-sm md:text-base text-slate-800 max-w-[690px] mx-auto before:content-[''] before:block before:h-px before:w-16 before:bg-slate-200/80 before:mx-auto before:mb-4"
          style={{ fontFamily: "Poppins" }}
        >
          {(() => {
            const match = data.afterGridText.match(/^(.+?[.!?])\s*(.*)$/)
            if (!match) return data.afterGridText

            const [, firstSentence, rest] = match
            if (!rest) return firstSentence

            return (
              <>
                <span className="font-medium">{firstSentence}</span> {rest}
              </>
            )
          })()}
        </p>
      ) : null}
    </SectionShell>
  );
}

export function WhyExistsSection({ data }: { data: WhyExistsContentType }) {
  const renderHighlightedParagraph = (text: string): ReactNode => {
    const phrases = ["platforms alone don’t create outcomes", "That’s why we built Catalyst"]

    let nodes: ReactNode[] = [text]
    phrases.forEach((phrase) => {
      nodes = nodes.flatMap((node) => {
        if (typeof node !== "string") return [node]

        const parts = node.split(phrase)
        if (parts.length === 1) return [node]

        const next: ReactNode[] = []
        parts.forEach((part, idx) => {
          if (part) next.push(part)
          if (idx < parts.length - 1) {
            next.push(
              <span key={`${phrase}-${idx}`} className="font-semibold text-[1.06em]">
                {phrase}
              </span>
            )
          }
        })
        return next
      })
    })

    return <>{nodes}</>
  }

  return (
    <SectionShell
      id="insights"
      sectionClassName="pt-16 pb-0"
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center max-w-5xl pt-6 text-left">
        <div className="space-y-4" style={{ fontFamily: "Poppins" }}>
          <h2
            className="text-3xl font-semibold md:text-4xl fade-in-blur fade-in-blur-visible text-transparent bg-clip-text bg-gradient-to-r from-[#4c1d95] to-[#6b21a8] max-w-full leading-tight text-left"
            style={{ fontFamily: "Poppins" }}
          >
            {data.title}
          </h2>
          <div className="space-y-4 text-slate-600">
            {data.body.map((paragraph) => (
              <p key={paragraph} className="text-sm md:text-base text-left">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="relative flex flex-wrap gap-4 justify-end items-center min-h-[120px]">
          {"pills" in data && Array.isArray(data.pills)
            ? data.pills.map((label: string, index: number) => {
                const offsets = [
                  { x: 0, y: 0 },
                  { x: 12, y: -14 },
                  { x: -8, y: 10 },
                  { x: 6, y: 8 },
                ]
                const { x, y } = offsets[index % offsets.length]
                const shapes = ["dot", "square", "triangle"] as const
                const shape = shapes[index % shapes.length]
                const shapeEl =
                  shape === "dot" ? (
                    <span className="inline-block w-3 h-3 rounded-full bg-violet-500 shrink-0 mr-2.5" aria-hidden />
                  ) : shape === "square" ? (
                    <span className="inline-block w-3 h-3 bg-amber-500 shrink-0 mr-2.5 rounded-sm" aria-hidden />
                  ) : (
                    <span className="inline-block w-0 h-0 border-l-[7px] border-r-[7px] border-b-[12px] border-l-transparent border-r-transparent border-b-emerald-500 shrink-0 mr-2.5" aria-hidden />
                  )
                return (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full bg-white pl-3 pr-4 py-2 text-sm font-medium text-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60"
                    style={{
                      fontFamily: "Poppins",
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    {shapeEl}
                    {label}
                  </span>
                )
              })
            : null}
        </div>
      </div>
    </SectionShell>
  );
}

const definitionIcons: Record<string, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  search: Search,
  globe: Globe,
  layers: Layers,
  rocket: Rocket,
}

export function DefinitionSection({
  data,
  onTalkToExpert,
}: {
  data: DefinitionContentType;
  onTalkToExpert: TalkHandler;
}) {
  const benefits = "benefits" in data && Array.isArray(data.benefits) ? data.benefits : []
  const subtitle = "subtitle" in data ? (data as { subtitle?: string }).subtitle : ""
  const closingSentence = "closingSentence" in data ? (data as { closingSentence?: string }).closingSentence : ""

  return (
    <SectionShell
      id="definition"
      title={data.title}
      subtitle={subtitle}
      headerLayout="center"
      titleClassName="text-[#4c1d95]"
      titleStyle={{ fontFamily: "Poppins" }}
      subtitleClassName="text-slate-600 max-w-2xl mx-auto"
      sectionClassName="pt-16 pb-16 min-h-screen flex items-center"
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pt-6">
        {benefits.map((item: { icon: string; text: string }, index: number) => {
          const Icon = definitionIcons[item.icon] ?? Sparkles
          const iconColor =
            item.icon === "search"
              ? "text-[#4c1d95] bg-violet-50"
              : item.icon === "globe"
                ? "text-orange-500 bg-orange-50"
                : item.icon === "layers"
                  ? "text-pink-500 bg-pink-50"
                  : "text-emerald-500 bg-emerald-50"
          const isLast = index === benefits.length - 1
          return (
            <div key={item.text} className={cn("flex flex-col", !isLast && "border-r border-slate-200 pr-6")}>
              <div
                className="rounded-2xl bg-white p-7 flex flex-col items-center text-center gap-4"
                style={{ fontFamily: "Poppins" }}
              >
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", iconColor)}>
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <p className="text-sm font-medium text-slate-800">{item.text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-12 mt-8 pt-10 pb-10 border-t border-b border-slate-200">
        {closingSentence ? (
          <p className="text-left text-sm md:text-base font-medium text-slate-600 max-w-[780px] min-w-0 whitespace-pre-line my-1" style={{ fontFamily: "Poppins" }}>
            {closingSentence}
          </p>
        ) : null}
        <GradientButton onClick={onTalkToExpert} className="shadow-none hover:shadow-none hover:scale-100 shrink-0">
          {data.cta}
        </GradientButton>
      </div>
    </SectionShell>
  );
}

export function JourneySelectorSection({
  paths,
  onTalkToExpert,
}: {
  paths: JourneyPathsType;
  onTalkToExpert: TalkHandler;
}) {
  return (
    <SectionShell
      id="journey"
      eyebrow="AI Maturity Selector"
      title="Where are you today?"
      subtitle="Catalyst meets you where you are and moves you forward without stalled pilots or wasted effort."
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {paths.map((path) => (
          <div key={path.name} className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{path.name}</p>
              <p className="text-base font-medium text-slate-900">{path.context}</p>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-800">Common situations</p>
              <ul className="list-disc space-y-1 pl-4">
                {path.situations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 rounded-xl bg-blue-50 p-4 text-sm text-slate-800">
              <p className="font-semibold text-blue-900">What Catalyst helps you do</p>
              <ul className="list-disc space-y-1 pl-4">
                {path.helps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-200 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">Best starting point</p>
                <p className="text-sm font-medium text-slate-900">{path.startingPoint}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
                onClick={onTalkToExpert}
              >
                Talk to us
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function ExecutionLoopSection({ data }: { data: ExecutionLoopContentType }) {
  return (
    <SectionShell
      id="loop"
      title={data.title}
      subtitle={data.description}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {data.stages.map((stage) => (
          <div key={stage.name} className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">{stage.name}</p>
              <p className="text-sm font-medium text-slate-800">Focus areas</p>
            </div>
            <ul className="list-disc space-y-1 pl-4 text-sm text-slate-700">
              {stage.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-auto rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold">Outcome</p>
              <p className="text-sm text-blue-900">{stage.outcome}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Visual placeholder: loop graphic showing Labs → Foundry → Factory continuity */}
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500">
        Placeholder for execution loop visual. Replace with a continuous cycle graphic or animation.
      </div>
    </SectionShell>
  );
}

export function WhyChooseSection({ data }: { data: WhyChooseContentType }) {
  return (
    <SectionShell id="reasons" title={data.title} background="bg-[#0B1727]">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {data.points.map((point) => (
            <div key={point} className="flex gap-3 rounded-xl border border-slate-700/60 bg-white/5 p-4">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" aria-hidden />
              <p className="text-sm text-slate-100">{point}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {data.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col items-start justify-center rounded-xl border border-slate-700/60 bg-slate-900/40 p-4 text-white">
              <p className="text-3xl font-semibold">{metric.value}</p>
              <p className="text-sm text-slate-200">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function CatalystModelTabsSection({
  data,
}: {
  data: ModelTabsContentType;
}) {
  const getStageTheme = (value: string) => {
    const titleBase: CSSProperties = {
      fontFamily: "Poppins",
      fontSize: "28px",
      fontStyle: "normal",
      fontWeight: 600,
      lineHeight: "normal",
    }
    if (value === "labs") {
      return {
        titleStyle: { ...titleBase, color: "#394FA1" },
        iconSrc: "/img/Compass.svg",
        iconAlt: "Labs",
      }
    }
    if (value === "foundry") {
      return {
        titleStyle: { ...titleBase, color: "#FF9231" },
        iconSrc: "/img/LightbulbFilament.svg",
        iconAlt: "Foundry",
      }
    }
    return {
      titleStyle: { ...titleBase, color: "#00AE8E" },
      iconSrc: "/img/CloudCheck.svg",
      iconAlt: "Factory",
    }
  }

  const subtitleParts = data.subtitle ? data.subtitle.split(/\s*→\s*/) : []

  return (
    <SectionShell
      id="model"
      title={data.title}
      titleClassName="fade-in-blur fade-in-blur-visible text-transparent bg-clip-text"
      titleStyle={{
        fontFamily: "Poppins",
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "normal",
        background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      headerLayout="center"
    >
      {subtitleParts.length > 0 ? (
        <p
          className="text-center mx-auto mb-2"
          style={{
            color: "#091917",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "24px",
            maxWidth: "560px",
          }}
        >
          {subtitleParts.map((part, i) => (
            <span key={part}>
              <span style={{ fontWeight: 500 }}>{part.trim()}</span>
              {i < subtitleParts.length - 1 ? " → " : ""}
            </span>
          ))}
        </p>
      ) : null}
      {data.description ? (
        <p
          className="text-center mx-auto"
          style={{
            color: "#091917",
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "26px",
            maxWidth: "560px",
          }}
        >
          {data.description}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {data.tabs.map((tab) => {
          const theme = getStageTheme(tab.value)

          const cardTitle =
            "titleLine" in tab && typeof tab.titleLine === "string"
              ? tab.titleLine
              : tab.label
          const hasIntro = "intro" in tab && typeof tab.intro === "string"

          return (
            <div
              key={tab.value}
              className="bg-white border border-[#E4E4E7] rounded-lg p-6 h-full relative"
              style={{ fontFamily: "Poppins" }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0">
                  <h3 className="block" style={theme.titleStyle}>{cardTitle}</h3>
                  {tab.tagline ? (
                    <p
                      className="mt-1"
                      style={{ color: "#111827", fontSize: "14px", fontWeight: 500, lineHeight: "normal" }}
                    >
                      {tab.tagline}
                    </p>
                  ) : null}
                </div>
                <div className="relative" style={{ width: "48px", height: "48px" }}>
                  <Image
                    src={theme.iconSrc}
                    alt={theme.iconAlt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {tab.programCount ? (
                <p
                  className="mb-4"
                  style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400, lineHeight: "normal" }}
                >
                  {tab.programCount}
                </p>
              ) : null}

              {hasIntro ? (
                <p
                  className="pb-4 mb-0 border-b border-dotted border-slate-300"
                  style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400, lineHeight: "normal" }}
                >
                  {(tab as { intro: string }).intro}
                </p>
              ) : null}

              <div className={cn("space-y-4", hasIntro ? "mt-4 pt-4" : "mt-4")}>
                <div className="pb-4 border-b border-dotted border-slate-300">
                  <h4
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "normal",
                      marginBottom: "4px",
                    }}
                  >
                    We focus on:
                  </h4>
                  <ul className="list-disc pl-4 space-y-1" style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400 }}>
                    {tab.focus.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "normal",
                      marginBottom: "4px",
                    }}
                  >
                    Outcome:
                  </h4>
                  <p style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400, lineHeight: "normal" }}>
                    {tab.outcome}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  );
}

export function ReverseBuildSection({ data }: { data: ReverseBuildContentType }) {
  const leftTitle = "leftFlowTitle" in data ? (data as { leftFlowTitle?: string }).leftFlowTitle : "Traditional AI build flow"
  const rightTitle = "rightFlowTitle" in data ? (data as { rightFlowTitle?: string }).rightFlowTitle : "Catalyst reverses it"
  const proofHeading = "proofHeading" in data ? (data as { proofHeading?: string }).proofHeading : "This Ensures"

  return (
    <SectionShell
      id="reverse-build"
      title={data.title}
      titleClassName="fade-in-blur fade-in-blur-visible text-transparent bg-clip-text"
      titleStyle={{
        fontFamily: "Poppins",
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "normal",
        background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      headerLayout="center"
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-6 md:grid-cols-2 pt-6">
        <div
          className="rounded-[4px] bg-white p-6 overflow-hidden min-h-[340px]"
          style={{
            backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          <div className="bg-white -mx-6 -mt-6 px-6 py-3 rounded-t-[4px]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-900 text-center">{leftTitle}</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            {data.traditional.map((step, i) => {
              const stepColors = [
                { bg: "#E0E7FF", text: "#3730A3" },
                { bg: "#FEF3C7", text: "#92400E" },
                { bg: "#DBEAFE", text: "#1E40AF" },
                { bg: "#CCFBF1", text: "#0F766E" },
              ]
              const c = stepColors[i % stepColors.length]
              return (
                <span key={step} className="flex flex-col items-center gap-1">
                  <span
                    className="inline-flex rounded-md px-3 py-2 text-sm font-medium"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    {step}
                  </span>
                  {i < data.traditional.length - 1 ? (
                    <span className="h-5 w-px bg-slate-300/80" aria-hidden />
                  ) : null}
                </span>
              )
            })}
          </div>
        </div>
        <div
          className="rounded-[4px] bg-white p-6 overflow-hidden min-h-[340px]"
          style={{
            backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        >
          <div className="bg-white -mx-6 -mt-6 px-6 py-3 rounded-t-[4px]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-900 text-center">{rightTitle}</p>
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            {data.catalyst.map((step, i) => {
              const stepColors = [
                { bg: "#3730A3", text: "#E0E7FF" },
                { bg: "#92400E", text: "#FEF3C7" },
                { bg: "#1E40AF", text: "#DBEAFE" },
                { bg: "#0F766E", text: "#CCFBF1" },
              ]
              const c = stepColors[i % stepColors.length]
              return (
                <span key={step} className="flex flex-col items-center gap-1">
                  <span
                    className="inline-flex rounded-md px-3 py-2 text-sm font-medium"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    {step}
                  </span>
                  {i < data.catalyst.length - 1 ? (
                    <span className="h-5 w-px bg-slate-300/80" aria-hidden />
                  ) : null}
                </span>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-sm font-semibold text-slate-900 mb-3 text-center" style={{ fontFamily: "Poppins" }}>{proofHeading}</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-medium text-slate-700" style={{ fontFamily: "Poppins" }}>
          {data.proofPoints.map((point, i) => {
            const proofIcons = [Target, Zap, TrendingUp, ShieldCheck]
            const iconColors = ["text-blue-600", "text-amber-500", "text-emerald-600", "text-violet-600"]
            const Icon = proofIcons[i % proofIcons.length]
            const iconColor = iconColors[i % iconColors.length]
            return (
              <li key={point} className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4 shrink-0", iconColor)} aria-hidden />
                <span>{point}</span>
                {i < data.proofPoints.length - 1 ? (
                  <span className="mx-1 h-4 w-px bg-slate-300" aria-hidden />
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </SectionShell>
  );
}

export function MaturityCoverageSection({ data }: { data: MaturityContentType }) {
  return (
    <SectionShell
      id="maturity"
      title={data.title}
      headerLayout="center"
      titleClassName="fade-in-blur fade-in-blur-visible text-transparent bg-clip-text"
      titleStyle={{
        fontFamily: "Poppins",
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "normal",
        background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:gap-0">
        {data.cards.flatMap((card, i) => {
          const maturityIcons = [Globe, Layers, Users, MapPin, Sparkles]
          const iconStyles = [
            "bg-violet-50 text-[#4c1d95]",
            "bg-sky-50 text-sky-600",
            "bg-amber-50 text-amber-600",
            "bg-emerald-50 text-emerald-600",
            "bg-rose-50 text-rose-600",
          ]
          const Icon = maturityIcons[i % maturityIcons.length]
          const iconStyle = iconStyles[i % iconStyles.length]
          const cardEl = (
            <div key={card.header} className="flex-1 min-w-0 rounded-xl bg-white p-5">
              <div className={cn("mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full", iconStyle)}>
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2" style={{ fontFamily: "Poppins" }}>
                {card.header}
              </h3>
              <p className="text-sm font-medium text-slate-800" style={{ fontFamily: "Poppins" }}>
                {card.subtext}
              </p>
            </div>
          )
          const divider =
            i < data.cards.length - 1 ? (
              <div
                key={`divider-${i}`}
                className="hidden w-px flex-shrink-0 self-stretch bg-slate-200 lg:block"
                aria-hidden
              />
            ) : null
          return [cardEl, divider].filter(Boolean)
        })}
      </div>
    </SectionShell>
  );
}

export function TwinEngineSection({ data }: { data: TwinEngineContentType }) {
  return (
    <SectionShell
      id="twin-engine"
      title={data.title}
      headerLayout="center"
      titleClassName="fade-in-blur fade-in-blur-visible text-transparent bg-clip-text"
      titleStyle={{
        fontFamily: "Poppins",
        fontSize: "28px",
        fontWeight: 600,
        lineHeight: "normal",
        background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      subtitle="Together, Catalyst and Tangram form a closed execution loop."
      subtitleClassName="text-center mx-auto"
      subtitleStyle={{
        color: "#091917",
        fontFamily: "Poppins",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "26px",
        maxWidth: "560px",
      }}
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-6 md:grid-cols-2 md:items-start mt-2">
        <div className="space-y-6 text-left">
          <div>
            <h3
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "normal",
                marginBottom: "4px",
              }}
            >
              {data.productEngine.title}
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-slate-700">
              {data.productEngine.bullets.map((item) => (
                <li key={item}>
                  <span className="text-sm font-normal text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "normal",
                marginBottom: "4px",
              }}
            >
              {data.executionEngine.title}
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-4 text-sm text-slate-700">
              {data.executionEngine.bullets.map((item) => (
                <li key={item}>
                  <span className="text-sm font-normal text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900">Execution Loop</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              {data.loop.split("→").map((step, i, arr) => (
                <span key={`${step}-${i}`} className="flex items-center gap-2">
                  <span>{step.trim()}</span>
                  {i < arr.length - 1 ? <span className="text-slate-400">→</span> : null}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Visual placeholder: twin-engine diagram — right column only */}
        <div className="relative rounded-xl bg-slate-50/60 md:min-h-[332px]">
          <Image
            src="/img/catalystwhy1.svg"
            alt="Twin-engine diagram showing Catalyst + Tangram closed loop"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function CustomServicesSection({ onTalkToExpert }: { onTalkToExpert: TalkHandler }) {
  return (
    <section
      className="py-10 px-4 md:py-[50px] md:px-5 lg:py-20 lg:px-0"
      style={{
        width: "100%",
        background: "transparent",
        position: "relative",
        margin: "0 auto",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundImage: "url('/img/bgpattern.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "contain",
          opacity: 1,
          zIndex: 0,
          pointerEvents: "none",
          width: "100%",
          maxWidth: "1356px",
          height: "100%",
        }}
      />

      <div
        className="p-10 px-6 md:p-[60px] md:px-8 lg:p-[70px] lg:px-12"
        style={{
          width: "100%",
          maxWidth: "1232px",
          margin: "0 auto",
          position: "relative",
          border: "none",
          borderRadius: 0,
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            marginBottom: "32px",
            boxSizing: "border-box",
          }}
        >
          <h2
            className="md:text-[28px] md:leading-[39.2px] md:tracking-[-0.56px] md:px-20 md:whitespace-normal text-[24px] leading-[33.6px] tracking-[-0.48px] px-4 whitespace-normal lg:text-[32px] lg:leading-[44.8px] lg:tracking-[-0.64px] lg:px-[165px] lg:pl-[171.34px] lg:whitespace-nowrap fade-in-blur fade-in-blur-visible"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(to left, #0082c0 0%, #3b60af 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              margin: 0,
              width: "100%",
              maxWidth: "100%",
              overflow: "visible",
              boxSizing: "border-box",
            }}
          >
            Ready to Move AI from Pilot to Production?
          </h2>

          <p
            className="text-sm leading-[21px] md:text-[15px] md:leading-[22.5px] lg:text-base lg:leading-6"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#6b7280",
              margin: 0,
              width: "100%",
              maxWidth: "880px",
              position: "relative",
            }}
          >
            Whether you&apos;re experimenting or scaling across the enterprise, Catalyst meets you where you are.
          </p>
        </div>

        <div
          className="flex-col gap-3 w-full md:flex-row md:gap-4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 0,
            boxSizing: "border-box",
          }}
        >
          <Button
            className="h-11 px-6 text-sm font-medium shadow-none"
            style={{ background: "black", color: "white" }}
            onClick={onTalkToExpert}
          >
            Talk to an AI Execution Expert
          </Button>
          <Button asChild variant="outline" className="h-11 px-6 text-sm font-medium shadow-none">
            <Link href="/tangram-ai">See How Tangram Powers Catalyst</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ProvenRealWorldSection() {
  return (
    <section className="py-12 px-4 md:py-[60px] md:px-5 lg:py-24 lg:px-0">
      <div className="mx-auto max-w-6xl px-6">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-2 text-center mx-auto">
            <h2
              className="text-3xl font-semibold md:text-4xl fade-in-blur fade-in-blur-visible text-transparent bg-clip-text"
              style={{
                fontFamily: "Poppins",
                fontSize: "28px",
                fontWeight: 600,
                lineHeight: "normal",
                background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Proven in the Real World
            </h2>
            <p
              className="max-w-3xl text-base text-slate-600 text-center mx-auto"
              style={{
                color: "#091917",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "26px",
                maxWidth: "560px",
              }}
            >
              Catalyst is built on real enterprise execution—not theory.
            </p>
          </div>

          <div className="flex justify-end">
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                {
                  stat: "13+",
                  label: "Labs engagements driving AI discovery",
                },
                {
                  stat: "7+",
                  label: "Foundry programs delivering working AI systems",
                },
                {
                  stat: "23+",
                  label: "Factory rollouts scaling AI enterprise-wide",
                },
                {
                  stat: "Growing",
                  label: "Pipeline across all stages of AI maturity",
                },
              ].map((item, idx) => (
                <div
                  key={item.stat}
                  className={cn(
                    "space-y-3 pr-4",
                    idx < 3 && "border-r border-slate-200",
                  )}
                >
                  <p className="text-3xl font-semibold text-blue-700" style={{ fontFamily: "Poppins" }}>{item.stat}</p>
                  <p className="text-sm font-medium text-slate-800" style={{ fontFamily: "Poppins", lineHeight: "22px" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-3xl mx-auto space-y-3 text-center text-sm text-slate-600" style={{ fontFamily: "Poppins", lineHeight: "24px" }}>
          <p>
            Catalyst helps enterprises discover the right AI opportunities, validate them in real workflows, deploy production-ready AI agents, scale safely with built-in governance, and drive sustained ROI and adoption.
          </p>
          <p>Not by adding more tools—but by installing a system for AI execution.</p>
        </div>
      </div>
    </section>
  );
}

export function ProofPromiseSection({
  data,
  onTalkToExpert,
}: {
  data: ProofPromiseContentType;
  onTalkToExpert: TalkHandler;
}) {
  return (
    <SectionShell id="proof" background="bg-[#0B1727]">
      <div className="space-y-6 text-white">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-200">{data.proofTitle}</p>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-100">
              {data.proofPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-700/60 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-200">{data.promiseTitle}</p>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-100">
              {data.promisePoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <GradientButton onClick={onTalkToExpert}>{data.finalCtas.primary}</GradientButton>
          <Button asChild variant="outline" className={secondaryCtaClasses}>
            <Link href="https://crayondata.ai/tangram" target="_blank" rel="noreferrer">
              {data.finalCtas.secondary}
            </Link>
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

