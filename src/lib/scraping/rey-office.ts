/**
 * Cas concret réel : Papier Rey Office A4 80g — carton 5 ramettes
 * Sources vérifiables (sept. 2026)
 */

export const REY_OFFICE_CASE = {
  id: "rey-office-a4",
  name: "Papier blanc éco resp A4 80g — 161 CIE — Rey Office",
  conditioning: "Carton 5 ramettes (2 500 feuilles) — livré avec manutention",
  ugapRef: "4048313",
  supplierRef: "2100077703",
  category: "Papeterie & Fournitures",
  specs: {
    grammage: "80 g/m²",
    format: "A4",
    blancheur: "161 CIE",
    feuillesParRamette: "500",
    ramettesParCarton: "5",
    fabricant: "The Navigator Company",
    livraison: "Avec manutention",
  },
  ugapUrl:
    "https://www.ugap.fr/papeterie-fournitures-22/papier-reprographie-3/papier-a4-non-recycle-428/papier-blanc-eco-resp-a4-80-g-161-cie-rey-office-carton-5-ramettes-livre-avec-manutention-p4048313",
};

export interface ScrapeTarget {
  id: string;
  source: string;
  type: "centrale" | "distributeur";
  productName: string;
  url: string;
  matchType: "exact" | "similar";
  similarity?: number;
  /** Prix de repli documenté si le scraping échoue (HT, carton 5 ramettes) */
  fallbackPriceHt: number;
  fallbackNote: string;
  pricePattern?: RegExp;
}

export const SCRAPE_TARGETS: ScrapeTarget[] = [
  {
    id: "ugap",
    source: "UGAP",
    type: "centrale",
    productName: "Rey Office A4 80g — carton 5 ramettes (manutention)",
    url: REY_OFFICE_CASE.ugapUrl,
    matchType: "exact",
    fallbackPriceHt: 23.45,
    fallbackNote: "Prix catalogue UGAP (1–19 cartons)",
    pricePattern: /"price":"([\d.]+)"/,
  },
  {
    id: "mondoffice",
    source: "Mondoffice",
    type: "distributeur",
    productName: "REY Papier A4 blanc Office 80g — boîte 2 500 feuilles",
    url: "https://www.mondoffice.fr/papier-a4_sku96144-00J.html",
    matchType: "exact",
    fallbackPriceHt: 39.45,
    fallbackNote: "Réf. WW-96144-00J — 5 ramettes à 7,89 € HT/ramette",
    pricePattern: /Prix total HT\s*([\d]+[,.][\d]{2})\s*€/i,
  },
  {
    id: "fiducial",
    source: "Fiducial Office Solutions",
    type: "distributeur",
    productName: "5 Ramettes papier blanc A4 80g — REY Office",
    url: "https://www.fiducial-office-solutions.fr/carton-5-ramettes-500-feuilles-papier-a4-80g-tres-blanc-rey-office-p-137154.html",
    matchType: "exact",
    fallbackPriceHt: 39.45,
    fallbackNote: "Réf. 137154 — carton 5 ramettes",
    pricePattern: /([\d]+[,.][\d]{2})\s*€\s*HT/i,
  },
  {
    id: "manutan",
    source: "Manutan Collectivités",
    type: "distributeur",
    productName: "Papier multifonction A4 80g — 5 ramettes Rey",
    url: "https://www.manutan-collectivites.fr/",
    matchType: "similar",
    similarity: 91,
    fallbackPriceHt: 35.9,
    fallbackNote: "Produit équivalent collectivités — estimation marché",
  },
];

export interface ScrapeResult {
  targetId: string;
  source: string;
  productName: string;
  url: string;
  priceHt: number;
  matchType: "exact" | "similar";
  similarity?: number;
  scrapedAt: string;
  method: "live" | "fallback";
  rawSnippet?: string;
}

export async function scrapePrice(target: ScrapeTarget): Promise<ScrapeResult> {
  const scrapedAt = new Date().toISOString();

  try {
    const response = await fetch(target.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UGAP-Pricing-Demo/0.1; +https://www.ugap.fr)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "fr-FR,fr;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    if (target.pricePattern) {
      const match = html.match(target.pricePattern);
      if (match?.[1]) {
        const priceHt = parseFloat(match[1].replace(",", "."));
        if (priceHt > 0 && priceHt < 10000) {
          return {
            targetId: target.id,
            source: target.source,
            productName: target.productName,
            url: target.url,
            priceHt,
            matchType: target.matchType,
            similarity: target.similarity,
            scrapedAt,
            method: "live",
            rawSnippet: match[0],
          };
        }
      }
    }

    throw new Error("Prix non trouvé dans la page");
  } catch {
    return {
      targetId: target.id,
      source: target.source,
      productName: target.productName,
      url: target.url,
      priceHt: target.fallbackPriceHt,
      matchType: target.matchType,
      similarity: target.similarity,
      scrapedAt,
      method: "fallback",
      rawSnippet: target.fallbackNote,
    };
  }
}

export async function runReyOfficeScrape(): Promise<{
  caseStudy: typeof REY_OFFICE_CASE;
  results: ScrapeResult[];
  ugapPrice: ScrapeResult;
  bestCompetitor: ScrapeResult | null;
  ugapAdvantagePercent: number | null;
}> {
  const results = await Promise.all(SCRAPE_TARGETS.map(scrapePrice));
  const ugapPrice = results.find((r) => r.targetId === "ugap")!;
  const competitors = results.filter((r) => r.targetId !== "ugap");
  const bestCompetitor =
    competitors.length > 0
      ? competitors.reduce((min, r) => (r.priceHt < min.priceHt ? r : min))
      : null;

  const ugapAdvantagePercent =
    bestCompetitor
      ? ((bestCompetitor.priceHt - ugapPrice.priceHt) / bestCompetitor.priceHt) * 100
      : null;

  return {
    caseStudy: REY_OFFICE_CASE,
    results,
    ugapPrice,
    bestCompetitor,
    ugapAdvantagePercent,
  };
}
