"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import type * as Content from "./content";
import { cn } from "../../../lib/utils";

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
  children,
  background = "bg-white",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  background?: string;
}) => (
  <section id={id} className={`${background} py-16`}>
    <div className="mx-auto max-w-6xl px-6 space-y-6">
      {(eyebrow || title || subtitle) && (
        <div className="space-y-2 text-left">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{eyebrow}</p>}
          {title && <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">{title}</h2>}
          {subtitle && <p className="max-w-3xl text-base text-slate-600">{subtitle}</p>}
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
    <section className="relative overflow-hidden bg-white min-h-[90vh]" id="hero">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
        }}
      />
      <div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 text-center"
        style={{
          paddingInline: "32px",
          paddingBlock: "200px 64px",
          scrollPaddingTop: "200px",
        }}
      >
        <div className="space-y-4 text-center">
          {data.eyebrow ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700 mx-auto">
              {data.eyebrow}
            </span>
          ) : null}
          <div className="space-y-3 mx-auto text-center">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl mx-auto">
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
  return (
    <SectionShell
      id="problem"
      title={data.title}
      subtitle={data.intro}
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.bullets.map((bullet) => (
          <div key={bullet} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" aria-hidden />
            <p className="text-sm text-slate-700">{bullet}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function WhyExistsSection({ data }: { data: WhyExistsContentType }) {
  return (
    <SectionShell id="insights" title={data.title}>
      <div className="space-y-4">
        {data.body.map((paragraph) => (
          <p key={paragraph} className="text-base text-slate-700">
            {paragraph}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}

export function DefinitionSection({
  data,
  onTalkToExpert,
}: {
  data: DefinitionContentType;
  onTalkToExpert: TalkHandler;
}) {
  return (
    <SectionShell id="definition" title={data.title}>
      <div className="space-y-4">
        {data.body.map((paragraph) => (
          <p key={paragraph} className="text-base text-slate-700">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <GradientButton onClick={onTalkToExpert}>{data.cta}</GradientButton>
        <Button asChild variant="outline" className={secondaryCtaClasses}>
          <Link href="https://crayondata.ai/tangram" target="_blank" rel="noreferrer">
            Explore Tangram Platform
          </Link>
        </Button>
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
  onTalkToExpert,
}: {
  data: ModelTabsContentType;
  onTalkToExpert: TalkHandler;
}) {
  return (
    <SectionShell id="model" title={data.title}>
      <Tabs defaultValue={data.tabs[0].value} className="space-y-6">
        <TabsList>
          {data.tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {data.tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
              <div className="md:col-span-1 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {tab.programCount}
                </p>
                <h3 className="text-xl font-semibold text-slate-900">{tab.tagline}</h3>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">We focus on</p>
                  <ul className="mt-2 grid list-disc gap-2 pl-4 text-sm text-slate-700">
                    {tab.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-900">Outcome</p>
                  <p className="text-sm text-blue-900">{tab.outcome}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <GradientButton className="h-11 px-[24px]" onClick={onTalkToExpert}>
                    Talk to an AI Expert
                  </GradientButton>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="shadow-sm transition-transform duration-150 hover:-translate-y-0.5 h-11"
                  >
                    <Link href="https://crayondata.ai/tangram" target="_blank" rel="noreferrer">
                      Explore Tangram
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionShell>
  );
}

export function ReverseBuildSection({ data }: { data: ReverseBuildContentType }) {
  return (
    <SectionShell
      id="reverse-build"
      title={data.title}
      subtitle="Catalyst inverts the traditional AI delivery flow to validate business value earlier."
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Traditional flow</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {data.traditional.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-900">Catalyst flow</p>
          <ul className="mt-2 space-y-2 text-sm text-blue-900">
            {data.catalyst.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-700">
        {data.proofPoints.map((point) => (
          <div key={point} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-green-500" aria-hidden />
            <p>{point}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function MaturityCoverageSection({ data }: { data: MaturityContentType }) {
  return (
    <SectionShell id="maturity" title={data.title}>
      <div className="grid gap-3 md:grid-cols-2">
        {data.bullets.map((bullet) => (
          <div key={bullet} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" aria-hidden />
            <p className="text-sm text-slate-700">{bullet}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function TwinEngineSection({ data }: { data: TwinEngineContentType }) {
  return (
    <SectionShell
      id="twin-engine"
      title={data.title}
      subtitle="Together, Catalyst and Tangram form a closed execution loop."
      background="bg-[#F8FAFC]"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{data.productEngine.title}</p>
          <ul className="list-disc space-y-2 pl-4 text-sm text-slate-700">
            {data.productEngine.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-900">{data.executionEngine.title}</p>
          <ul className="list-disc space-y-2 pl-4 text-sm text-blue-900">
            {data.executionEngine.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-700">
        Execution loop: {data.loop}
      </div>
      {/* Visual placeholder: twin-engine system diagram */}
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500">
        Placeholder for twin-engine diagram showing Catalyst + Tangram closed loop.
      </div>
    </SectionShell>
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

