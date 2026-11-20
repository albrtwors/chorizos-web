"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [light, setLight] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateTheme = () => {
      const sampleY = Math.min(96, window.innerHeight * 0.12);
      const underNav = document.elementFromPoint(window.innerWidth / 2, sampleY);
      const section = underNav?.closest<HTMLElement>("[data-nav-theme]");
      setLight(section?.dataset.navTheme === "light");
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateTheme();
      });
    };

    updateTheme();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.__lenis?.on("scroll", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.__lenis?.off("scroll", scheduleUpdate);
    };
  }, []);

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
    <header
      ref={navRef}
      className={`${styles.nav} ${light ? styles.light : ""}`}
      data-theme={light ? "light" : "dark"}
    >
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
