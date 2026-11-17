"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import ModelViewer from "./ModelViewer";
import type { ProductMedia } from "./product-media";
import styles from "./ProductViewer.module.css";

type Tone = "cream" | "gold" | "ember" | "noir";
type Variant = "hero" | "card" | "showcase";

type ProductViewerProps = {
  variant?: Variant;
  tone?: Tone;
  interactive?: boolean;
  className?: string;
  name?: string;
  weight?: string;
  kicker?: string;
  subline?: string;
  media?: ProductMedia;
};

type Rotation = {
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function ProductViewer({
  variant = "card",
  tone = "cream",
  interactive = false,
  className,
  name = "Chorizo de Pollo",
  weight = "500 g",
  kicker = "Línea premium",
  subline = "Parrilla · Artesanal",
  media,
}: ProductViewerProps) {
  const [rotation, setRotation] = useState<Rotation>({ x: -7, y: -18 });
  const [dragging, setDragging] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    baseX: -7,
    baseY: -18,
  });

  useEffect(() => {
    setMediaFailed(false);
  }, [media]);

  const showPlaceholder = !media || media.type === "placeholder" || mediaFailed;
  const usesModel = media?.type === "model" && !mediaFailed;
  const manualRotation = showPlaceholder || media?.type === "image";

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !manualRotation) return;

    if (event.pointerType === "touch" && variant === "hero") return;

    drag.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      baseX: rotation.x,
      baseY: rotation.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !manualRotation) return;

    const deltaX = event.clientX - drag.current.startX;
    const deltaY = event.clientY - drag.current.startY;

    setRotation({
      x: clamp(drag.current.baseX - deltaY * 0.22, -26, 26),
      y: clamp(drag.current.baseY + deltaX * 0.38, -62, 62),
    });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;

    drag.current.active = false;
    setDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !manualRotation) return;

    const step = event.shiftKey ? 14 : 6;
    let next: Rotation | null = null;

    if (event.key === "ArrowLeft") {
      next = { ...rotation, y: clamp(rotation.y - step, -62, 62) };
    } else if (event.key === "ArrowRight") {
      next = { ...rotation, y: clamp(rotation.y + step, -62, 62) };
    } else if (event.key === "ArrowUp") {
      next = { ...rotation, x: clamp(rotation.x - step, -26, 26) };
    } else if (event.key === "ArrowDown") {
      next = { ...rotation, x: clamp(rotation.x + step, -26, 26) };
    }

    if (next) {
      event.preventDefault();
      setRotation(next);
    }
  };

  const style = {
    "--rx": `${rotation.x}deg`,
    "--ry": `${rotation.y}deg`,
  } as CSSProperties;

  const accessibleLabel =
    media && media.type !== "placeholder" ? media.alt ?? name : name;

  const renderMedia = () => {
    if (showPlaceholder) {
      return (
        <div className={styles.package} style={style}>
          <div className={styles.back} aria-hidden="true" />

          <div className={styles.face}>
            <span className={styles.crimpTop} aria-hidden="true" />

            <div className={styles.topRow}>
              <span className={styles.monogram}>TG</span>
              <span className={styles.brandName}>TRES GUSTAVOS</span>
            </div>

            <div className={styles.copy}>
              <span className={styles.kicker}>{kicker}</span>
              <strong className={styles.name}>{name}</strong>
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.subline}>{subline}</span>
            </div>

            <div className={styles.badge} aria-hidden="true">
              <span className={styles.badgeBig}>100%</span>
              <span className={styles.badgeSmall}>POLLO</span>
            </div>

            <div className={styles.bottomRow}>
              <span className={styles.origin}>HECHO EN MARACAY</span>
              <span className={styles.weight}>{weight}</span>
            </div>

            <span className={styles.crimpBottom} aria-hidden="true" />
            <span className={styles.gloss} aria-hidden="true" />
            <span className={styles.shade} aria-hidden="true" />
          </div>
        </div>
      );
    }

    if (media.type === "image") {
      return (
        <div
          className={styles.imageFrame}
          style={
            {
              ...style,
              "--media-fit": media.fit ?? "contain",
              "--media-position": media.position ?? "center",
            } as CSSProperties
          }
        >
          <img
            src={media.src}
            alt={media.alt ?? name}
            className={styles.image}
            draggable={false}
            onError={() => setMediaFailed(true)}
          />
        </div>
      );
    }

    return (
      <ModelViewer
        media={media}
        label={accessibleLabel}
        className={styles.mediaLayer}
        onError={() => setMediaFailed(true)}
      />
    );
  };

  return (
    <div
      className={`${styles.scene} ${styles[variant]} ${styles[tone]} ${
        interactive ? styles.interactive : ""
      } ${dragging ? styles.dragging : ""} ${className ?? ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
      data-drag-ignore={interactive ? "" : undefined}
      tabIndex={interactive && !usesModel ? 0 : undefined}
      role={interactive && !usesModel ? "img" : undefined}
      aria-label={
        interactive && !usesModel
          ? `${accessibleLabel}. Arrastra o usa las flechas para girar el empaque.`
          : undefined
      }
      aria-hidden={interactive || usesModel ? undefined : true}
    >
      <span className={styles.halo} aria-hidden="true" />
      {renderMedia()}

      {interactive ? (
        <span className={styles.hint}>
          Arrastra para girar
          <span className={styles.hintIcon} aria-hidden="true">
            ↺
          </span>
        </span>
      ) : null}
    </div>
  );
}
