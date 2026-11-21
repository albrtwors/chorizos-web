"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ToonAccents.module.css";

const strokes = [
  { d: "M10 43 C 11 25, 23 14, 39 10", color: "#D4AF37", width: 0.75 },
  { d: "M90 36 C 93 53, 88 73, 75 85", color: "#E03E2D", width: 0.8 },
  { d: "M15 84 C 26 92, 40 94, 53 90", color: "#F5F2EB", width: 0.65 },
  { d: "M8 60 C 5 54, 6 47, 10 43", color: "#E03E2D", width: 0.6 },
  { d: "M19 39 C 13 35, 13 28, 19 24", color: "#F5F2EB", width: 0.6 },
  { d: "M81 62 C 87 58, 87 51, 81 47", color: "#D4AF37", width: 0.6 },
  { d: "M24 72 C 19 70, 16 66, 16 61", color: "#E03E2D", width: 0.5 },
];

export default function ToonAccents({
  triggerRef,
}: {
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(
        "[data-toon-stroke]",
        root
      );

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: reduceMotion ? 0 : length,
        });

        if (reduceMotion) return;

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current ?? root,
            start: "top 82%",
            end: "bottom 30%",
            scrub: 1,
          },
        });
      });

      if (reduceMotion) return;

      gsap.to("[data-toon-stage]", {
        scale: 1.035,
        rotation: 2.5,
        ease: "none",
        transformOrigin: "50% 50%",
        scrollTrigger: {
          trigger: triggerRef.current ?? root,
          start: "top 82%",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      gsap.to("[data-toon-pulse]", {
        opacity: 0.5,
        scale: 1.1,
        duration: 1.6,
        stagger: 0.16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      });
    }, root);

    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div ref={rootRef} className={styles.accents} aria-hidden="true">
      <svg
        data-toon-stage
        className={styles.svg}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {strokes.map((stroke) => (
          <path
            key={stroke.d}
            data-toon-stroke
            d={stroke.d}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            strokeLinecap="round"
          />
        ))}

        <g data-toon-pulse stroke="#F5F2EB" strokeWidth="0.7" strokeLinecap="round">
          <path d="M32 8 L32 13" />
          <path d="M29.5 10.5 L34.5 10.5" />
        </g>
        <g data-toon-pulse stroke="#D4AF37" strokeWidth="0.7" strokeLinecap="round">
          <path d="M93 76 L97 80" />
          <path d="M97 74 L97 82" />
        </g>
        <g data-toon-pulse stroke="#E03E2D" strokeWidth="0.7" strokeLinecap="round">
          <path d="M6 76 L3 80" />
          <path d="M3 76 L3 84" />
        </g>
      </svg>
    </div>
  );
}
