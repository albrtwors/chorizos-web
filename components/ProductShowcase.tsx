"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductViewer from "./ProductViewer";
import {
  featuredProduct,
  products,
  buildCatalogWhatsAppUrl,
  buildProductWhatsAppUrl,
  type Product,
} from "./product-data";
import { productMedia } from "./product-media";
import styles from "./ProductShowcase.module.css";

function ViewerSlot({
  viewerKey,
  product,
  variant,
  viewIndex,
}: {
  viewerKey: string;
  product: Product;
  variant: "showcase" | "card";
  viewIndex: number;
}) {
  const media =
    viewIndex === 2
      ? productMedia.feature
      : productMedia.cards[viewerKey] ?? productMedia.feature;

  return (
    <div className={styles.viewerSlot}>
      <ProductViewer
        variant={variant}
        tone={product.tone}
        name={product.name}
        weight={product.weight}
        media={media}
        viewIndex={viewIndex}
        fill
      />
    </div>
  );
}

function PriceBadge({ product }: { product: Product }) {
  return (
    <span className={`${styles.priceBadge} inline-flex items-center`}>
      Ref. ${product.price} · {product.weight}
    </span>
  );
}

function OrderButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <a
      href={buildProductWhatsAppUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.orderBtn} ${className ?? ""}`}
    >
      Pedir por WhatsApp
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<ScrollTrigger | null>(null);
  const distanceRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateProgress = useCallback(() => {
    if (horizontalRef.current) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const max = viewport.scrollWidth - viewport.clientWidth;
    const next = max > 0 ? viewport.scrollLeft / max : 0;

    setProgress(Math.min(Math.max(next, 0), 1));
    setAtStart(viewport.scrollLeft <= 8);
    setAtEnd(max <= 8 || viewport.scrollLeft >= max - 8);
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
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray<HTMLElement>(
          "[data-showcase-line] > span",
          sectionRef.current
        );

        const reveal = gsap.from(lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 74%",
            once: true,
          },
        });

        const items = gsap.utils.toArray<HTMLElement>(
          "[data-showcase-reveal]",
          sectionRef.current
        );

        const extras = gsap.from(items, {
          y: (_, element: HTMLElement) =>
            element.hasAttribute("data-catalog-card") ? 0 : 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
        });

        return () => {
          reveal.kill();
          extras.kill();
        };
      }, sectionRef);

      return () => ctx.revert();
    });

    mm.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = sectionRef.current?.querySelector<HTMLElement>(
          "[data-showcase-track]"
        );
        const viewport = viewportRef.current;
        if (!track || !viewport) return;

        const parallax = gsap.utils
          .toArray<HTMLElement>("[data-showcase-parallax]", sectionRef.current)
          .map((item, index) =>
            gsap.to(item, {
              yPercent: index % 2 === 0 ? -7 : 5,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            })
          );

        const distance = () => {
          const value = Math.max(0, track.scrollWidth - viewport.clientWidth);
          distanceRef.current = value;
          return value;
        };

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: viewport,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.2}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);
              setAtStart(self.progress <= 0.001);
              setAtEnd(self.progress >= 0.999);
            },
          },
        });

        horizontalRef.current = horizontal.scrollTrigger ?? null;

        return () => {
          horizontalRef.current = null;
          horizontal.scrollTrigger?.kill();
          horizontal.kill();
          parallax.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
          gsap.set(track, { x: 0 });
        };
      }
    );

    return () => mm.revert();
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const track = sectionRef.current?.querySelector<HTMLElement>(
      "[data-showcase-track]"
    );
    if (!viewport || !track) return;

    const card = track.querySelector<HTMLElement>("[data-catalog-card]");
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const step =
      (card?.getBoundingClientRect().width ?? viewport.clientWidth) + gap;

    const trigger = horizontalRef.current;
    if (trigger) {
      const max = distanceRef.current;
      if (max <= 0) return;

      const rawX = gsap.getProperty(track, "x");
      const currentX = -(
        typeof rawX === "number" ? rawX : Number.parseFloat(String(rawX)) || 0
      );
      const targetX = Math.min(Math.max(currentX + step * direction, 0), max);
      const top = trigger.start + (targetX / max) * (trigger.end - trigger.start);

      if (window.__lenis) {
        window.__lenis.scrollTo(top, { duration: 0.9 });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
      return;
    }

    viewport.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="catalogo"
      data-nav-theme="light"
      className={styles.section}
    >
      <div className={styles.header}>
        <div className={styles.headingBlock} data-showcase-reveal>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Catálogo 2026
          </p>
          <h2 className={styles.title}>
            <span className={styles.titleMask} data-showcase-line>
              <span>Otras formas</span>
            </span>
            <span className={styles.titleMask} data-showcase-line>
              <span>
                de <em>encender</em> la parrilla.
              </span>
            </span>
          </h2>
        </div>

        <div className={styles.aside} data-showcase-reveal>
          <p className={styles.lead}>
            Cinco presentaciones, una misma obsesión: que cada chorizo llegue
            al fuego con carácter propio. Elige tu próxima parrilla y pide
            directo por WhatsApp.
          </p>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.control}
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Ver productos anteriores"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.control}
              onClick={() => scrollByCard(1)}
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
        className={`no-scrollbar ${styles.viewport}`}
      >
        <div data-showcase-track className={styles.track}>
          <article
            data-catalog-card
            className={`${styles.card} ${styles.featureCard} snap-start`}
            data-showcase-reveal
          >
            <div
              className={`relative aspect-square w-full overflow-hidden rounded-2xl ${styles.featureViewer}`}
            >
              <span
                className={styles.cardIndex}
                data-showcase-parallax
                aria-hidden="true"
              >
                01
              </span>
              <div className={styles.featurePack}>
                <ViewerSlot
                  viewerKey="feature"
                  product={featuredProduct}
                  variant="showcase"
                  viewIndex={2}
                />
              </div>
            </div>

            <div className={styles.featureInfo}>
              <span className={styles.kicker}>01 · La estrella</span>
              <h3 className={styles.featureTitle}>{featuredProduct.name}</h3>
              <p className={styles.featureText}>{featuredProduct.note}</p>
              <PriceBadge product={featuredProduct} />

              <dl className={styles.specs}>
                <div>
                  <dt>Peso</dt>
                  <dd>{featuredProduct.weight}</dd>
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

              <ul className={styles.chips} data-showcase-parallax>
                {featuredProduct.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>

              <OrderButton
                product={featuredProduct}
                className={styles.cardCta}
              />
            </div>
          </article>

          {products.map((product) => (
            <article
              key={product.index}
              data-catalog-card
              className={`${styles.card} ${styles.productCard} snap-start`}
              data-showcase-reveal
            >
              <div
                className={`relative aspect-square w-full overflow-hidden rounded-2xl ${styles.packStage}`}
              >
                <span
                  className={styles.cardIndex}
                  data-showcase-parallax
                  aria-hidden="true"
                >
                  {product.index}
                </span>
                <div className={styles.pack}>
                  <ViewerSlot
                    viewerKey={product.index}
                    product={product}
                    variant="card"
                    viewIndex={Number(product.index) + 1}
                  />
                </div>
              </div>

              <div className={styles.productInfo}>
                <div className={styles.productRow}>
                  <h3>{product.name}</h3>
                  <span className={styles.weight}>{product.weight}</span>
                </div>
                <PriceBadge product={product} />
                <p>{product.note}</p>
                <ul className={styles.chips} data-showcase-parallax>
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
                <OrderButton product={product} className={styles.cardOrder} />
              </div>
            </article>
          ))}

          <article
            data-catalog-card
            className={`${styles.card} ${styles.ctaCard} snap-start`}
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
            <a
              href={buildCatalogWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaLink}
            >
              Pedir catálogo
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </div>

      <div className={styles.caption}>
        <span className={styles.captionLabel}>Desliza para explorar</span>
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
