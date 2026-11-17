"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductModelMedia } from "./product-media";

type ModelViewerProps = {
  media: ProductModelMedia;
  label: string;
  className?: string;
  onError?: () => void;
};

type AttributeValue = string | number | boolean | undefined | null;

function setAttribute(
  element: HTMLElement,
  name: string,
  value: AttributeValue
) {
  if (value === undefined || value === null || value === false) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, typeof value === "boolean" ? "" : String(value));
}

export default function ModelViewer({
  media,
  label,
  className,
  onError,
}: ModelViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const onErrorRef = useRef(onError);
  const [ready, setReady] = useState(false);

  onErrorRef.current = onError;

  useEffect(() => {
    let cancelled = false;
    let handleWheel: ((event: WheelEvent) => void) | undefined;

    import("@google/model-viewer")
      .then(() => {
        if (cancelled || !hostRef.current || viewerRef.current) return;

        const viewer = document.createElement("model-viewer") as HTMLElement;
        viewer.setAttribute("camera-controls", "");
        viewer.setAttribute("touch-action", "pan-y");
        viewer.setAttribute("interaction-prompt", "none");
        viewer.setAttribute("loading", "lazy");
        viewer.setAttribute("reveal", "auto");
        viewer.setAttribute("tabindex", "0");
        viewer.setAttribute("data-lenis-prevent-wheel", "");

        handleWheel = (event: WheelEvent) => {
          if (!event.isTrusted) return;

          event.preventDefault();
          event.stopPropagation();

          const zoomableViewer = viewer as HTMLElement & {
            zoom: (keyPresses: number) => void;
          };
          zoomableViewer.zoom(-event.deltaY / 30);
        };
        viewer.addEventListener("wheel", handleWheel, true);

        hostRef.current.appendChild(viewer);
        viewerRef.current = viewer;
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current?.();
      });

    return () => {
      cancelled = true;
      const viewer = viewerRef.current;

      if (viewer && handleWheel) {
        viewer.removeEventListener("wheel", handleWheel, true);
      }

      if (viewer && viewer.parentNode === hostRef.current) {
        hostRef.current?.removeChild(viewer);
      }

      viewerRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!ready || !viewer) return;

    setAttribute(viewer, "src", media.src);
    setAttribute(viewer, "poster", media.poster);
    setAttribute(viewer, "alt", media.alt ?? label);
    setAttribute(viewer, "auto-rotate", media.autoRotate ?? false);
    setAttribute(viewer, "camera-orbit", media.cameraOrbit);
    setAttribute(viewer, "min-camera-orbit", media.minCameraOrbit);
    setAttribute(viewer, "max-camera-orbit", media.maxCameraOrbit);
    setAttribute(viewer, "camera-target", media.cameraTarget);
    setAttribute(
      viewer,
      "field-of-view",
      media.fieldOfView === undefined ? undefined : `${media.fieldOfView}deg`
    );
    setAttribute(viewer, "exposure", media.exposure ?? 1);
    setAttribute(viewer, "shadow-intensity", media.shadowIntensity ?? 0.6);
    setAttribute(
      viewer,
      "environment-image",
      media.environmentImage ?? "neutral"
    );

    const handleError = () => onErrorRef.current?.();
    viewer.addEventListener("error", handleError);

    return () => viewer.removeEventListener("error", handleError);
  }, [ready, media, label]);

  return <div ref={hostRef} className={className} />;
}
