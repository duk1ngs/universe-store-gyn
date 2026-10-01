"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { universeButtonVariants } from "@/components/ui/universe-button";
import { ShinyButtonContent, shinyButtonClassName } from "@/components/ui/shiny-button";
import { siteAsset } from "@/lib/site-path";
import { cn } from "@/lib/utils";

const variants = [
  { name: "Preto espacial", short: "Preto", asset: "/media/iphone-showcase-black.webp", color: "#292a2c" },
  { name: "Prata lunar", short: "Prata", asset: "/media/iphone-showcase-silver.webp", color: "#d7d8d8" },
  { name: "Cereja profunda", short: "Cereja", asset: "/media/iphone-showcase-cherry.webp", color: "#5a3135" },
  { name: "Azul celeste", short: "Azul", asset: "/media/iphone-showcase-blue.webp", color: "#96b8d5" },
] as const;

const TRANSITION_MS = 3100;

type ColorTransition = { from: number; to: number; id: number };

type ClosingStyle = CSSProperties & {
  "--active-color": string;
  "--transition-color": string;
};

export function IphoneColorOrbit({ visitorName = "" }: { visitorName?: string }) {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState<ColorTransition | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [manualTick, setManualTick] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const finishTimer = useRef<number | null>(null);
  const currentRef = useRef(0);
  const transitionRef = useRef<ColorTransition | null>(null);
  const queuedRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const cycleRef = useRef(0);
  const manualPauseUntilRef = useRef(0);
  const preloadRef = useRef(new Map<number, Promise<boolean>>());

  const clearTransitionTimers = useCallback(() => {
    if (finishTimer.current !== null) window.clearTimeout(finishTimer.current);
    finishTimer.current = null;
  }, []);

  const loadVariant = useCallback((index: number) => {
    const cached = preloadRef.current.get(index);
    if (cached) return cached;
    const promise = new Promise<boolean>((resolve) => {
      const image = new window.Image();
      image.src = siteAsset(variants[index].asset);
      image.decode().then(() => resolve(true), () => resolve(false));
    });
    preloadRef.current.set(index, promise);
    return promise;
  }, []);

  const transitionTo = useCallback((index: number, manual = false) => {
    if (manual) {
      manualPauseUntilRef.current = Date.now() + 8000;
      setManualTick((value) => value + 1);
    }
    if (transitionRef.current) {
      if (manual) queuedRef.current = index;
      return;
    }
    if (index === currentRef.current) return;
    const requestId = ++requestIdRef.current;
    void loadVariant(index).then((loaded) => {
      if (!loaded || requestId !== requestIdRef.current || (!manual && Date.now() < manualPauseUntilRef.current)) return;
      if (transitionRef.current) {
        if (manual) queuedRef.current = index;
        return;
      }
      if (index === currentRef.current) return;
      if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        currentRef.current = index;
        setCurrent(index);
        return;
      }
      const nextTransition: ColorTransition = { from: currentRef.current, to: index, id: ++cycleRef.current };
      transitionRef.current = nextTransition;
      setTransition(nextTransition);
      clearTransitionTimers();
      finishTimer.current = window.setTimeout(() => {
        currentRef.current = index;
        setCurrent(index);
        transitionRef.current = null;
        setTransition(null);
        finishTimer.current = null;
      }, TRANSITION_MS);
    });
  }, [clearTransitionTimers, loadVariant, reducedMotion]);

  useEffect(() => {
    variants.forEach((_, index) => { void loadVariant(index); });
  }, [loadVariant]);

  useEffect(() => {
    if (transition || queuedRef.current === null) return;
    const queued = queuedRef.current;
    queuedRef.current = null;
    const frame = window.requestAnimationFrame(() => transitionTo(queued, true));
    return () => window.cancelAnimationFrame(frame);
  }, [current, transition, transitionTo]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches && transitionRef.current) {
        const destination = queuedRef.current ?? transitionRef.current.to;
        clearTransitionTimers();
        currentRef.current = destination;
        queuedRef.current = null;
        transitionRef.current = null;
        setCurrent(destination);
        setTransition(null);
      }
    };
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, [clearTransitionTimers]);

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
    if (reducedMotion || transition || !inView || !introComplete) return;
    const delay = Math.max(7000, manualPauseUntilRef.current - Date.now());
    const timer = window.setTimeout(() => {
      if (transitionRef.current || Date.now() < manualPauseUntilRef.current) return;
      transitionTo((currentRef.current + 1) % variants.length);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [current, inView, introComplete, manualTick, reducedMotion, transition, transitionTo]);

  useEffect(() => () => { clearTransitionTimers(); requestIdRef.current += 1; }, [clearTransitionTimers]);

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
      section.style.setProperty("--hero-orbit-scale", (1 + (window.innerWidth <= 700 ? 0.08 : 0.22) * progress).toFixed(3));
      section.style.setProperty("--hero-dim", Math.pow(1 - progress, 1.25).toFixed(3));
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
  const incomingVariant = variants[transition?.to ?? current];
  const displayVariant = transition ? incomingVariant : activeVariant;
  const style: ClosingStyle = {
    "--active-color": activeVariant.color,
    "--transition-color": incomingVariant.color,
  };
  const firstName = visitorName.trim().split(/\s+/)[0] || "";
  const message = `${firstName ? `Olá! Meu nome é ${visitorName}. ` : "Olá! "}Quero conhecer o iPhone 18 Pro no acabamento ${displayVariant.name}.`;
  const whatsappHref = `https://wa.me/5562993721548?text=${encodeURIComponent(message)}`;

  return (
    <section ref={sectionRef} className="color-closing iphone-hero" id="inicio" style={style} aria-labelledby="color-closing-title" data-state={transition ? "crossing" : "idle"}>
      <span id="cores" className="section-anchor" aria-hidden="true" />
      <div className="color-closing-ambient" aria-hidden="true" />
      <div className="color-closing-ambient color-closing-ambient-next" aria-hidden="true" />
      <div className="shell iphone-hero-intro" data-reveal="heading">
        <p className="eyebrow eyebrow-dark">Universe Store Gyn <span>·</span> Seleção 2026</p>
        <h1 id="color-closing-title">iPhone 18 Pro<span className="hero-title-period">.</span></h1>
        <p>Quatro acabamentos. Uma escolha feita com contexto.</p>
      </div>

      <div className="color-stage" data-state={transition ? "crossing" : "idle"}>
        <div className="color-stage-orbit" aria-hidden="true" />
        {transition && (
          <span key={`orb-${transition.id}`} className="color-orb-runner" aria-hidden="true" style={{ backgroundColor: incomingVariant.color }} />
        )}
        <div className="color-device" aria-live="polite">
          <Image
            src={siteAsset(activeVariant.asset)}
            alt={`iPhone 18 Pro em ${activeVariant.name}`}
            width={405}
            height={940}
            unoptimized
          />
          {transition && (
            <Image key={`device-${transition.id}`} className="color-device-incoming" src={siteAsset(incomingVariant.asset)} alt="" width={405} height={940} unoptimized aria-hidden="true" />
          )}
          <span className="color-device-shadow" aria-hidden="true" />
        </div>
        <p className="color-state-copy" aria-live="polite"><span>{transition ? "Transformando para" : "Acabamento em cena"}</span><strong>{displayVariant.name}</strong></p>
      </div>

      <div className="shell color-closing-controls">
        <div className="color-swatches" role="group" aria-label="Selecionar acabamento do iPhone 18 Pro">
          {variants.map((variant, index) => (
            <button
              key={variant.name}
              className="color-swatch"
              type="button"
              aria-pressed={displayVariant === variant}
              onClick={() => transitionTo(index, true)}
            >
              <span style={{ backgroundColor: variant.color }} aria-hidden="true" />
              {variant.short}
            </button>
          ))}
        </div>
        <a className={shinyButtonClassName(cn(universeButtonVariants(), "button button-light color-cta"))} href={whatsappHref} target="_blank" rel="noopener noreferrer" data-reveal="action">
          <ShinyButtonContent>Quero conhecer em {displayVariant.short} <ArrowUpRight size={18} /></ShinyButtonContent>
        </a>
      </div>
      <div className="shell iphone-hero-foot" aria-hidden="true"><span>UN / 01 — ESCOLHA O ACABAMENTO</span><span>DESLIZE PARA EXPLORAR ↓</span></div>
    </section>
  );
}
