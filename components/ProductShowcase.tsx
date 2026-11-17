"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductViewer from "./ProductViewer";
import { placeholderMedia, productMedia } from "./product-media";
import styles from "./ProductShowcase.module.css";

type Product = {
  index: string;
  name: string;
  weight: string;
  note: string;
  tone: "cream" | "gold" | "ember" | "noir";
  ingredients: string[];
};

const products: Product[] = [
  {
    index: "02",
    name: "Pollo & Pimentón",
    weight: "500 g",
    note: "Pimentón ahumado con un fondo dulce que se agarra a la brasa y no suelta el aroma.",
    tone: "gold",
    ingredients: ["Pollo", "Pimentón", "Ajo"],
  },
  {
    index: "03",
    name: "Ahumado Artesanal",
    weight: "450 g",
    note: "Curado lento con humo de leña. Intenso, redondo y hecho para comerse sin prisa.",
    tone: "ember",
    ingredients: ["Pollo", "Humo de leña", "Comino"],
  },
  {
    index: "04",
    name: "Picante de la Casa",
    weight: "500 g",
    note: "Ají dulce y un golpe de guayabita. El calor justo para quien sabe pedir más.",
    tone: "noir",
    ingredients: ["Pollo", "Ají", "Vinagre"],
  },
  {
    index: "05",
    name: "Trío Parrillero",
    weight: "3 × 400 g",
    note: "Los tres clásicos de la casa en una sola caja. La excusa perfecta para encender el fuego.",
    tone: "cream",
    ingredients: ["Clásico", "Ahumado", "Picante"],
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scroll: 0,
    moved: false,
  });

  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateProgress = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const max = viewport.scrollWidth - viewport.clientWidth;
    const next = max > 0 ? viewport.scrollLeft / max : 0;

    setProgress(Math.min(Math.max(next, 0), 1));
    setAtStart(viewport.scrollLeft <= 8);
    setAtEnd(viewport.scrollLeft >= max - 8);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateProgress();
    viewport.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      viewport.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-showcase-reveal]",
        sectionRef.current
      );

      const reveal = gsap.from(items, {
        y: 48,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 74%",
          once: true,
        },
      });

      return () => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const amount = Math.min(viewport.clientWidth * 0.72, 640);
    viewport.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    const target = event.target as Element | null;
    if (target?.closest("a, button, input, select, textarea, [data-drag-ignore]")) {
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      scroll: viewport.scrollLeft,
      moved: false,
    };

    viewport.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const delta = event.clientX - dragState.current.startX;

    if (Math.abs(delta) > 4) {
      dragState.current.moved = true;
    }

    viewport.scrollLeft = dragState.current.scroll - delta;
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    dragState.current.active = false;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      dragState.current.moved = false;
    }, 0);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.moved = false;
  };

  return (
    <section ref={sectionRef} id="catalogo" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headingBlock} data-showcase-reveal>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Catálogo 2026
          </p>
          <h2 className={styles.title}>
            Otras formas
            <br />
            de <em>encender</em> la parrilla.
          </h2>
        </div>

        <div className={styles.aside} data-showcase-reveal>
          <p className={styles.lead}>
            Cinco presentaciones, una misma obsesión: que cada chorizo llegue
            al fuego con carácter propio. Desliza, gira el empaque y elige tu
            próxima parrilla.
          </p>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              onClick={() => scrollByPage(-1)}
              disabled={atStart}
              aria-label="Ver productos anteriores"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.control}
              onClick={() => scrollByPage(1)}
              disabled={atEnd}
              aria-label="Ver productos siguientes"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={`${styles.viewport} ${dragging ? styles.dragging : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
      >
        <div className={styles.track}>
          <article
            className={`${styles.card} ${styles.featureCard}`}
            data-showcase-reveal
          >
            <div className={styles.featureViewer}>
              <span className={styles.viewerLabel}>
                <span className={styles.viewerDot} aria-hidden="true" />
                Visor 3D · arrastra
              </span>
              <div className={styles.featurePack}>
                <ProductViewer
                  variant="showcase"
                  tone="cream"
                  interactive
                  name="Chorizo de Pollo"
                  media={productMedia.feature}
                />
              </div>
            </div>

            <div className={styles.featureInfo}>
              <span className={styles.kicker}>01 · La estrella</span>
              <h3 className={styles.featureTitle}>Chorizo de Pollo</h3>
              <p className={styles.featureText}>
                El equilibrio exacto entre pollo seleccionado, especias
                naturales y un curado que respeta el tiempo. Crujiente por
                fuera, jugoso por dentro.
              </p>

              <dl className={styles.specs}>
                <div>
                  <dt>Peso</dt>
                  <dd>500 g</dd>
                </div>
                <div>
                  <dt>Formato</dt>
                  <dd>Parrilla</dd>
                </div>
                <div>
                  <dt>Cocción</dt>
                  <dd>12–15 min</dd>
                </div>
              </dl>

              <ul className={styles.chips}>
                <li>100% pollo</li>
                <li>Sin gluten</li>
                <li>Sin conservantes</li>
              </ul>

              <a href="#contacto" className={styles.cardCta}>
                Hacer pedido
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>

          {products.map((product) => (
            <article
              key={product.index}
              className={`${styles.card} ${styles.productCard}`}
              data-showcase-reveal
            >
              <div className={styles.packStage}>
                <span className={styles.cardIndex}>{product.index}</span>
                <div className={styles.pack}>
                  <ProductViewer
                    variant="card"
                    tone={product.tone}
                    name={product.name}
                    weight={product.weight}
                    media={productMedia.cards[product.index] ?? placeholderMedia}
                  />
                </div>
              </div>

              <div className={styles.productInfo}>
                <div className={styles.productRow}>
                  <h3>{product.name}</h3>
                  <span className={styles.weight}>{product.weight}</span>
                </div>
                <p>{product.note}</p>
                <ul className={styles.chips}>
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <article
            className={`${styles.card} ${styles.ctaCard}`}
            data-showcase-reveal
          >
            <span className={styles.cardIndex}>06</span>
            <div className={styles.ctaBody}>
              <span className={styles.kicker}>Pedido institucional</span>
              <h3>
                Lleva la
                <br />
                parrilla
                <br />
                completa.
              </h3>
              <p>
                Cajas surtidas para restaurantes, eventos y familias que saben
                que el fuego se comparte.
              </p>
            </div>
            <a href="#contacto" className={styles.ctaLink}>
              Pedir catálogo
              <span aria-hidden="true">→</span>
            </a>
          </article>
        </div>
      </div>

      <div className={styles.caption}>
        <span className={styles.captionLabel}>Arrastra o desliza</span>
        <span className={styles.progressTrack} aria-hidden="true">
          <span
            className={styles.progressBar}
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
        <span className={styles.captionLabel}>01 — 06</span>
      </div>
    </section>
  );
}
