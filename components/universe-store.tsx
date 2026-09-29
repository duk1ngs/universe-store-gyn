"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import { ScrollExpansionShowcase } from "@/components/ui/scroll-expansion-showcase";
import { UniverseIntro } from "@/components/ui/universe-intro";
import { siteAsset } from "@/lib/site-path";
import { firstName } from "@/lib/visitor";

const phoneDigits = "5562993721548";
const whatsapp = (message = "Olá! Quero conhecer as opções da Universe Store Gyn.") =>
  `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(
  "Universe Store Gyn, Av. T-9, Qd. H-20, Lt. 22e23 Nº 185, Setor Marista, Goiânia - GO, 74150-300",
);
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const reviews = [
  { name: "Maristella", text: "Atendimento personalizado, atenção da equipe e qualidade dos aparelhos." },
  { name: "Rafael Oliveira", text: "Cliente em múltiplas compras; destaca o esforço da loja para resolver problemas." },
  { name: "Isadora Dias Silva", text: "Educação, paciência e ajuda para escolher a opção adequada." },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand${compact ? " brand-compact" : ""}`} aria-label="Universe Store">
      <span className="brand-word">UNIVERSE</span><span className="brand-store">STORE</span>
    </span>
  );
}

function WhatsAppLink({ children, className = "", message }: { children: React.ReactNode; className?: string; message?: string }) {
  return <a className={className} href={whatsapp(message)} {...external}>{children}</a>;
}

export default function UniverseStore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const orbitLayerRef = useRef<HTMLDivElement>(null);
  const visitorFirstName = firstName(visitorName);
  const handleIntroComplete = useCallback((name: string) => setVisitorName(name), []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
      return;
    }
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.94) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const pageSurfaces = document.querySelectorAll<HTMLElement>(".site-header, main, .site-footer, .floating-whatsapp");
    pageSurfaces.forEach((surface) => { surface.inert = menuOpen; });
    if (menuOpen) closeButtonRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      pageSurfaces.forEach((surface) => { surface.inert = false; });
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const layer = orbitLayerRef.current;
    if (!layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let request = 0;
    const render = () => {
      request = 0;
      if (reduced.matches) {
        layer.style.setProperty("--orbit-shift", "0px");
        layer.style.setProperty("--orbit-scroll-rotation", "0deg");
        return;
      }
      layer.style.setProperty("--orbit-shift", `${Math.min(window.scrollY * 0.035, 150)}px`);
      layer.style.setProperty("--orbit-scroll-rotation", `${Math.min(window.scrollY * 0.006, 22)}deg`);
    };
    const schedule = () => { if (!request) request = window.requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    reduced.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(request);
      window.removeEventListener("scroll", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Universe Store Gyn",
    telephone: "+55 62 99372-1548",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. T-9, Qd. H-20, Lt. 22e23 Nº 185",
      addressLocality: "Goiânia",
      addressRegion: "GO",
      postalCode: "74150-300",
      addressCountry: "BR",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "81" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <UniverseIntro onComplete={handleIntroComplete} />
      <div className="ambient-orbit-layer" ref={orbitLayerRef} aria-hidden="true">
        <div className="ambient-orbit-system"><span className="ambient-circle" /><span className="ambient-track"><i /></span></div>
      </div>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="header-brand" href="#inicio"><Brand compact /></a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#destaque">Destaque</a><a href="#editorial">Editorial</a>
            <a href="#reputacao">Reputação</a><a href="#loja">A loja</a>
          </nav>
          <WhatsAppLink className="header-cta">Falar com a Universe <ArrowUpRight size={16} /></WhatsAppLink>
          <button ref={menuButtonRef} className="menu-button" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>

      <div ref={menuRef} className={`mobile-menu${menuOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu principal" aria-hidden={!menuOpen}>
        <div className="mobile-menu-head"><Brand compact /><button ref={closeButtonRef} type="button" aria-label="Fechar menu" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}><X /></button></div>
        <nav aria-label="Navegação móvel">
          {[["destaque","Destaque"],["editorial","Editorial"],["reputacao","Reputação"],["loja","A loja"]].map(([id,label], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
          ))}
        </nav>
        <WhatsAppLink className="button button-light">Conversar no WhatsApp <MessageCircle size={18} /></WhatsAppLink>
      </div>

      <main id="conteudo">
        <section className="hero shell" id="inicio" aria-labelledby="hero-title">
          <div className="hero-grid">
            <div className="hero-copy" data-reveal="heading">
              <p className="eyebrow"><span>Goiânia · Setor Marista</span><span>4,9 / 5</span></p>
              <h1 id="hero-title">Tecnologia que<br /><em>encontra você.</em></h1>
              <p className="hero-lead">Uma curadoria guiada por conversa, contexto e escolha. Consulte a Universe para descobrir o dispositivo certo para o seu momento.</p>
              <div className="hero-actions">
                <WhatsAppLink className="button button-dark" message={visitorFirstName ? `Olá! Meu nome é ${visitorName} e quero conversar sobre as opções da Universe Store Gyn.` : undefined}>{visitorFirstName ? `${visitorFirstName}, fale com a Universe` : "Fale com a Universe"} <ArrowUpRight size={18} /></WhatsAppLink>
                <a className="text-link" href="#destaque">Ver experiência <ArrowDown size={16} /></a>
              </div>
            </div>
            <div className="hero-art" data-reveal>
              <span className="hero-orbit" aria-hidden="true" />
              <img className="hero-devices" src={siteAsset("/media/iphone-showcase-transparent-v2.png")} alt="Composição conceitual com quatro acabamentos de iPhone" width="1672" height="941" fetchPriority="high" />
              <p className="hero-art-note">Quatro acabamentos<br /><span>Estudo visual</span></p>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>UN / 01</span><span>Arraste para descobrir</span></div>
        </section>

        <section className="service-rail" aria-label="Serviços informados">
          <div className="shell service-grid">
            <div><ShoppingBag /><span><strong>Compra na loja</strong><small>Atendimento presencial</small></span></div>
            <div><PackageCheck /><span><strong>Retirada na loja</strong><small>Combine com a equipe</small></span></div>
            <div><Truck /><span><strong>Entrega</strong><small>Consulte as condições</small></span></div>
            <div className="rating"><Star fill="currentColor" /><span><strong>4,9 de 5</strong><small>81 avaliações</small></span></div>
          </div>
        </section>

        <section className="cinema" id="destaque" aria-labelledby="cinema-title">
          <div className="cinema-head shell" data-reveal="heading">
            <div><p className="eyebrow eyebrow-dark">Momento Universe / 2026</p><h2 id="cinema-title">Quatro acabamentos.<br />Uma presença.</h2></div>
            <p>Uma experiência visual preservada e reinterpretada para a Universe. Conteúdo conceitual; consulte a loja para informações comerciais.</p>
          </div>
          <ScrollExpansionShowcase />
        </section>

        <section className="editorial shell" id="editorial" aria-labelledby="editorial-title">
          <article className="editorial-primary" data-reveal>
            <div className="editorial-copy"><p className="eyebrow">Universe editorial</p><h2 id="editorial-title">O que vem a seguir, visto por outro ângulo.</h2><p>Exploração editorial dos lançamentos de 2026. A presença no site não representa oferta ou disponibilidade na loja.</p></div>
            <img src={siteAsset("/brand/apple-2026-editorial.jpg")} alt="Criativo Universe Store com composição de dispositivos Apple 2026" width="1638" height="2047" loading="lazy" />
          </article>
          <article className="editorial-concept" data-reveal>
            <img src={siteAsset("/brand/iphone-duo-concept.jpg")} alt="Estudo conceitual Universe Store de um iPhone dobrável chamado iPhone Duo" width="1440" height="1802" loading="lazy" />
            <div><span>CONCEITO / 02</span><h3>Ideias também abrem caminhos.</h3><p>Uma peça conceitual da marca, apresentada como exploração — não como oferta comercial.</p></div>
          </article>
        </section>

        <section className="reputation" id="reputacao" aria-labelledby="reputation-title">
          <div className="shell">
            <div className="reputation-head" data-reveal="heading">
              <div className="score"><span>4,9</span><div><span className="stars" aria-label="4,9 de 5 estrelas">★★★★★</span><small>81 avaliações</small></div></div>
              <div><p className="eyebrow eyebrow-dark">Confiança local</p><h2 id="reputation-title">Atendimento que permanece depois da compra.</h2></div>
            </div>
            <div className="reviews">
              {reviews.map((review, index) => <blockquote key={review.name} data-reveal><span>“</span><p>{review.text}</p><footer><strong>{review.name}</strong><small>Avaliação fornecida no briefing</small><b>0{index + 1}</b></footer></blockquote>)}
            </div>
          </div>
        </section>

        <section className="store-section shell" id="loja" aria-labelledby="store-title">
          <div className="store-map" aria-hidden="true" data-reveal>
            <div className="map-grid" /><div className="map-route map-route-a" /><div className="map-route map-route-b" />
            <span className="map-pin"><span>U</span></span><span className="map-label">SETOR<br />MARISTA</span><span className="map-axis">AV. T-9</span>
          </div>
          <div className="store-copy" data-reveal="heading">
            <p className="eyebrow">Universe Store Gyn</p>
            <h2 id="store-title">Uma parada no seu caminho.<br /><em>Um lugar para escolher sem pressa.</em></h2>
            <address>Av. T-9, Qd. H-20, Lt. 22e23 Nº 185<br />Setor Marista · Goiânia — GO<br />74150-300</address>
            <a className="phone-link" href="tel:+5562993721548">(62) 99372-1548</a>
            <div className="store-actions"><a className="button button-dark" href={mapsUrl} {...external}>Traçar rota <MapPin size={18} /></a><WhatsAppLink className="text-link">Falar com a equipe <ArrowUpRight size={16} /></WhatsAppLink></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-orbit" aria-hidden="true" />
          <div className="shell" data-reveal="heading">
            <Brand />
            <p>Seu próximo dispositivo não precisa começar em uma vitrine.</p>
            <h2>{visitorFirstName ? `${visitorFirstName}, a próxima escolha começa aqui.` : "A próxima escolha começa aqui."}</h2>
            <WhatsAppLink className="button button-light" message={visitorFirstName ? `Olá! Meu nome é ${visitorName}. Quero descobrir a opção certa para mim na Universe Store Gyn.` : undefined}>Falar com a Universe <MessageCircle size={19} /></WhatsAppLink>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div><Brand compact /><p>Tecnologia com presença local.</p></div>
          <div><strong>Visite</strong><address>Setor Marista<br />Goiânia — GO</address></div>
          <div><strong>Contato</strong><a href="tel:+5562993721548">(62) 99372-1548</a><WhatsAppLink>WhatsApp</WhatsAppLink></div>
          <a className="back-top" href="#inicio">Voltar ao topo <ArrowUpRight /></a>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Universe Store Gyn</span><span>Compras na loja · Retirada · Entrega</span></div>
      </footer>
      <WhatsAppLink className="floating-whatsapp" message="Olá! Vim pelo site da Universe Store Gyn e quero atendimento."><MessageCircle /><span>WhatsApp</span></WhatsAppLink>
    </>
  );
}
