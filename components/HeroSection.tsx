"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductViewer from "./ProductViewer";
import { productMedia } from "./product-media";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  // TODO: Reemplazar placeholder con asset .glb final.
  const sectionRef = useRef<HTMLElement>(null);
  const wordTopRef = useRef<HTMLSpanElement>(null);
  const wordBottomRef = useRef<HTMLSpanElement>(null);
  const wordTopInnerRef = useRef<HTMLSpanElement>(null);
  const wordBottomInnerRef = useRef<HTMLSpanElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const productIntroRef = useRef<HTMLDivElement>(null);
  const productParallaxRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const footerItems = footerRef.current
        ? Array.from(footerRef.current.children)
        : [];

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
            scale: 0.92,
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
              <div id="product-3d-placeholder" className={styles.productSlot}>
                {/* TODO: Reemplazar placeholder con asset .glb final. Montar aquí el Canvas de Three.js / React Three Fiber y conservar ProductViewer como fallback. */}
                <ProductViewer
                  variant="hero"
                  tone="cream"
                  interactive
                  media={productMedia.hero}
                />
              </div>
            </div>
          </div>
        </div>
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
