"use client";

import { useCallback, useEffect, useRef, useState, type ComponentProps } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  X,
} from "lucide-react";
import { universeButtonVariants } from "@/components/ui/universe-button";
import { IphoneColorOrbit } from "@/components/ui/iphone-color-orbit";
import { UniverseIntro } from "@/components/ui/universe-intro";
import { UniverseAmbient } from "@/components/ui/universe-ambient";
import { ShinyButtonContent, shinyButtonClassName } from "@/components/ui/shiny-button";
import { siteAsset } from "@/lib/site-path";
import { cn } from "@/lib/utils";

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

function WhatsAppLink({ children, className = "", message, ...props }: ComponentProps<"a"> & { message?: string }) {
  return <a className={className} href={whatsapp(message)} {...external} {...props}>{children}</a>;
}

function UniverseActionLink({ children, className = "", reveal = true, ...props }: ComponentProps<"a"> & { reveal?: boolean }) {
  return (
    <a className={shinyButtonClassName(cn(universeButtonVariants(), className))} data-reveal={reveal ? "action" : undefined} {...props}>
      <ShinyButtonContent>{children}</ShinyButtonContent>
    </a>
  );
}

function WhatsAppButton({ children, className = "", message, reveal = true }: { children: React.ReactNode; className?: string; message?: string; reveal?: boolean }) {
  return <UniverseActionLink className={className} href={whatsapp(message)} reveal={reveal} {...external}>{children}</UniverseActionLink>;
}

function ProductEditorial() {
  const productMessage = "Olá! Quero conhecer as possibilidades do iPhone 18 Pro e confirmar os modelos disponíveis.";
  return (
    <section className="product-editorial" id="destaque" aria-labelledby="product-editorial-title">
      <div className="shell product-editorial-grid">
        <article className="product-feature-card" data-reveal>
          <div className="product-feature-media">
            <Image src={siteAsset("/media/iphone-showcase-transparent-v2.png")} alt="Quatro estudos de acabamento do iPhone 18 Pro" width={1672} height={941} loading="lazy" unoptimized />
            <WhatsAppLink className="product-plus" message={productMessage} aria-label="Conhecer possibilidades do iPhone 18 Pro"><Plus /></WhatsAppLink>
          </div>
          <div className="product-feature-copy" data-reveal="heading">
            <p className="product-kicker">Destaque da seleção</p>
            <h2 id="product-editorial-title">iPhone 18<br />Pro</h2>
            <p>Quatro acabamentos em uma composição limpa e sofisticada. Consulte a equipe para confirmar modelo, lançamento e disponibilidade.</p>
            <WhatsAppButton className="product-pill" message={productMessage}>Conhecer possibilidades <ArrowUpRight size={16} /></WhatsAppButton>
          </div>
        </article>

        <article className="product-story-card" id="editorial" data-reveal>
          <div className="product-story-media">
            <Image src={siteAsset("/brand/apple-2026-editorial.jpg")} alt="Criativo Universe Store com uma composição de dispositivos Apple 2026" width={1638} height={2047} loading="lazy" unoptimized />
            <WhatsAppLink className="product-plus" message="Olá! Quero conversar sobre os lançamentos Apple apresentados pela Universe." aria-label="Conversar sobre lançamentos Apple"><Plus /></WhatsAppLink>
          </div>
          <div className="product-story-copy">
            <p className="product-kicker">Curadoria Universe</p>
            <h3>Novidades, com contexto.</h3>
            <p>Uma leitura visual dos próximos lançamentos. A equipe ajuda a separar conceito, anúncio e disponibilidade real.</p>
            <WhatsAppButton className="product-pill" message="Olá! Quero conversar sobre os lançamentos Apple apresentados pela Universe.">Conhecer possibilidades <ArrowUpRight size={16} /></WhatsAppButton>
          </div>
        </article>

        <article className="product-story-card" data-reveal>
          <div className="product-story-media product-story-media-fold">
            <Image src={siteAsset("/brand/foldable-editorial.jpg")} alt="Estudo conceitual de um dispositivo dobrável em diferentes ângulos" width={720} height={1280} loading="lazy" unoptimized />
            <WhatsAppLink className="product-plus" message="Olá! Quero conhecer os conceitos e aparelhos selecionados pela Universe." aria-label="Conhecer conceitos selecionados pela Universe"><Plus /></WhatsAppLink>
          </div>
          <div className="product-story-copy">
            <p className="product-kicker">Exploração conceitual</p>
            <h3>Ideias abrem caminhos.</h3>
            <p>Conceitos apresentados como inspiração, sem promessa comercial. Para o que já existe, consulte a curadoria da loja.</p>
            <WhatsAppButton className="product-pill" message="Olá! Quero conhecer os conceitos e aparelhos selecionados pela Universe.">Conhecer possibilidades <ArrowUpRight size={16} /></WhatsAppButton>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function UniverseStore() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const orbitLayerRef = useRef<HTMLDivElement>(null);
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
      <UniverseAmbient />
      <div className="ambient-orbit-layer" ref={orbitLayerRef} aria-hidden="true">
        <div className="ambient-orbit-system"><span className="ambient-circle" /><span className="ambient-track"><i /></span></div>
      </div>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="header-brand" href="#inicio"><Brand compact /></a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#inicio">iPhone 18 Pro</a><a href="#destaque">Seleção</a>
            <a href="#reputacao">Reputação</a><a href="#loja">A loja</a>
          </nav>
          <WhatsAppLink className="header-cta">Falar com a Universe <ArrowUpRight size={16} /></WhatsAppLink>
          <button ref={menuButtonRef} className="menu-button" type="button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu /></button>
        </div>
      </header>

      <div ref={menuRef} className={`mobile-menu${menuOpen ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Menu principal" aria-hidden={!menuOpen}>
        <div className="mobile-menu-head"><Brand compact /><button ref={closeButtonRef} type="button" aria-label="Fechar menu" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }}><X /></button></div>
        <nav aria-label="Navegação móvel">
          {[["inicio","iPhone 18 Pro"],["destaque","Seleção"],["reputacao","Reputação"],["loja","A loja" ]].map(([id,label], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>
          ))}
        </nav>
        <WhatsAppButton className="button button-light" reveal={false}>Conversar no WhatsApp <MessageCircle size={18} /></WhatsAppButton>
      </div>

      <main id="conteudo">
        <IphoneColorOrbit visitorName={visitorName} />

        <section className="service-rail" aria-label="Serviços informados">
          <div className="shell service-grid">
            <div><ShoppingBag /><span><strong>Compra na loja</strong><small>Atendimento presencial</small></span></div>
            <div><PackageCheck /><span><strong>Retirada na loja</strong><small>Combine com a equipe</small></span></div>
            <div><Truck /><span><strong>Entrega</strong><small>Consulte as condições</small></span></div>
            <div className="rating"><Star fill="currentColor" /><span><strong>4,9 de 5</strong><small>81 avaliações</small></span></div>
          </div>
        </section>

        <ProductEditorial />

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
            <div className="store-actions"><UniverseActionLink className="button button-dark" href={mapsUrl} {...external}>Traçar rota <MapPin size={18} /></UniverseActionLink><WhatsAppLink className="text-link">Falar com a equipe <ArrowUpRight size={16} /></WhatsAppLink></div>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="shell footer-statement" data-reveal="heading"><span>Universe Store Gyn</span><p>Tecnologia que<br />encontra você.</p><WhatsAppLink className="footer-statement-link">Converse com a equipe <ArrowUpRight size={18} /></WhatsAppLink></div>
        <div className="shell footer-grid">
          <div><Brand compact /><p>Tecnologia com presença local.</p></div>
          <div><strong>Visite</strong><address>Setor Marista<br />Goiânia — GO</address></div>
          <div><strong>Contato</strong><a href="tel:+5562993721548">(62) 99372-1548</a><WhatsAppLink>WhatsApp</WhatsAppLink></div>
          <a className="back-top" href="#inicio">Voltar ao topo <ArrowUpRight /></a>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Universe Store Gyn</span><span>Compras na loja · Retirada · Entrega</span></div>
      </footer>
      <WhatsAppLink className={shinyButtonClassName("floating-whatsapp")} message="Olá! Vim pelo site da Universe Store Gyn e quero atendimento."><ShinyButtonContent><MessageCircle /><span>WhatsApp</span></ShinyButtonContent></WhatsAppLink>
    </>
  );
}
