"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FooterCTA.module.css";
import {
  WHATSAPP_NUMBER,
  buildGeneralWhatsAppUrl,
} from "./product-data";

const contact = {
  whatsapp: buildGeneralWhatsAppUrl(),
  phone: "+58 424 000 0000",
  phoneHref: `tel:+${WHATSAPP_NUMBER}`,
  instagram: "https://instagram.com/tresgustavos",
  email: "hola@tresgustavos.com",
};

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-footer-reveal]",
        sectionRef.current
      );

      const reveal = gsap.from(items, {
        y: 46,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      const drift = gsap.to(watermarkRef.current, {
        xPercent: -2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      return () => {
        reveal.scrollTrigger?.kill();
        reveal.kill();
        drift.scrollTrigger?.kill();
        drift.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.8 });
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={sectionRef} id="contacto" className={styles.section}>
      <div className={styles.glowGold} aria-hidden="true" />
      <div className={styles.glowEmber} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.topRow} data-footer-reveal>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Pedidos & distribución
          </p>
          <p className={styles.tagline}>Línea premium · Parrilla</p>
        </div>

        <h2 className={styles.title} data-footer-reveal>
          El fuego es
          <br />
          <span>el mejor</span>
          <br />
          sazón.
        </h2>

        <p className={styles.lead} data-footer-reveal>
          Enciende la parrilla con el chorizo de pollo que está redefiniendo la
          sobremesa en Maracay. Pide directo a nuestra distribución oficial y
          recibe el sabor en su punto.
        </p>

        <div className={styles.actions} data-footer-reveal>
          <a
            className={styles.primary}
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Hacer mi pedido
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.secondary} href={`mailto:${contact.email}`}>
            Escribir por correo
          </a>
        </div>

        <div className={styles.contactGrid} data-footer-reveal>
          <div className={styles.contactItem}>
            <span>Distribución oficial</span>
            <strong>
              Sannas Pollos
              <br />
              Maracay, Venezuela
            </strong>
          </div>
          <div className={styles.contactItem}>
            <span>WhatsApp / Pedidos</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </div>
          <div className={styles.contactItem}>
            <span>Instagram</span>
            <a href={contact.instagram} target="_blank" rel="noreferrer">
              @tresgustavos
            </a>
          </div>
          <div className={styles.contactItem}>
            <span>Horario</span>
            <strong>
              Lun — Sáb
              <br />
              8:00 — 18:00
            </strong>
          </div>
        </div>
      </div>

      <div ref={watermarkRef} className={styles.watermark} aria-hidden="true">
        TRES GUSTAVOS
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 Tres Gustavos</span>
        <span className={styles.credit}>Hecho para la parrilla — Maracay</span>
        <button type="button" className={styles.topBtn} onClick={scrollToTop}>
          Volver arriba
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </section>
  );
}
