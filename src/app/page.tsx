"use client";

import { useState } from "react";
import { Sidebar, TopBar, type NavSection } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { TenderPricingView } from "@/components/TenderPricingView";
import { PriceMonitoringView } from "@/components/PriceMonitoringView";

export default function HomePage() {
  const [section, setSection] = useState<NavSection>("dashboard");

  return (
    <div
      className="app-shell"
      style={{ display: "flex", minHeight: "100vh", width: "100%" }}
    >
      <Sidebar active={section} onNavigate={setSection} />
      <div
        className="app-main"
        style={{
          flex: 1,
          marginLeft: "280px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
        }}
      >
        <TopBar section={section} />
        <div className="app-content">
          {section === "dashboard" && <DashboardView />}
          {section === "tender" && <TenderPricingView />}
          {section === "monitoring" && <PriceMonitoringView />}
        </div>
      </div>
    </div>
  );
}
