"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AttributesScroll.module.css";

type IconName = "selection" | "leaf" | "flame" | "label";

type Attribute = {
  index: string;
  title: string;
  description: string;
  tag: string;
  tone: "cream" | "ember" | "gold" | "noir";
  icon: IconName;
};

const attributes: Attribute[] = [
  {
    index: "01",
    title: "Selección Premium",
    description:
      "Pechuga y muslo de pollo elegidos a mano, sin rellenos ni atajos. La materia prima manda y se nota en cada mordida.",
    tag: "100% pollo",
    tone: "cream",
    icon: "selection",
  },
  {
    index: "02",
    title: "Especias Naturales",
    description:
      "Pimentón ahumado, ajo fresco, comino y un toque de ají dulce. Una mezcla propia que despierta la brasa sin taparla.",
    tag: "Sin artificiales",
    tone: "ember",
    icon: "leaf",
  },
  {
    index: "03",
    title: "Listo para la Parrilla",
    description:
      "Curado en su punto exacto para que la tripa cruja y el centro quede jugoso. Doce minutos de fuego y a la mesa.",
    tag: "12–15 min",
    tone: "gold",
    icon: "flame",
  },
  {
    index: "04",
    title: "Transparencia Nutricional",
    description:
      "Proteína real, grasa justa y una etiqueta que no esconde nada. Sabes exactamente qué estás poniendo en el fuego.",
    tag: "Sin gluten",
    tone: "noir",
    icon: "label",
  },
];

function AttributeIcon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "selection") {
    return (
      <svg {...common}>
        <path d="M16 3.5l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5 3.5-9z" />
        <circle cx="16" cy="16" r="3.2" />
      </svg>
    );
  }

  if (name === "leaf") {
    return (
      <svg {...common}>
        <path d="M26 6C15.5 6 8 12.5 8 21c0 2.8.9 5 1.5 6 1.4 0 3.5-.5 5.5-1.5C24.5 21 26 13.5 26 6z" />
        <path d="M8.5 27C11.5 19 16.5 14 23 10.5" />
      </svg>
    );
  }

  if (name === "flame") {
    return (
      <svg {...common}>
        <path d="M16 3.5c2.8 5.5 8 7.8 8 14.2A8 8 0 0116 26a8 8 0 01-8-8.3c0-3.4 2.3-5.7 4.4-9.2.1 3 1.1 5 3 6.2-.1-3.6-.4-7-.4-11.2z" />
        <path d="M11 28.5h10" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M16 3.8l10 4v8.7c0 7-4.7 10.4-10 11.7-5.3-1.3-10-4.7-10-11.7V7.8l10-4z" />
      <path d="M11 16l3.3 3.3L21 12" />
    </svg>
  );
}

export default function AttributesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const pin = pinRef.current;
        const viewport = viewportRef.current;

        if (!track || !pin || !viewport) return;

        const distance = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () =>
              `+=${distance() + window.innerHeight * 0.2}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        const entrance = gsap.from(Array.from(track.children), {
          y: 54,
          opacity: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pin,
            start: "top 78%",
            once: true,
          },
        });

        return () => {
          entrance.scrollTrigger?.kill();
          entrance.kill();
          horizontal.scrollTrigger?.kill();
          horizontal.kill();
        };
      }
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const max = viewport.scrollWidth - viewport.clientWidth;
      const progress = max > 0 ? viewport.scrollLeft / max : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="atributos"
      data-nav-theme="light"
      className={styles.section}
    >
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.head}>
          <div className={styles.headingBlock}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              La anatomía del sabor
            </p>
            <h2 className={styles.title}>
              Cuatro razones
              <br />
              para volver <em>a la brasa.</em>
            </h2>
          </div>

          <p className={styles.lead}>
            No hay atajos cuando el fuego juzga todo. Cada detalle del chorizo
            está pensado para llegar a la parrilla en su mejor momento.
          </p>
        </div>

        <div ref={viewportRef} className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {attributes.map((attribute) => (
              <article
                key={attribute.index}
                className={`${styles.card} ${styles[attribute.tone]}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.index}>{attribute.index}</span>
                  <span className={styles.iconWrap}>
                    <AttributeIcon name={attribute.icon} />
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3>{attribute.title}</h3>
                  <p>{attribute.description}</p>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.tag}>{attribute.tag}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerLabel}>Desliza para explorar</span>
          <span className={styles.progressTrack} aria-hidden="true">
            <span ref={progressRef} className={styles.progressBar} />
          </span>
          <span className={styles.footerLabel}>04 atributos</span>
        </div>
      </div>
    </section>
  );
}
