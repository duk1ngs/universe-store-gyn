"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { universeButtonVariants } from "@/components/ui/universe-button";
import { siteAsset } from "@/lib/site-path";
import { cn } from "@/lib/utils";

const variants = [
  { name: "Preto espacial", short: "Preto", asset: "/media/iphone-showcase-black.webp", color: "#292a2c", glow: "#a5a7ab" },
  { name: "Prata lunar", short: "Prata", asset: "/media/iphone-showcase-silver.webp", color: "#d7d8d8", glow: "#f2f3f4" },
  { name: "Cereja profunda", short: "Cereja", asset: "/media/iphone-showcase-cherry.webp", color: "#5a3135", glow: "#b96b72" },
  { name: "Azul celeste", short: "Azul", asset: "/media/iphone-showcase-blue.webp", color: "#96b8d5", glow: "#b5d8f5" },
] as const;

type ClosingStyle = CSSProperties & {
  "--active-color": string;
  "--active-glow": string;
  "--next-glow": string;
};

export function IphoneColorOrbit({ visitorName = "" }: { visitorName?: string }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [crossing, setCrossing] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const commitTimer = useRef<number | null>(null);

  const clearCommit = useCallback(() => {
    if (commitTimer.current !== null) window.clearTimeout(commitTimer.current);
    commitTimer.current = null;
  }, []);

  const transitionTo = useCallback((index: number) => {
    if (index === current || crossing) return;
    clearCommit();
    if (reducedMotion) {
      setCurrent(index);
      setNext((index + 1) % variants.length);
      return;
    }
    setNext(index);
    setCycle((value) => value + 1);
    setCrossing(true);
    commitTimer.current = window.setTimeout(() => {
      setCurrent(index);
      setNext((index + 1) % variants.length);
      setCrossing(false);
      commitTimer.current = null;
    }, 3100);
  }, [clearCommit, crossing, current, reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const complete = () => setIntroComplete(true);
    if (document.documentElement.dataset.introActive !== "true") complete();
    window.addEventListener("universe:intro-complete", complete);
    return () => window.removeEventListener("universe:intro-complete", complete);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.24 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || crossing || !inView || !introComplete) return;
    const timer = window.setTimeout(() => transitionTo((current + 1) % variants.length), 1500);
    return () => window.clearTimeout(timer);
  }, [crossing, current, inView, introComplete, reducedMotion, transitionTo]);

  useEffect(() => clearCommit, [clearCommit]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = media.matches ? 0 : Math.max(0, Math.min(1, window.scrollY / Math.max(section.offsetHeight * 0.75, 1)));
      section.style.setProperty("--hero-scroll", progress.toFixed(3));
      section.style.setProperty("--hero-lift", `${(-42 * progress).toFixed(1)}px`);
      section.style.setProperty("--hero-scale", (1 - 0.09 * progress).toFixed(3));
      section.style.setProperty("--hero-turn", `${(-8 * progress).toFixed(1)}deg`);
      section.style.setProperty("--hero-dim", (1 - 0.62 * progress).toFixed(3));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    media.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  const activeVariant = variants[current];
  const incomingVariant = variants[next];
  const style: ClosingStyle = {
    "--active-color": activeVariant.color,
    "--active-glow": activeVariant.glow,
    "--next-glow": incomingVariant.glow,
  };
  const firstName = visitorName.trim().split(/\s+/)[0] || "";
  const message = `${firstName ? `Olá! Meu nome é ${visitorName}. ` : "Olá! "}Quero conhecer o iPhone 18 Pro no acabamento ${activeVariant.name}.`;
  const whatsappHref = `https://wa.me/5562993721548?text=${encodeURIComponent(message)}`;

  return (
    <section ref={sectionRef} className="color-closing iphone-hero" id="inicio" style={style} aria-labelledby="color-closing-title" data-state={crossing ? "crossing" : "idle"}>
      <span id="cores" className="section-anchor" aria-hidden="true" />
      <div className="color-closing-ambient" aria-hidden="true" />
      <div className="color-closing-ambient color-closing-ambient-next" aria-hidden="true" />
      <div className="shell iphone-hero-intro" data-reveal="heading">
        <p className="eyebrow eyebrow-dark">Universe Store Gyn <span>·</span> Seleção 2026</p>
        <h1 id="color-closing-title">iPhone 18 Pro<span className="hero-title-period">.</span></h1>
        <p>Quatro acabamentos. Uma escolha feita com contexto.</p>
      </div>

      <div className="color-stage" data-state={crossing ? "crossing" : "idle"}>
        <div className="color-stage-orbit" aria-hidden="true" />
        {crossing && (
          <span key={`orb-${cycle}`} className="color-orb-runner" aria-hidden="true" style={{ backgroundColor: incomingVariant.color }} />
        )}
        <div className="color-device" aria-live="polite">
          <Image src={siteAsset(activeVariant.asset)} alt={`iPhone 18 Pro em ${activeVariant.name}`} width={405} height={940} unoptimized />
          {crossing && (
            <Image key={`device-${cycle}`} className="color-device-incoming" src={siteAsset(incomingVariant.asset)} alt="" width={405} height={940} unoptimized aria-hidden="true" />
          )}
          <span className="color-device-shadow" aria-hidden="true" />
        </div>
        <p className="color-state-copy" aria-live="polite"><span>{crossing ? "Transformando para" : "Acabamento em cena"}</span><strong>{crossing ? incomingVariant.name : activeVariant.name}</strong></p>
      </div>

      <div className="shell color-closing-controls">
        <div className="color-swatches" role="group" aria-label="Selecionar acabamento do iPhone 18 Pro">
          {variants.map((variant, index) => (
            <button
              key={variant.name}
              className="color-swatch"
              type="button"
              aria-pressed={current === index}
              disabled={crossing}
              onClick={() => transitionTo(index)}
            >
              <span style={{ backgroundColor: variant.color }} aria-hidden="true" />
              {variant.short}
            </button>
          ))}
        </div>
        <a className={cn(universeButtonVariants(), "button button-light color-cta")} href={whatsappHref} target="_blank" rel="noopener noreferrer" data-reveal="action">
          Quero conhecer em {activeVariant.short} <ArrowUpRight size={18} />
        </a>
      </div>
      <div className="shell iphone-hero-foot" aria-hidden="true"><span>UN / 01 — ESCOLHA O ACABAMENTO</span><span>DESLIZE PARA EXPLORAR ↓</span></div>
    </section>
  );
}
