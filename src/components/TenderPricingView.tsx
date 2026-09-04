"use client";

import { useMemo, useState } from "react";
import {
  COMPETITOR_PRICES,
  COST_DEFAULTS,
  generateNegotiationBrief,
  MARKET_TRENDS,
  PRODUCTS,
  SUPPLIERS,
  formatPercent,
  formatPrice,
  type Product,
  type Supplier,
} from "@/lib/data";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  PageHeader,
} from "@/components/ui";
import {
  Calculator,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";

export function TenderPricingView() {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>(
    SUPPLIERS[PRODUCTS[0].id][0]
  );
  const [costs, setCosts] = useState({ ...COST_DEFAULTS });
  const [quantity, setQuantity] = useState(1000);
  const [showBrief, setShowBrief] = useState(false);

  const suppliers = SUPPLIERS[selectedProduct.id] ?? [];

  const calculations = useMemo(() => {
    const competitors = COMPETITOR_PRICES[selectedProduct.id] ?? [];
    const purchasePrice = selectedSupplier.price;
    const costMultiplier =
      1 +
      (costs.storage + costs.delivery + costs.handling + costs.insurance) / 100;
    const costPrice = purchasePrice * costMultiplier;
    const targetPrice = costPrice * (1 + costs.marginTarget / 100);
    const minCompetitor =
      competitors.length > 0
        ? Math.min(...competitors.map((c) => c.price))
        : null;
    const recommendedPrice =
      minCompetitor !== null
        ? Math.min(targetPrice, minCompetitor * 0.98)
        : targetPrice;
    const margin = ((recommendedPrice - costPrice) / recommendedPrice) * 100;
    const vsCompetitor =
      minCompetitor !== null
        ? ((recommendedPrice - minCompetitor) / minCompetitor) * 100
        : null;

    return {
      purchasePrice,
      costPrice,
      targetPrice,
      recommendedPrice,
      margin,
      minCompetitor,
      vsCompetitor,
      totalRevenue: recommendedPrice * quantity,
      totalCost: costPrice * quantity,
    };
  }, [selectedProduct.id, selectedSupplier, costs, quantity]);

  const competitors = COMPETITOR_PRICES[selectedProduct.id] ?? [];

  function handleProductChange(product: Product) {
    setSelectedProduct(product);
    const firstSupplier = SUPPLIERS[product.id][0];
    setSelectedSupplier(firstSupplier);
    setShowBrief(false);
  }

  const brief = showBrief
    ? generateNegotiationBrief(selectedProduct, selectedSupplier, {
        storage: costs.storage,
        delivery: costs.delivery,
        handling: costs.handling,
        insurance: costs.insurance,
      }, MARKET_TRENDS)
    : null;

  return (
    <div>
      <PageHeader
        title="Pricing Appels d'Offres"
        subtitle="Comparaison concurrents & fournisseurs, hypothèses de coûts et argumentaire de négociation"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#212121]">Référence AO</h2>
            </CardHeader>
            <CardBody className="!pt-0 space-y-2">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductChange(product)}
                  className={clsx(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition-all",
                    selectedProduct.id === product.id
                      ? "border-[#d20a11] bg-[#fef2f2] ring-1 ring-[#d20a11]/20"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  )}
                >
                  <span className="font-medium text-[#212121] line-clamp-2">{product.name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#94a3b8] ml-2" />
                </button>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#212121]">Fournisseur</h2>
            </CardHeader>
            <CardBody className="!pt-0 space-y-2">
              {suppliers.map((supplier) => (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setShowBrief(false);
                  }}
                  className={clsx(
                    "w-full rounded-lg border px-3 py-3 text-left text-sm transition-all",
                    selectedSupplier.id === supplier.id
                      ? "border-[#d20a11] bg-[#fef2f2] ring-1 ring-[#d20a11]/20"
                      : "border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                  )}
                >
                  <p className="font-medium text-[#212121]">{supplier.name}</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">
                    {formatPrice(supplier.price)} · Délai {supplier.leadTimeDays}j · Min.{" "}
                    {supplier.minOrderQty}
                  </p>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#d20a11]" />
                <h2 className="text-sm font-semibold text-[#212121]">
                  Hypothèses de coûts (% du prix achat)
                </h2>
              </div>
            </CardHeader>
            <CardBody className="!pt-0">
              <div className="grid gap-5 sm:grid-cols-2">
              <CostSlider
                label="Stockage"
                value={costs.storage}
                onChange={(v) => setCosts((c) => ({ ...c, storage: v }))}
              />
              <CostSlider
                label="Livraison"
                value={costs.delivery}
                onChange={(v) => setCosts((c) => ({ ...c, delivery: v }))}
              />
              <CostSlider
                label="Manutention"
                value={costs.handling}
                onChange={(v) => setCosts((c) => ({ ...c, handling: v }))}
              />
              <CostSlider
                label="Assurance"
                value={costs.insurance}
                onChange={(v) => setCosts((c) => ({ ...c, insurance: v }))}
              />
              <CostSlider
                label="Marge cible"
                value={costs.marginTarget}
                onChange={(v) => setCosts((c) => ({ ...c, marginTarget: v }))}
                max={30}
              />
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Quantité AO
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                  className="mt-2 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d20a11]/20 focus:border-[#d20a11]"
                  min={1}
                />
              </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-[#212121]">Comparaison concurrentielle</h2>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Concurrent</th>
                    <th>Produit</th>
                    <th>Match</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((c) => (
                    <tr key={c.competitor + c.productName}>
                      <td className="font-medium">{c.competitor}</td>
                      <td className="text-[#64748b]">{c.productName}</td>
                      <td>
                        <Badge variant={c.matchType === "exact" ? "success" : "warning"}>
                          {c.matchType === "exact" ? "Exact" : `Similaire ${c.similarity}%`}
                        </Badge>
                      </td>
                      <td className="font-semibold">{formatPrice(c.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="card border-[#d20a11]/20 bg-gradient-to-br from-[#fef2f2] to-white p-6">
            <h2 className="text-sm font-semibold text-[#212121]">Prix recommandé AO</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <PriceBlock label="Prix achat" value={formatPrice(calculations.purchasePrice)} />
              <PriceBlock label="Coût de revient" value={formatPrice(calculations.costPrice)} />
              <PriceBlock
                label="Prix recommandé"
                value={formatPrice(calculations.recommendedPrice)}
                highlight
              />
              <PriceBlock label="Marge" value={formatPercent(calculations.margin)} />
            </div>
            {calculations.vsCompetitor !== null && (
              <p className="mt-4 text-sm text-slate-600">
                vs meilleur concurrent ({formatPrice(calculations.minCompetitor!)}):{" "}
                <span
                  className={
                    calculations.vsCompetitor < 0
                      ? "font-semibold text-[#006233]"
                      : "font-semibold text-[#d20a11]"
                  }
                >
                  {calculations.vsCompetitor > 0 ? "+" : ""}
                  {calculations.vsCompetitor.toFixed(1)}%
                </span>
              </p>
            )}
            <div className="mt-4 rounded-lg bg-white/80 p-4 text-sm">
              <p>
                <span className="text-slate-500">Revenu total AO :</span>{" "}
                <span className="font-semibold">{formatPrice(calculations.totalRevenue)}</span>
              </p>
              <p className="mt-1">
                <span className="text-slate-500">Coût total :</span>{" "}
                <span className="font-semibold">{formatPrice(calculations.totalCost)}</span>
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#d20a11]" />
                <h2 className="text-sm font-semibold text-[#212121]">Dynamiques de marché</h2>
              </div>
            </CardHeader>
            <CardBody className="!pt-0">
              <div className="flex flex-wrap gap-3">
              {MARKET_TRENDS.map((trend) => (
                <div
                  key={trend.commodity}
                  className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 min-w-[140px]"
                >
                  <p className="text-sm font-medium text-[#212121]">{trend.commodity}</p>
                  <p
                    className={clsx(
                      "text-lg font-bold",
                      trend.changePercent < 0 ? "text-[#006233]" : "text-[#ec7404]"
                    )}
                  >
                    {trend.changePercent > 0 ? "+" : ""}
                    {trend.changePercent}%
                  </p>
                  <p className="text-xs text-[#94a3b8]">{trend.period} · {trend.source}</p>
                </div>
              ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#d20a11]" />
                  <h2 className="text-sm font-semibold text-[#212121]">
                    Argumentaire fournisseur (IA)
                  </h2>
                </div>
                <button type="button" onClick={() => setShowBrief(true)} className="btn-primary">
                  Générer le brief
                </button>
              </div>
            </CardHeader>
            <CardBody className="!pt-0">
            {brief ? (
              <div className="rounded-lg bg-[#f8fafc] p-4 text-sm text-[#475569] whitespace-pre-wrap leading-relaxed">
                {brief.replace(/\*\*/g, "")}
              </div>
            ) : (
              <p className="text-sm text-[#64748b]">
                Génère un argumentaire de négociation basé sur les tendances matières premières,
                les coûts logistiques et la position concurrentielle.
              </p>
            )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CostSlider({
  label,
  value,
  onChange,
  max = 10,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <label className="font-medium text-slate-700">{label}</label>
        <span className="text-slate-500">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[#d20a11]"
      />
    </div>
  );
}

function PriceBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg p-3",
        highlight ? "bg-[#d20a11] text-white" : "bg-white border border-[#e2e8f0]"
      )}
    >
      <p className={clsx("text-xs", highlight ? "text-white/80" : "text-slate-500")}>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
