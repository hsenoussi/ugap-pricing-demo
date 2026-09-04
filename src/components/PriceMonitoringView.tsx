"use client";

import { useCallback, useState } from "react";
import {
  COMPETITOR_PRICES,
  PRODUCTS,
  formatPrice,
  type CompetitorPrice,
} from "@/lib/data";
import { runReyOfficeScrape } from "@/lib/scraping/rey-office";
import {
  Badge,
  Card,
  PageHeader,
  StatCard,
} from "@/components/ui";
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  RefreshCw,
  Search,
  Sparkles,
  Wifi,
} from "lucide-react";
import clsx from "clsx";

type FilterMatch = "all" | "exact" | "similar";

type ScrapeApiResponse = Awaited<ReturnType<typeof runReyOfficeScrape>>;

export function PriceMonitoringView() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMatch>("all");
  const [scraping, setScraping] = useState(false);
  const [liveScrape, setLiveScrape] = useState<ScrapeApiResponse | null>(null);
  const [scrapeError, setScrapeError] = useState<string | null>(null);

  const allEntries = (() => {
    const entries: Array<{
      product: typeof PRODUCTS[0];
      competitor: CompetitorPrice;
    }> = [];

    for (const product of PRODUCTS) {
      const competitors = COMPETITOR_PRICES[product.id] ?? [];
      for (const competitor of competitors) {
        entries.push({ product, competitor });
      }
    }

    return entries;
  })();

  const filtered = allEntries.filter(({ product, competitor }) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.reference.toLowerCase().includes(q) ||
      competitor.competitor.toLowerCase().includes(q) ||
      competitor.productName.toLowerCase().includes(q);

    const matchesFilter =
      filter === "all" || competitor.matchType === filter;

    return matchesSearch && matchesFilter;
  });

  const runLiveScrape = useCallback(async () => {
    setScraping(true);
    setScrapeError(null);
    try {
      const data = await runReyOfficeScrape();
      setLiveScrape(data);
    } catch {
      setScrapeError("Échec du scraping. Réessayez ou consultez les données de repli.");
    } finally {
      setScraping(false);
    }
  }, []);

  return (
    <div>
      <PageHeader
        title="Veille Prix Concurrentielle"
        subtitle="Scraping intelligent — matching exact ou produit similaire"
        action={
          <button
            type="button"
            onClick={runLiveScrape}
            disabled={scraping}
            className="btn-primary"
          >
            <RefreshCw className={clsx("h-4 w-4", scraping && "animate-spin")} />
            {scraping ? "Scraping…" : "Scraper le cas concret"}
          </button>
        }
      />

      <Card className="mb-6 overflow-hidden border-[#d20a11]/15">
        <div className="bg-[#d20a11] px-6 py-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-white" />
            <h2 className="font-semibold text-white">
              Cas concret réel — Papier Rey Office A4 80g
            </h2>
          </div>
          <p className="mt-1 text-sm text-white/80">
            Réf. UGAP 4048313 · Scraping live depuis ugap.fr et distributeurs
          </p>
        </div>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-ugap-gray">Produit de référence</h3>
              <p className="mt-2 font-medium text-ugap-gray">
                Papier blanc éco resp A4 80g — 161 CIE — Rey Office
              </p>
              <p className="mt-1 text-sm text-ugap-gray-muted">
                Carton 5 ramettes · livré avec manutention · The Navigator Company
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <dt className="text-ugap-gray-muted">Réf. UGAP</dt>
                <dd className="font-medium">4048313</dd>
                <dt className="text-ugap-gray-muted">Grammage</dt>
                <dd>80 g/m² · A4 · 161 CIE</dd>
                <dt className="text-ugap-gray-muted">Conditionnement</dt>
                <dd>5 ramettes × 500 feuilles</dd>
              </dl>
              <a
                href="https://www.ugap.fr/papeterie-fournitures-22/papier-reprographie-3/papier-a4-non-recycle-428/papier-blanc-eco-resp-a4-80-g-161-cie-rey-office-carton-5-ramettes-livre-avec-manutention-p4048313"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ugap-blue hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Voir sur ugap.fr
              </a>
            </div>

            <div>
              {scrapeError ? (
                <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{scrapeError}</p>
              ) : liveScrape ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-ugap-green" />
                      <p className="font-semibold text-ugap-green">
                        UGAP {formatPrice(liveScrape.ugapPrice.priceHt)} HT
                        {liveScrape.ugapAdvantagePercent !== null && (
                          <span className="ml-2 text-sm font-normal">
                            — {liveScrape.ugapAdvantagePercent.toFixed(1)}% moins cher que le
                            meilleur concurrent
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-ugap-gray-muted">
                      Collecte :{" "}
                      {new Date(liveScrape.ugapPrice.scrapedAt).toLocaleString("fr-FR")}
                      · Méthode UGAP :{" "}
                      {liveScrape.ugapPrice.method === "live" ? "scraping live" : "repli catalogue"}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    {liveScrape.results
                      .filter((r) => r.targetId !== "ugap")
                      .map((r) => (
                        <li
                          key={r.targetId}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium">{r.source}</p>
                            <p className="text-xs text-ugap-gray-muted">
                              {r.matchType === "exact" ? "Match exact" : `Similaire ${r.similarity}%`}
                              · {r.method === "live" ? "live" : "repli"}
                            </p>
                          </div>
                          <span className="font-semibold">{formatPrice(r.priceHt)} HT</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Wifi className="h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm text-ugap-gray-muted">
                    Cliquez sur &quot;Scraper le cas concret&quot; pour lancer une collecte live
                    depuis ugap.fr et les distributeurs concurrents.
                  </p>
                </div>
              )}
            </div>
          </div>

          {liveScrape && (
            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ugap-gray-muted">
                Journal de scraping
              </p>
              <ul className="mt-2 space-y-1 font-mono text-xs text-ugap-gray">
                {liveScrape.results.map((r) => (
                  <li key={r.targetId}>
                    [{r.method === "live" ? "OK" : "FALLBACK"}] {r.source} →{" "}
                    {formatPrice(r.priceHt)} — {r.rawSnippet ?? "—"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Sources actives" value="UGAP + 3 distributeurs" sub="Mondoffice, Fiducial, Manutan" />
        <StatCard label="Cas pilote" value="Rey Office A4" sub="Réf. 4048313 — catalogue réel" />
        <StatCard label="Matching IA" value="Exact + similaire" sub="Seuil ≥ 85 %" />
      </div>

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="search"
              placeholder="Rechercher référence, produit, concurrent…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#e2e8f0] py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#d20a11]/20 focus:border-[#d20a11]"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "exact", "similar"] as FilterMatch[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  filter === f
                    ? "bg-[#d20a11] text-white"
                    : "bg-[#f1f5f9] text-[#212121] hover:bg-[#e2e8f0]"
                )}
              >
                {f === "all" ? "Tous" : f === "exact" ? "Exact" : "Similaire"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence UGAP</th>
                <th>Concurrent</th>
                <th>Produit concurrent</th>
                <th>Match</th>
                <th>Prix UGAP</th>
                <th>Prix concurrent</th>
                <th>Écart</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ product, competitor }) => {
                const gap =
                  ((product.ugapPrice - competitor.price) / competitor.price) * 100;
                const isCheaper = product.ugapPrice < competitor.price;

                return (
                  <tr key={`${product.id}-${competitor.competitor}`}>
                    <td>
                      <p className="font-medium text-[#212121]">{product.name}</p>
                      <p className="text-xs text-[#94a3b8]">{product.reference}</p>
                    </td>
                    <td className="font-medium">{competitor.competitor}</td>
                    <td className="text-[#64748b] max-w-xs">{competitor.productName}</td>
                    <td>
                      <Badge variant={competitor.matchType === "exact" ? "success" : "warning"}>
                        {competitor.matchType === "exact" ? (
                          "Exact"
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            {competitor.similarity}%
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="font-semibold">{formatPrice(product.ugapPrice)}</td>
                    <td className="font-semibold">{formatPrice(competitor.price)}</td>
                    <td>
                      <span
                        className={clsx(
                          "font-semibold",
                          isCheaper ? "text-[#006233]" : "text-[#d20a11]"
                        )}
                      >
                        {isCheaper ? "" : "+"}
                        {gap.toFixed(1)} %
                      </span>
                    </td>
                    <td>
                      <a
                        href={
                          competitor.url.startsWith("http")
                            ? competitor.url
                            : `https://${competitor.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#003d88] hover:underline text-sm font-medium"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Voir
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-[#64748b]">Aucun résultat</p>
        ) : null}
      </Card>
    </div>
  );
}
