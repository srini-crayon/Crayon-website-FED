"use client";

import { useEffect } from "react";

export function BorderGradientRotator({ selector = ".border-gradient" }: { selector?: string }) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    if (!elements.length) return;

    let angle = 0;
    let animationFrameId: number;

    const tick = () => {
      angle = (angle + 1) % 360;
      elements.forEach((el) => el.style.setProperty("--gradient-angle", `${angle}deg`));
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [selector]);

  return null;
}

