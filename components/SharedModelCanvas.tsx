"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useEffect, useState } from "react";
import { viewPointer } from "./view-pointer";
import styles from "./SharedModelCanvas.module.css";

export default function SharedModelCanvas() {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const update = (event: PointerEvent) => {
      viewPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      viewPointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", update, { passive: true });
    return () => window.removeEventListener("pointermove", update);
  }, []);

  useEffect(() => {
    const target = document.getElementById("catalogo");
    if (!target || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.stage} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        camera={{
          fov: 42,
          position: [0, 0.25, 7.6],
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <View.Port />
      </Canvas>
    </div>
  );
}
