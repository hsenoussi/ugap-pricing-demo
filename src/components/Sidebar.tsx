"use client";

import Image from "next/image";
import {
  FileSearch,
  LayoutDashboard,
  Radar,
  Sparkles,
} from "lucide-react";

export type NavSection = "dashboard" | "tender" | "monitoring";

interface SidebarProps {
  active: NavSection;
  onNavigate: (section: NavSection) => void;
}

const NAV_ITEMS: {
  id: NavSection;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}[] = [
  {
    id: "dashboard",
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
    description: "Synthèse & alertes",
  },
  {
    id: "tender",
    label: "Pricing AO",
    icon: FileSearch,
    description: "Appels d'offres",
  },
  {
    id: "monitoring",
    label: "Veille prix",
    icon: Radar,
    description: "Scraping concurrentiel",
  },
];

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside
      className="app-sidebar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "280px",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        zIndex: 40,
      }}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-row">
          <Image
            src="/logo-ugap.svg"
            alt="UGAP"
            width={44}
            height={44}
            className="shrink-0"
            priority
          />
          <div>
            <p className="sidebar-brand-title">UGAP</p>
            <p className="sidebar-brand-sub">Le choix de l&apos;achat juste</p>
          </div>
        </div>
      </div>

      <div className="sidebar-ia-lab">
        <Sparkles size={16} color="#d20a11" style={{ flexShrink: 0 }} />
        <div>
          <p className="sidebar-ia-lab-title">IA Lab</p>
          <p className="sidebar-ia-lab-sub">Pricing Intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Modules</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={isActive ? "nav-item nav-item-active" : "nav-item"}
                >
                  <span className="nav-icon">
                    <Icon
                      size={16}
                      color={isActive ? "#fff" : "#64748b"}
                    />
                  </span>
                  <div>
                    <p className="nav-label">{item.label}</p>
                    <p className="nav-desc">{item.description}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <p style={{ fontWeight: 500, color: "#212121", margin: 0 }}>
          Prototype démo v0.4
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
          Septembre 2026 · IA Lab
        </p>
      </div>
    </aside>
  );
}

export function TopBar({ section }: { section: NavSection }) {
  const titles: Record<NavSection, string> = {
    dashboard: "Vue d'ensemble",
    tender: "Pricing Appels d'Offres",
    monitoring: "Veille Prix Concurrentielle",
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="app-topbar">
      <div>
        <p className="topbar-label">Pricing Intelligence</p>
        <p className="topbar-title">{titles[section]}</p>
      </div>
      <div className="topbar-meta">
        <span className="topbar-date">{today}</span>
        <span className="badge badge-info">Démo IA Lab</span>
      </div>
    </header>
  );
}
