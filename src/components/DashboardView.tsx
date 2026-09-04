"use client";

import {
  COMPETITOR_PRICES,
  formatPrice,
  PRODUCTS,
} from "@/lib/data";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Package,
  Target,
} from "lucide-react";

export function DashboardView() {
  const alerts = PRODUCTS.map((product) => {
    const competitors = COMPETITOR_PRICES[product.id] ?? [];
    const minCompetitor = competitors.length
      ? Math.min(...competitors.map((c) => c.price))
      : null;
    const isCheaper = minCompetitor !== null && product.ugapPrice < minCompetitor;
    const gap =
      minCompetitor !== null
        ? ((product.ugapPrice - minCompetitor) / minCompetitor) * 100
        : 0;

    return { product, minCompetitor, isCheaper, gap };
  });

  const cheaperCount = alerts.filter((a) => a.isCheaper).length;
  const comparableCount = alerts.filter((a) => a.minCompetitor !== null).length;
  const atRiskCount = alerts.filter((a) => !a.isCheaper && a.minCompetitor !== null).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vue d&apos;ensemble</h1>
          <p className="page-subtitle">
            Synthèse de la position tarifaire UGAP face à la concurrence
          </p>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="stat-label">Références suivies</p>
              <p className="stat-value">{PRODUCTS.length}</p>
              <p className="stat-sub">Échantillon démo multi-catégories</p>
            </div>
            <Package size={20} color="#64748b" />
          </div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="stat-label">Prix inférieurs marché</p>
              <p className="stat-value stat-value-success">{cheaperCount}</p>
              <p className="stat-sub">sur {comparableCount} références comparables</p>
            </div>
            <CheckCircle2 size={20} color="#006233" />
          </div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="stat-label">Alertes concurrence</p>
              <p className="stat-value stat-value-danger">{atRiskCount}</p>
              <p className="stat-sub">Prix supérieur au meilleur concurrent</p>
            </div>
            <AlertTriangle size={20} color="#d20a11" />
          </div>
        </div>
        <div className="stat-card stat-card-neutral">
          <div className="flex justify-between items-center gap-3">
            <div>
              <p className="stat-label">Marge moyenne</p>
              <p className="stat-value">14,2 %</p>
              <p className="stat-sub">Sur l&apos;échantillon démo</p>
            </div>
            <BarChart3 size={20} color="#003d88" />
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="card-header flex justify-between items-center">
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            Position tarifaire par référence
          </h2>
          <span className="badge badge-info">{comparableCount} comparables</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Prix UGAP</th>
                <th>Meilleur concurrent</th>
                <th>Écart</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(({ product, minCompetitor, isCheaper, gap }) => (
                <tr key={product.id}>
                  <td>
                    <p style={{ fontWeight: 500, margin: 0 }}>{product.name}</p>
                    <p className="stat-sub" style={{ margin: "2px 0 0" }}>
                      Réf. {product.reference}
                    </p>
                  </td>
                  <td className="text-muted">{product.category}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(product.ugapPrice)}</td>
                  <td style={{ fontWeight: 500 }}>
                    {minCompetitor !== null ? formatPrice(minCompetitor) : "—"}
                  </td>
                  <td>
                    {minCompetitor !== null ? (
                      <span className={isCheaper ? "text-success" : "text-danger"}>
                        {isCheaper ? (
                          <ArrowDown size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                        ) : (
                          <ArrowUp size={14} style={{ display: "inline", verticalAlign: "middle" }} />
                        )}
                        {Math.abs(gap).toFixed(1)} %
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {minCompetitor === null ? (
                      <span className="text-muted">Non comparé</span>
                    ) : isCheaper ? (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} />
                        Moins cher
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <AlertTriangle size={12} />
                        Concurrence
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex gap-4">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Target size={20} color="#d20a11" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                Périmètre du prototype IA Lab
              </h2>
              <p className="text-muted" style={{ marginTop: 8, lineHeight: 1.6, maxWidth: 48 * 16 }}>
                Deux modules complémentaires : pricing pour les appels d&apos;offres et veille
                continue des prix via scraping intelligent — cas pilote papier Rey Office réf.
                4048313.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
