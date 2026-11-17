"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -28,
        opacity: 0,
        duration: 1,
        delay: 0.25,
        ease: "power3.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = useCallback((selector: string) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    if (window.__lenis) {
      window.__lenis.scrollTo(element, { duration: 1.6 });
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    element.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <header ref={navRef} className={styles.nav}>
      <a
        className={styles.brand}
        href="#inicio"
        onClick={(event) => {
          event.preventDefault();
          scrollTo("#inicio");
        }}
        title="Volver al inicio"
      >
        <span className={styles.brandMark} aria-hidden="true">
          TG
        </span>
        <span className={styles.brandWord}>TRES GUSTAVOS</span>
      </a>

      {/* <div className={styles.centerPill}>
        <span className={styles.goldDot} aria-hidden="true" />
        <span>LÍNEA PREMIUM</span>
        <span className={styles.divider} aria-hidden="true">
          •
        </span>
        <span>PARRILLA</span>
      </div> */}

      <button
        type="button"
        className={styles.catalogBtn}
        onClick={() => scrollTo("#catalogo")}
      >
        CATÁLOGO
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>
      </button>
    </header>
  );
}
