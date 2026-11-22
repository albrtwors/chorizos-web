"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductViewer from "./ProductViewer";
import ToonAccents from "./ToonAccents";
import { productMedia } from "./product-media";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordTopRef = useRef<HTMLSpanElement>(null);
  const wordBottomRef = useRef<HTMLSpanElement>(null);
  const wordTopInnerRef = useRef<HTMLSpanElement>(null);
  const wordBottomInnerRef = useRef<HTMLSpanElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const productIntroRef = useRef<HTMLDivElement>(null);
  const productParallaxRef = useRef<HTMLDivElement>(null);
  const productFrameRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [dragEnabled, setDragEnabled] = useState(true);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px) and (hover: none)");
    const sync = () => setDragEnabled(!query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion && productFrameRef.current) {
      gsap.set(productFrameRef.current, { scale: 1, x: 0, y: 0 });
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const footerItems = footerRef.current
          ? Array.from(footerRef.current.children)
          : [];

        const frame = productFrameRef.current;
        if (frame) {
          gsap.set(frame, { scale: 1, x: 0, y: 0 });
        }
        const intro = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.15,
        });

        intro
          .from(
            [wordTopInnerRef.current, wordBottomInnerRef.current],
            {
              yPercent: 118,
              duration: 1.5,
              stagger: 0.12,
            },
            0
          )
          .from(
            productIntroRef.current,
            {
              y: 70,
              opacity: 0,
              duration: 1.6,
            },
            0.32
          )
          .from(
            footerItems,
            {
              y: 26,
              opacity: 0,
              duration: 1,
              stagger: 0.1,
            },
            0.68
          );

        const scrollSettings = {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        };

        gsap.to(wordTopRef.current, {
          xPercent: -14,
          ease: "none",
          scrollTrigger: scrollSettings,
        });

        gsap.to(wordBottomRef.current, {
          xPercent: 12,
          ease: "none",
          scrollTrigger: scrollSettings,
        });

        gsap.to(watermarkRef.current, {
          yPercent: -16,
          xPercent: 5,
          ease: "none",
          scrollTrigger: scrollSettings,
        });

        gsap.to(productParallaxRef.current, {
          yPercent: 18,
          rotate: 2.5,
          ease: "none",
          scrollTrigger: scrollSettings,
        });

        gsap.to(productIntroRef.current, {
          rotate: -7,
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            ...scrollSettings,
            end: "bottom 20%",
          },
        });
      });

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className={styles.hero}>
      <div className={styles.glowGold} aria-hidden="true" />
      <div className={styles.glowEmber} aria-hidden="true" />

      <div ref={watermarkRef} className={styles.watermark} aria-hidden="true">
        CHORIZO DE POLLO
      </div>

      <h1
        className={styles.words}
        aria-label="Tres Gustavos, chorizo de pollo de parrilla"
      >
        <span ref={wordTopRef} className={styles.wordTop} aria-hidden="true">
          <span className={styles.wordClip}>
            <span ref={wordTopInnerRef} className={styles.wordInner}>
              TRES
            </span>
          </span>
        </span>
        <span
          ref={wordBottomRef}
          className={styles.wordBottom}
          aria-hidden="true"
        >
          <span className={styles.wordClip}>
            <span ref={wordBottomInnerRef} className={styles.wordInner}>
              GUSTAVOS
            </span>
          </span>
        </span>
      </h1>

      <div className={styles.productStage}>
        <div ref={productIntroRef} className={styles.productIntro}>
          <div className={styles.productFloat}>
            <div ref={productParallaxRef} className={styles.productParallax}>
              <div ref={productFrameRef} className={styles.productFrame}>
                <div id="product-3d-placeholder" className={styles.productSlot}>
                  <ProductViewer
                    variant="hero"
                    tone="cream"
                    media={productMedia.hero}
                    pointerReactive
                    dragEnabled={dragEnabled}
                    fill
                  />
                  <ToonAccents triggerRef={sectionRef} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.rotateToggle} ${dragEnabled ? styles.rotateActive : ""}`}
          onClick={() => setDragEnabled((current) => !current)}
          aria-pressed={dragEnabled}
          aria-label={`Rotación 3D: ${dragEnabled ? "activada" : "desactivada"}. Toca para ${dragEnabled ? "desactivarla" : "activarla"}.`}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M20 4v4h-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Rotar 3D: {dragEnabled ? "ON" : "OFF"}
        </button>
      </div>

      <div ref={footerRef} className={styles.footer}>
        <p className={styles.slogan}>
          Descubre el sabor único que nace entre brasas, especias y paciencia.
        </p>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollLine} />
          <span>SCROLL</span>
          <span className={styles.scrollArrow}>↓</span>
        </div>

        <div className={styles.distribution}>
          <span>Distribución oficial</span>
          <strong>Sannas Pollos — Maracay</strong>
        </div>
      </div>
    </section>
  );
}
