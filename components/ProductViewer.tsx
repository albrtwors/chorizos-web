"use client";

import { useEffect, useState, type CSSProperties } from "react";
import ModelViewer from "./ModelViewer";
import type { ProductMedia, ProductModelMedia } from "./product-media";
import styles from "./ProductViewer.module.css";

type Tone = "cream" | "gold" | "ember" | "noir";
type Variant = "hero" | "card" | "showcase";

type ProductViewerProps = {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  name?: string;
  weight?: string;
  kicker?: string;
  subline?: string;
  media?: ProductMedia;
  viewIndex?: number;
  showIngredients?: boolean;
  pointerReactive?: boolean;
  heroIntroBoost?: boolean;
};

export default function ProductViewer({
  variant = "card",
  tone = "cream",
  className,
  name = "Chorizo de Pollo",
  weight = "500 g",
  kicker = "Línea premium",
  subline = "Parrilla · Artesanal",
  media,
  viewIndex = 1,
  showIngredients = false,
  pointerReactive = false,
  heroIntroBoost = false,
}: ProductViewerProps) {
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    setMediaFailed(false);
  }, [media]);

  const showPlaceholder = !media || media.type === "placeholder" || mediaFailed;
  const style = {
    "--rx": "-7deg",
    "--ry": "-18deg",
  } as CSSProperties;

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
        media={media as ProductModelMedia}
        className={styles.mediaLayer}
        viewIndex={viewIndex}
        showIngredients={showIngredients}
        pointerReactive={pointerReactive}
        heroIntroBoost={heroIntroBoost}
        onError={() => setMediaFailed(true)}
      />
    );
  };

  return (
    <div
      className={`${styles.scene} ${styles[variant]} ${styles[tone]} ${
        className ?? ""
      }`}
      aria-hidden="true"
    >
      <span className={styles.halo} aria-hidden="true" />
      {renderMedia()}
    </div>
  );
}
