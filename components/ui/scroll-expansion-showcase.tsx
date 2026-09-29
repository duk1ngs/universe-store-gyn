"use client";

import { useEffect, useRef } from "react";
import { ProductShowcase } from "@/components/ui/product-showcase";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export function ScrollExpansionShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollRef.current;
    const frame = frameRef.current;
    if (!scrollArea || !frame) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameRequest = 0;

    const render = () => {
      frameRequest = 0;
      if (reduced.matches) {
        frame.style.setProperty("--expansion-scale", "1");
        frame.style.setProperty("--expansion-radius", "0px");
        frame.style.setProperty("--expansion-lift", "0px");
        return;
      }

      const rect = scrollArea.getBoundingClientRect();
      const travel = Math.max(1, scrollArea.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      const eased = 1 - Math.pow(1 - progress, 3);
      frame.style.setProperty("--expansion-scale", String(0.82 + eased * 0.18));
      frame.style.setProperty("--expansion-radius", `${Math.round((1 - eased) * 34)}px`);
      frame.style.setProperty("--expansion-lift", `${Math.round((1 - eased) * 54)}px`);
    };

    const requestRender = () => {
      if (!frameRequest) frameRequest = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reduced.addEventListener("change", requestRender);
    return () => {
      window.cancelAnimationFrame(frameRequest);
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reduced.removeEventListener("change", requestRender);
    };
  }, []);

  return (
    <div className="expansion-scroll" ref={scrollRef}>
      <div className="expansion-sticky">
        <div className="showcase-frame expansion-frame" ref={frameRef}>
          <span className="showcase-number" aria-hidden="true">18</span>
          <ProductShowcase />
          <div className="showcase-caption"><span>iPhone 18 Pro Max</span><span>Estudo visual · não indica estoque</span></div>
        </div>
      </div>
    </div>
  );
}
