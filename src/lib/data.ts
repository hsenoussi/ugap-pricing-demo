export interface Product {
  id: string;
  name: string;
  category: string;
  reference: string;
  supplierPrice: number;
  ugapPrice: number;
  unit: string;
  specs: Record<string, string>;
}

export interface CompetitorPrice {
  competitor: string;
  productName: string;
  price: number;
  url: string;
  matchType: "exact" | "similar";
  similarity?: number;
  lastScraped: string;
}

export interface Supplier {
  id: string;
  name: string;
  productId: string;
  price: number;
  leadTimeDays: number;
  minOrderQty: number;
}

export interface MarketTrend {
  commodity: string;
  changePercent: number;
  period: string;
  source: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Papier Rey Office A4 80g — carton 5 ramettes (manutention)",
    category: "Papeterie & Fournitures",
    reference: "4048313",
    supplierPrice: 18.9,
    ugapPrice: 23.45,
    unit: "carton",
    specs: {
      grammage: "80 g/m²",
      format: "A4",
      blancheur: "161 CIE",
      ramettes: "5",
      feuilles: "2500",
    },
  },
  {
    id: "p2",
    name: "Scanner document A3 - 90 ppm",
    category: "Informatique",
    reference: "UGAP-INFO-9102",
    supplierPrice: 2890,
    ugapPrice: 3450,
    unit: "unité",
    specs: { vitesse: "90 ppm", format: "A3", connectivité: "USB/Ethernet" },
  },
  {
    id: "p3",
    name: "Véhicule utilitaire léger 3,5t - Diesel",
    category: "Véhicules",
    reference: "UGAP-VEH-0045",
    supplierPrice: 22400,
    ugapPrice: 24890,
    unit: "unité",
    specs: { ptac: "3,5t", motorisation: "Diesel", places: "3" },
  },
  {
    id: "p4",
    name: "IRM 1,5T - Génération dernière génération",
    category: "Santé",
    reference: "UGAP-SAN-1200",
    supplierPrice: 890000,
    ugapPrice: 985000,
    unit: "unité",
    specs: { champ: "1,5T", type: "IRM", génération: "2024" },
  },
  {
    id: "p5",
    name: "Chaise ergonomique bureau - accoudoirs réglables",
    category: "Mobilier",
    reference: "UGAP-MOB-3310",
    supplierPrice: 178,
    ugapPrice: 245,
    unit: "unité",
    specs: { matériau: "Textile", accoudoirs: "Réglables", norme: "EN 1335" },
  },
];

export const COMPETITOR_PRICES: Record<string, CompetitorPrice[]> = {
  p1: [
    {
      competitor: "Mondoffice",
      productName: "REY Office A4 80g — boîte 2 500 feuilles (WW-96144-00J)",
      price: 39.45,
      url: "https://www.mondoffice.fr/papier-a4_sku96144-00J.html",
      matchType: "exact",
      lastScraped: "2026-09-02T10:00:00",
    },
    {
      competitor: "Fiducial Office Solutions",
      productName: "5 Ramettes papier A4 80g REY Office (réf. 137154)",
      price: 39.45,
      url: "https://www.fiducial-office-solutions.fr/carton-5-ramettes-500-feuilles-papier-a4-80g-tres-blanc-rey-office-p-137154.html",
      matchType: "exact",
      lastScraped: "2026-09-02T10:00:00",
    },
    {
      competitor: "Manutan Collectivités",
      productName: "Papier multifonction A4 80g — 5 ramettes Rey",
      price: 35.9,
      url: "https://www.manutan-collectivites.fr/",
      matchType: "similar",
      similarity: 91,
      lastScraped: "2026-09-02T10:00:00",
    },
  ],
  p2: [
    {
      competitor: "Régie Services Publics",
      productName: "Scanner A3 haute vitesse 85 ppm",
      price: 3580,
      url: "rsp.fr/scanner-a3",
      matchType: "similar",
      similarity: 92,
      lastScraped: "2026-09-02T08:00:00",
    },
    {
      competitor: "Centrale Achats Territoriale",
      productName: "Scanner document A3 90 ppm",
      price: 3520,
      url: "cat-achats.fr/scanner",
      matchType: "exact",
      lastScraped: "2026-09-02T08:00:00",
    },
  ],
  p3: [
    {
      competitor: "Régie Services Publics",
      productName: "Utilitaire 3,5t diesel",
      price: 25100,
      url: "rsp.fr/utilitaire",
      matchType: "exact",
      lastScraped: "2026-09-02T08:00:00",
    },
    {
      competitor: "Centrale Achats Territoriale",
      productName: "VL utilitaire diesel 3500kg",
      price: 24200,
      url: "cat-achats.fr/vehicules",
      matchType: "similar",
      similarity: 95,
      lastScraped: "2026-09-02T08:00:00",
    },
  ],
  p4: [
    {
      competitor: "Régie Services Publics",
      productName: "IRM 1,5 Tesla système complet",
      price: 1020000,
      url: "rsp.fr/irm",
      matchType: "similar",
      similarity: 88,
      lastScraped: "2026-09-02T08:00:00",
    },
  ],
  p5: [
    {
      competitor: "Office Pro Public",
      productName: "Chaise bureau ergonomique",
      price: 259,
      url: "officepro-public.fr/chaise",
      matchType: "exact",
      lastScraped: "2026-09-02T08:00:00",
    },
    {
      competitor: "Centrale Achats Territoriale",
      productName: "Siège ergonomique accoudoirs",
      price: 238,
      url: "cat-achats.fr/mobilier",
      matchType: "similar",
      similarity: 91,
      lastScraped: "2026-09-02T08:00:00",
    },
  ],
};

export const SUPPLIERS: Record<string, Supplier[]> = {
  p1: [
    { id: "s1", name: "Lyreco (distributeur UGAP)", productId: "p1", price: 18.9, leadTimeDays: 5, minOrderQty: 6 },
    { id: "s2", name: "The Navigator Company (fabricant)", productId: "p1", price: 17.8, leadTimeDays: 14, minOrderQty: 48 },
    { id: "s3", name: "Antalis", productId: "p1", price: 19.2, leadTimeDays: 3, minOrderQty: 20 },
  ],
  p2: [
    { id: "s4", name: "Canon France", productId: "p2", price: 2890, leadTimeDays: 15, minOrderQty: 1 },
    { id: "s5", name: "Fujitsu", productId: "p2", price: 2750, leadTimeDays: 20, minOrderQty: 1 },
  ],
  p3: [
    { id: "s6", name: "Renault Pro+", productId: "p3", price: 22400, leadTimeDays: 45, minOrderQty: 1 },
    { id: "s7", name: "Ford Fleet", productId: "p3", price: 21800, leadTimeDays: 60, minOrderQty: 1 },
  ],
  p4: [
    { id: "s8", name: "GE HealthCare", productId: "p4", price: 890000, leadTimeDays: 120, minOrderQty: 1 },
    { id: "s9", name: "Siemens Healthineers", productId: "p4", price: 920000, leadTimeDays: 150, minOrderQty: 1 },
  ],
  p5: [
    { id: "s10", name: "Steelcase", productId: "p5", price: 178, leadTimeDays: 14, minOrderQty: 10 },
    { id: "s11", name: "Herman Miller", productId: "p5", price: 195, leadTimeDays: 21, minOrderQty: 5 },
  ],
};

export const MARKET_TRENDS: MarketTrend[] = [
  { commodity: "Pâte à papier", changePercent: -4.2, period: "6 mois", source: "Indice LME / CEPI" },
  { commodity: "Acier", changePercent: 2.8, period: "6 mois", source: "Indice métaux" },
  { commodity: "Semi-conducteurs", changePercent: -8.5, period: "12 mois", source: "DRAMeXchange" },
  { commodity: "Énergie (gazole)", changePercent: 5.1, period: "3 mois", source: "Ministère Écologie" },
  { commodity: "Caoutchouc synthétique", changePercent: -1.3, period: "6 mois", source: "Singapore Exchange" },
];

export const COST_DEFAULTS = {
  storage: 2.5,
  delivery: 3.0,
  handling: 1.5,
  insurance: 0.5,
  marginTarget: 15,
};

export function formatPrice(value: number, compact = false): string {
  if (compact && value >= 10000) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function generateNegotiationBrief(
  product: Product,
  supplier: Supplier,
  costBreakdown: { storage: number; delivery: number; handling: number; insurance: number },
  marketTrends: MarketTrend[]
): string {
  const relevantTrends = marketTrends.filter((t) => {
    if (product.category === "Fournitures" && t.commodity.includes("papier")) return true;
    if (product.category === "Véhicules" && (t.commodity.includes("Acier") || t.commodity.includes("Caoutchouc") || t.commodity.includes("gazole"))) return true;
    if (product.category === "Informatique" && t.commodity.includes("Semi-conducteurs")) return true;
    if (product.category === "Mobilier" && t.commodity.includes("Acier")) return true;
  });

  const trendText =
    relevantTrends.length > 0
      ? relevantTrends
          .map((t) => `${t.commodity}: ${t.changePercent > 0 ? "+" : ""}${t.changePercent}% (${t.period})`)
          .join(", ")
      : "Pas de tendance matière première directement corrélée identifiée.";

  const totalCostPercent =
    costBreakdown.storage + costBreakdown.delivery + costBreakdown.handling + costBreakdown.insurance;

  return `**Argumentaire de négociation — ${supplier.name}**

**Produit :** ${product.name} (${product.reference})

**Position actuelle :**
- Prix fournisseur proposé : ${formatPrice(supplier.price)}
- Prix UGAP actuel : ${formatPrice(product.ugapPrice)}
- Écart vs meilleur fournisseur alternatif : ${formatPrice(Math.min(...SUPPLIERS[product.id].map((s) => s.price)) - supplier.price)}

**Leviers de négociation identifiés :**

1. **Matières premières** — ${trendText}. Ces évolutions justifient une révision à la baisse du prix d'achat.

2. **Volume & engagement** — Proposition d'engagement sur 12 mois avec clause de révision trimestrielle indexée aux indices matières.

3. **Coûts logistiques** — Nos hypothèses intègrent ${totalCostPercent}% de coûts annexes (stockage ${costBreakdown.storage}%, livraison ${costBreakdown.delivery}%, manutention ${costBreakdown.handling}%, assurance ${costBreakdown.insurance}%). Demander une prise en charge partielle ou un tarif dégressif.

4. **Délai de livraison** — Délai actuel : ${supplier.leadTimeDays} jours. Négocier une réduction en contrepartie d'un volume minimum de ${supplier.minOrderQty} unités.

**Objectif de négociation :** Réduire le prix d'achat de 3 à 5% tout en maintenant les conditions de service actuelles.`;
}
