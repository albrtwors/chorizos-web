"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { ModelFallback, ModelScene } from "./ModelViewer";
import { HERO_MODEL_SRC, type ProductModelMedia } from "./product-media";

if (typeof window !== "undefined") {
  useGLTF.preload(HERO_MODEL_SRC, true);
}

function DragControls({ enabled }: { enabled: boolean }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.domElement.style.touchAction = enabled ? "none" : "pan-y";
  }, [enabled, gl]);

  return (
    <OrbitControls
      enabled={enabled}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      minPolarAngle={Math.PI * 0.32}
      maxPolarAngle={Math.PI * 0.68}
      makeDefault
    />
  );
}

type HeroModelViewerProps = {
  media: ProductModelMedia;
  className?: string;
  dragEnabled: boolean;
  pointerReactive?: boolean;
  onError?: () => void;
};

export default function HeroModelViewer({
  media,
  className,
  dragEnabled,
  pointerReactive = false,
  onError,
}: HeroModelViewerProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      className={className}
      data-lenis-prevent-touch={dragEnabled ? "" : undefined}
      style={{
        pointerEvents: dragEnabled ? "auto" : "none",
        touchAction: dragEnabled ? "none" : "pan-y",
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        camera={{
          fov: media.fieldOfView ?? 42,
          position: [0, 0.25, 7.6],
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", touchAction: "pan-y" }}
      >
        <DragControls enabled={dragEnabled} />
        <ModelFallback onError={onError}>
          <ModelScene
            media={media}
            autoRotate={Boolean(media.autoRotate) && !dragEnabled}
            pointerReactive={pointerReactive && !dragEnabled}
          />
        </ModelFallback>
      </Canvas>
    </div>
  );
}
