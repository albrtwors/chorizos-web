"use client";

import { useFrame } from "@react-three/fiber";
import { useGLTF, View } from "@react-three/drei";
import {
  Component,
  Suspense,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { heroIntro } from "./hero-intro";
import { HERO_MODEL_SRC, type ProductModelMedia } from "./product-media";
import { viewPointer } from "./view-pointer";

useGLTF.setDecoderPath("/draco/");

if (typeof window !== "undefined") {
  useGLTF.preload(HERO_MODEL_SRC, true);
}

type ModelViewerProps = {
  media: ProductModelMedia;
  className?: string;
  viewIndex?: number;
  showIngredients?: boolean;
  pointerReactive?: boolean;
  heroIntroBoost?: boolean;
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

const ingredientShapes = [
  { color: "#d9381e", kind: "sphere", scale: [1, 1, 1] },
  { color: "#f8f7f4", kind: "icosahedron", scale: [1, 0.9, 1] },
  { color: "#e5a93c", kind: "cone", scale: [0.85, 1.2, 0.85] },
  { color: "#141414", kind: "octahedron", scale: [0.8, 1, 0.8] },
] as const;

function IngredientPlaceholders() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      viewPointer.y * 0.2,
      0.05
    );
    group.rotation.y = THREE.MathUtils.lerp(
      group.rotation.y,
      viewPointer.x * 0.28,
      0.05
    );

    group.children.forEach((child, index) => {
      const angle =
        state.clock.elapsedTime * 0.42 + (index * Math.PI * 2) / group.children.length;
      const radius = 2.55 + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.12;

      child.position.set(
        Math.cos(angle) * radius + viewPointer.x * 0.14,
        Math.sin(angle * 1.35 + index) * 0.42 + viewPointer.y * 0.2,
        Math.sin(angle) * radius * 0.62
      );
      child.rotation.x += delta * 0.45;
      child.rotation.y += delta * 0.6;
    });
  });

  return (
    <group ref={groupRef}>
      {ingredientShapes.map((shape) => (
        <mesh key={shape.color} scale={shape.scale}>
          {shape.kind === "sphere" ? (
            <sphereGeometry args={[0.2, 18, 14]} />
          ) : shape.kind === "icosahedron" ? (
            <icosahedronGeometry args={[0.23, 0]} />
          ) : shape.kind === "cone" ? (
            <coneGeometry args={[0.2, 0.5, 12]} />
          ) : (
            <octahedronGeometry args={[0.24, 0]} />
          )}
          <meshStandardMaterial
            color={shape.color}
            roughness={0.44}
            metalness={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

function ModelScene({
  media,
  autoRotate,
  pointerReactive,
  showIngredients,
  heroIntroBoost,
}: {
  media: ProductModelMedia;
  autoRotate: boolean;
  pointerReactive: boolean;
  showIngredients: boolean;
  heroIntroBoost: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(media.src, true);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = (media.displayScale ?? 3.4) / largestSide;

    clone.scale.setScalar(scale);
    clone.position.copy(center).multiplyScalar(-scale);
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

    if (heroIntroBoost) {
      group.scale.setScalar(1 + (1 - heroIntro.progress) * 0.42);
    }

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

      <group
        ref={groupRef}
        rotation={[-0.04, media.rotationY ?? 0, 0]}
        scale={heroIntroBoost ? 1 + (1 - heroIntro.progress) * 0.42 : 1}
      >
        <primitive object={model} />
      </group>

      {showIngredients ? <IngredientPlaceholders /> : null}
    </>
  );
}

export default function ModelViewer({
  media,
  className,
  viewIndex = 1,
  showIngredients = false,
  pointerReactive = false,
  heroIntroBoost = false,
  onError,
}: ModelViewerProps) {
  return (
    <View
      id={`model-view-${viewIndex}`}
      index={viewIndex}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ModelBoundary onError={() => onError?.()}>
          <ModelScene
            media={media}
            autoRotate={Boolean(media.autoRotate)}
            pointerReactive={pointerReactive}
            showIngredients={showIngredients}
            heroIntroBoost={heroIntroBoost}
          />
        </ModelBoundary>
      </Suspense>
    </View>
  );
}
