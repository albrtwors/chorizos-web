export type ProductPlaceholderMedia = {
  type: "placeholder";
};

export type ProductImageMedia = {
  type: "image";
  src: string;
  alt?: string;
  fit?: "contain" | "cover";
  position?: string;
};

export type ProductModelMedia = {
  type: "model";
  src: string;
  alt?: string;
  autoRotate?: boolean;
  displayScale?: number;
  rotationY?: number;
  rotationSpeed?: number;
  fieldOfView?: number;
  cameraOrbit?: string;
  minCameraOrbit?: string;
  maxCameraOrbit?: string;
  cameraTarget?: string;
  exposure?: number;
  shadowIntensity?: number;
  environmentImage?: string;
};

export type ProductMedia =
  | ProductPlaceholderMedia
  | ProductImageMedia
  | ProductModelMedia;

export const placeholderMedia: ProductPlaceholderMedia = {
  type: "placeholder",
};

export const HERO_MODEL_SRC = "/models/Sausagesglb.glb";

export const exampleImageMedia: ProductImageMedia = {
  type: "image",
  src: "/images/tu-imagen.webp",
  alt: "Chorizo de pollo Tres Gustavos",
  fit: "contain",
  position: "center",
};

export const exampleModelMedia: ProductModelMedia = {
  type: "model",
  src: HERO_MODEL_SRC,
  alt: "Chorizo de pollo Tres Gustavos",
  autoRotate: true,
  cameraOrbit: "0deg 75deg 105%",
  minCameraOrbit: "auto auto 70%",
  maxCameraOrbit: "auto auto 140%",
  cameraTarget: "auto auto auto",
  exposure: 1,
  shadowIntensity: 0.6,
  environmentImage: "neutral",
  displayScale: 3.6,
  rotationSpeed: 0.16,
};

export const heroModelMedia: ProductModelMedia = {
  ...exampleModelMedia,
  cameraOrbit: "0deg 75deg 100%",
  fieldOfView: 36,
  displayScale: 3.6,
  rotationSpeed: 0.2,
};

export const productMedia: {
  hero: ProductMedia;
  feature: ProductMedia;
  cards: Record<string, ProductMedia>;
} = {
  hero: heroModelMedia,
  feature: {
    ...exampleModelMedia,
    displayScale: 3.25,
    rotationY: 0.18,
    rotationSpeed: 0.14,
  },
  cards: {
    "02": {
      ...exampleModelMedia,
      displayScale: 3,
      fieldOfView: 42,
      rotationY: 0.15,
      rotationSpeed: 0.12,
    },
    "03": {
      ...exampleModelMedia,
      displayScale: 3,
      fieldOfView: 42,
      rotationY: -0.35,
      rotationSpeed: 0.12,
    },
    "04": {
      ...exampleModelMedia,
      displayScale: 3,
      fieldOfView: 42,
      rotationY: 0.55,
      rotationSpeed: 0.12,
    },
    "05": {
      ...exampleModelMedia,
      displayScale: 3,
      fieldOfView: 42,
      rotationY: -0.6,
      rotationSpeed: 0.12,
    },
  },
};
