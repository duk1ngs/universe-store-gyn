"use client";

import { useEffect, useRef, useState } from "react";
import { siteAsset } from "@/lib/site-path";

const finalImage = "/media/iphone-showcase-v2.webp";
const devices = ["black", "silver", "cherry", "blue"] as const;
type ShowcasePhase = "idle" | "playing" | "complete";

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const attemptedRef = useRef(false);
  const [phase, setPhase] = useState<ShowcasePhase>("idle");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPhase("complete");
      return;
    }

    let isIntersecting = false;
    let introComplete = !document.documentElement.hasAttribute("data-intro-active");
    let observer: IntersectionObserver | undefined;
    let introObserver: MutationObserver | undefined;
    let completionTimer: number | undefined;

    const playOnce = () => {
      if (attemptedRef.current) return;
      attemptedRef.current = true;
      observer?.disconnect();
      introObserver?.disconnect();
      setPhase("playing");
      completionTimer = window.setTimeout(() => setPhase("complete"), 3600);
    };

    const tryToPlay = () => {
      if (!isIntersecting || !introComplete) return;
      playOnce();
    };

    if (!("IntersectionObserver" in window)) {
      isIntersecting = true;
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = Boolean(entry?.isIntersecting);
          tryToPlay();
        },
        { rootMargin: "0px 0px -8%", threshold: 0.32 },
      );

      observer.observe(container);
    }

    if (!introComplete) {
      introObserver = new MutationObserver(() => {
        introComplete = !document.documentElement.hasAttribute("data-intro-active");
        tryToPlay();
      });
      introObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-intro-active"],
      });
    }

    tryToPlay();
    return () => {
      observer?.disconnect();
      introObserver?.disconnect();
      if (completionTimer) window.clearTimeout(completionTimer);
    };
  }, []);

  return (
    <div className={`product-showcase is-${phase}`} ref={containerRef} aria-hidden="true">
      <img
        className="product-showcase-final"
        src={siteAsset(finalImage)}
        alt=""
        width="1672"
        height="941"
        loading="eager"
        decoding="async"
      />
      {phase !== "complete" && (
        <div className="product-showcase-stage">
          {devices.map((device, index) => (
            <img
              className={`product-showcase-device product-showcase-device-${index}`}
              src={siteAsset(`/media/iphone-showcase-${device}.webp`)}
              alt=""
              width="400"
              height="941"
              decoding="async"
              key={device}
            />
          ))}
        </div>
      )}
      <noscript>
        <img className="product-showcase-noscript" src={siteAsset(finalImage)} alt="" width="1672" height="941" />
      </noscript>
    </div>
  );
}
