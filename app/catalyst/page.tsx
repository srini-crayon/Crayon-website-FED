"use client";

import { useEffect, useState } from "react";
import {
  CatalystModelTabsSection,
  DefinitionSection,
  ExecutionLoopSection,
  HeroSection,
  JourneySelectorSection,
  MaturityCoverageSection,
  ProblemStatementSection,
  ProofPromiseSection,
  ReverseBuildSection,
  TwinEngineSection,
  WhyChooseSection,
  WhyExistsSection,
} from "./sections/sections";
import {
  definitionContent,
  executionLoopContent,
  heroContent,
  journeyPaths,
  maturityContent,
  modelTabsContent,
  problemContent,
  proofPromiseContent,
  reverseBuildContent,
  twinEngineContent,
  whyChooseContent,
  whyExistsContent,
} from "./sections/content";
import { SchedulerDialog } from "./sections/scheduler-dialog";

export default function CatalystPage() {
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState<Date | null>(null);

  // Rotate border gradient on primary CTAs to match shared style
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll(".border-gradient")) as HTMLElement[];
    if (!buttons.length) return;

    let angle = 0;
    let animationFrameId: number;

    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      buttons.forEach((btn) => btn.style.setProperty("--gradient-angle", `${angle}deg`));
      animationFrameId = requestAnimationFrame(rotateGradient);
    };

    rotateGradient();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleTalkToExpert = () => setSchedulerOpen(true);

  const handleSlotConfirm = (slot: Date | null) => {
    setScheduledSlot(slot);
    if (slot) {
      // Placeholder: wire to real scheduler + email notification service
      console.info(
        "[Catalyst Scheduler] Notify Suresh, Priyanshu, Ajoy, TK about selected slot:",
        slot.toISOString(),
      );
    }
  };

  return (
    <>
      <SchedulerDialog
        open={schedulerOpen}
        onOpenChange={setSchedulerOpen}
        selectedSlot={scheduledSlot}
        onConfirm={handleSlotConfirm}
      />
      <div className="flex flex-col bg-white text-slate-900">
        <HeroSection data={heroContent} onTalkToExpert={handleTalkToExpert} />
        <ProblemStatementSection data={problemContent} />
        <WhyExistsSection data={whyExistsContent} />
        <DefinitionSection data={definitionContent} onTalkToExpert={handleTalkToExpert} />
        <JourneySelectorSection paths={journeyPaths} onTalkToExpert={handleTalkToExpert} />
        <ExecutionLoopSection data={executionLoopContent} />
        <WhyChooseSection data={whyChooseContent} />
        <CatalystModelTabsSection data={modelTabsContent} onTalkToExpert={handleTalkToExpert} />
        <ReverseBuildSection data={reverseBuildContent} />
        <MaturityCoverageSection data={maturityContent} />
        <TwinEngineSection data={twinEngineContent} />
        <ProofPromiseSection data={proofPromiseContent} onTalkToExpert={handleTalkToExpert} />
      </div>
    </>
  );
}
