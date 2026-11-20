export const WHATSAPP_NUMBER = "584240000000";

export type Product = {
  index: string;
  name: string;
  weight: string;
  price: string;
  note: string;
  tone: "cream" | "gold" | "ember" | "noir";
  ingredients: string[];
};

export const featuredProduct: Product = {
  index: "01",
  name: "Chorizo de Pollo",
  weight: "500 g",
  price: "8.50",
  note: "El equilibrio exacto entre pollo seleccionado, especias naturales y un curado que respeta el tiempo.",
  tone: "cream",
  ingredients: ["100% pollo", "Sin gluten", "Sin conservantes"],
};

export const products: Product[] = [
  {
    index: "02",
    name: "Pollo & Pimentón",
    weight: "500 g",
    price: "8.00",
    note: "Pimentón ahumado con un fondo dulce que se agarra a la brasa y no suelta el aroma.",
    tone: "gold",
    ingredients: ["Pollo", "Pimentón", "Ajo"],
  },
  {
    index: "03",
    name: "Ahumado Artesanal",
    weight: "450 g",
    price: "8.75",
    note: "Curado lento con humo de leña. Intenso, redondo y hecho para comerse sin prisa.",
    tone: "ember",
    ingredients: ["Pollo", "Humo de leña", "Comino"],
  },
  {
    index: "04",
    name: "Picante de la Casa",
    weight: "500 g",
    price: "8.25",
    note: "Ají dulce y un golpe de guayabita. El calor justo para quien sabe pedir más.",
    tone: "noir",
    ingredients: ["Pollo", "Ají", "Vinagre"],
  },
  {
    index: "05",
    name: "Trío Parrillero",
    weight: "3 × 400 g",
    price: "24.00",
    note: "Los tres clásicos de la casa en una sola caja. La excusa perfecta para encender el fuego.",
    tone: "cream",
    ingredients: ["Clásico", "Ahumado", "Picante"],
  },
];

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppUrl(product: Product) {
  return buildWhatsAppUrl(
    `Hola Tres Gustavos, quiero hacer un pedido de: ${product.name} (${product.weight}) - Precio: $${product.price}.`
  );
}

export function buildGeneralWhatsAppUrl() {
  return buildWhatsAppUrl(
    "Hola Tres Gustavos, quiero hacer un pedido de chorizos de pollo."
  );
}

export function buildCatalogWhatsAppUrl() {
  return buildWhatsAppUrl(
    "Hola Tres Gustavos, quiero pedir el catálogo completo para una parrilla."
  );
}
