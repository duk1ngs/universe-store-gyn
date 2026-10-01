"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import BlackHole from "@/components/ui/black-hole";
import { UniverseAmbient } from "@/components/ui/universe-ambient";
import { UniverseButton } from "@/components/ui/universe-button";
import { isValidVisitorName, normalizeVisitorName, VISITOR_NAME_KEY } from "@/lib/visitor";

export const INTRO_COMPLETE_EVENT = "universe:intro-complete";
type IntroPhase = "hidden" | "visible" | "leaving";

export function UniverseIntro({ onComplete }: { onComplete: (name: string) => void }) {
  const [phase, setPhase] = useState<IntroPhase>("hidden");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const finishRef = useRef<(value: string) => void>(() => undefined);

  useEffect(() => {
    const timers: number[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    let finishing = false;
    let mounted = true;

    const unlock = () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      delete document.documentElement.dataset.introActive;
    };
    const finish = () => {
      if (!mounted) return;
      unlock();
      setPhase("hidden");
    };
    const beginExit = (value: string) => {
      if (finishing) return;
      finishing = true;
      const visitor = normalizeVisitorName(value);
      try {
        if (visitor) sessionStorage.setItem(VISITOR_NAME_KEY, visitor);
        else sessionStorage.removeItem(VISITOR_NAME_KEY);
      } catch {
        // A experiência continua mesmo quando o storage está indisponível.
      }
      onComplete(visitor);
      setPhase("leaving");
      window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
      timers.push(window.setTimeout(finish, reduced.matches ? 120 : 760));
    };
    finishRef.current = beginExit;

    try {
      const stored = normalizeVisitorName(sessionStorage.getItem(VISITOR_NAME_KEY) || "");
      if (isValidVisitorName(stored)) {
        onComplete(stored);
        window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
        return;
      }
    } catch {
      // Sem persistência, a introdução segue normalmente.
    }

    document.documentElement.dataset.introActive = "true";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    setPhase("visible");
    timers.push(window.setTimeout(() => inputRef.current?.focus(), 420));

    return () => {
      mounted = false;
      timers.forEach(window.clearTimeout);
      finishRef.current = () => undefined;
      unlock();
    };
  }, [onComplete]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const visitor = normalizeVisitorName(name);
    if (!isValidVisitorName(visitor)) {
      setError("Digite seu nome para continuar ou entre sem personalização.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    finishRef.current(visitor);
  };

  if (phase === "hidden") return null;

  return (
    <div className={`universe-intro${phase === "leaving" ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Introdução da Universe Store">
      <UniverseAmbient className="intro-fluid-field" />
      <BlackHole className="intro-black-hole" />
      <div className="intro-surface intro-surface-left" aria-hidden="true" />
      <div className="intro-surface intro-surface-right" aria-hidden="true" />
      <div className="intro-space-orbit" aria-hidden="true" />
      <div className="intro-cosmic-dust" aria-hidden="true" />
      <div className="intro-cosmos-meta" aria-hidden="true"><span>UNIVERSE / 00</span><span>CAMPO ORBITAL ATIVO</span></div>
      <div className="intro-lockup">
        <div className="intro-brand" aria-label="Universe Store"><span className="brand-word">UNIVERSE</span><span className="brand-store">STORE</span></div>
        <p className="intro-kicker">Sua experiência começa pela conversa.</p>
        <form className="intro-form" onSubmit={submit} noValidate>
          <label htmlFor="visitor-name">Como podemos chamar você?</label>
          <div className="intro-field">
            <input ref={inputRef} id="visitor-name" name="visitor-name" value={name} onChange={(event) => { setName(event.target.value); if (error) setError(""); }} autoComplete="given-name" inputMode="text" maxLength={40} placeholder="Seu nome" aria-invalid={Boolean(error)} aria-describedby={error ? "visitor-name-error" : undefined} />
            <UniverseButton className="intro-submit" size="compact" type="submit">Entrar <ArrowRight size={18} /></UniverseButton>
          </div>
          <p className="intro-greeting" aria-live="polite">{normalizeVisitorName(name) ? `Olá, ${normalizeVisitorName(name)}.` : "Uma entrada preparada para você."}</p>
          {error && <p className="intro-error" id="visitor-name-error" role="alert">{error}</p>}
        </form>
        <UniverseButton className="intro-skip-name" size="compact" type="button" onClick={() => finishRef.current("")}>Continuar sem nome</UniverseButton>
      </div>
    </div>
  );
}
