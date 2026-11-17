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
  poster?: string;
  alt?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  minCameraOrbit?: string;
  maxCameraOrbit?: string;
  cameraTarget?: string;
  fieldOfView?: number;
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

export const exampleImageMedia: ProductImageMedia = {
  type: "image",
  src: "/images/tu-imagen.webp",
  alt: "Chorizo de pollo Tres Gustavos",
  fit: "contain",
  position: "center",
};

export const exampleModelMedia: ProductModelMedia = {
  type: "model",
  src: "/models/Sausagesglb.glb",
  alt: "Chorizo de pollo Tres Gustavos",
  autoRotate: true,
  cameraOrbit: "0deg 75deg 105%",
  minCameraOrbit: "auto auto 70%",
  maxCameraOrbit: "auto auto 140%",
  cameraTarget: "auto auto auto",
  exposure: 1,
  shadowIntensity: 0.6,
  environmentImage: "neutral",
};

export const heroModelMedia: ProductModelMedia = {
  ...exampleModelMedia,
  cameraOrbit: "0deg 75deg 100%",
  fieldOfView: 36,
};

export const productMedia: {
  hero: ProductMedia;
  feature: ProductMedia;
  cards: Record<string, ProductMedia>;
} = {
  hero: heroModelMedia,
  feature: exampleModelMedia,
  cards: {
    "02": { ...exampleModelMedia, autoRotate: false },
    "03": { ...exampleModelMedia, autoRotate: false },
    "04": { ...exampleModelMedia, autoRotate: false },
    "05": { ...exampleModelMedia, autoRotate: false },
  },
};
