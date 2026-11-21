"use client";

import { useFrame } from "@react-three/fiber";
import { Center, useGLTF, View } from "@react-three/drei";
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { ProductModelMedia } from "./product-media";
import { viewPointer } from "./view-pointer";

useGLTF.setDecoderPath("/draco/");

type ModelViewerProps = {
  media: ProductModelMedia;
  className?: string;
  viewIndex?: number;
  pointerReactive?: boolean;
  onError?: () => void;
};

class ModelBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ModelScene({
  media,
  autoRotate,
  pointerReactive,
}: {
  media: ProductModelMedia;
  autoRotate: boolean;
  pointerReactive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(media.src, true);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const largestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = (media.displayScale ?? 3.1) / largestSide;

    clone.scale.setScalar(scale);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });

    return clone;
  }, [media.displayScale, scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (autoRotate) {
      group.rotation.y += delta * (media.rotationSpeed ?? 0.14);
    }

    if (pointerReactive) {
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        viewPointer.y * 0.1 - 0.04,
        0.04
      );
      group.position.x = THREE.MathUtils.lerp(
        group.position.x,
        viewPointer.x * 0.08,
        0.04
      );
      group.position.y = THREE.MathUtils.lerp(
        group.position.y,
        viewPointer.y * 0.05,
        0.04
      );
    }
  });

  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.1} />
      <directionalLight
        position={[-5, 2, -4]}
        intensity={0.9}
        color="#ffd79a"
      />

      <group ref={groupRef} rotation={[-0.04, media.rotationY ?? 0, 0]}>
        <Center>
          <primitive object={model} />
        </Center>
      </group>
    </>
  );
}

export function ModelFallback({
  children,
  onError,
}: {
  children: ReactNode;
  onError?: () => void;
}) {
  return (
    <Suspense fallback={null}>
      <ModelBoundary onError={() => onError?.()}>{children}</ModelBoundary>
    </Suspense>
  );
}

export default function ModelViewer({
  media,
  className,
  viewIndex = 1,
  pointerReactive = false,
  onError,
}: ModelViewerProps) {
  return (
    <View
      id={`model-view-${viewIndex}`}
      index={viewIndex}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ModelFallback onError={onError}>
        <ModelScene
          media={media}
          autoRotate={Boolean(media.autoRotate)}
          pointerReactive={pointerReactive}
        />
      </ModelFallback>
    </View>
  );
}
