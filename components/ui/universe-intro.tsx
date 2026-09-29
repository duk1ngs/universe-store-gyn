"use client";

import { useEffect, useState } from "react";

export function UniverseIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitTimer = window.setTimeout(() => setLeaving(true), reduced ? 350 : 2100);
    const removeTimer = window.setTimeout(() => setVisible(false), reduced ? 520 : 2780);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  const skip = () => {
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 280);
  };

  if (!visible) return null;

  return (
    <div className={`universe-intro${leaving ? " is-leaving" : ""}`} aria-hidden={leaving}>
      <div className="intro-orbit" aria-hidden="true" />
      <div className="intro-surface intro-surface-left" aria-hidden="true" />
      <div className="intro-surface intro-surface-right" aria-hidden="true" />
      <div className="intro-lockup" aria-label="Universe Store">
        <span className="brand-word">UNIVERSE</span>
        <span className="brand-store">STORE</span>
        <span className="intro-rule" aria-hidden="true" />
        <p>Goiânia · tecnologia em outra órbita</p>
      </div>
      <button className="intro-skip" type="button" onClick={skip}>Pular introdução</button>
    </div>
  );
}
