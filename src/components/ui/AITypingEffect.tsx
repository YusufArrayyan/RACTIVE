"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AITypingEffectProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
  onComplete?: () => void;
  startDelay?: number;
  cursor?: boolean;
}

export function AITypingEffect({
  text,
  speed = 18,
  className,
  onComplete,
  startDelay = 0,
  cursor = true,
}: AITypingEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
          onComplete?.();
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay, onComplete]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {displayed}
      {cursor && !done && (
        <span className="inline-block w-[2px] h-[1em] bg-electric-purple ml-0.5 animate-blink align-middle" />
      )}
    </span>
  );
}
