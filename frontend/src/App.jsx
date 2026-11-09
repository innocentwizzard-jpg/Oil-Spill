import React from "react";
import "./App.css";
import "./styles/storytelling.css";
import Navigation from "./components/Navigation";
import ScrollTimeline from "./components/ScrollTimeline";
import OceanHero from "./components/OceanHero";
import OceanToOrbit from "./sections/OceanToOrbit";
import SpotTheSpill from "./sections/SpotTheSpill";
import PredictAndProtect from "./sections/PredictAndProtect";
import PlatformIntro from "./sections/PlatformIntro";
import CommandCenter from "./pages/CommandCenter";
import Badge from "./components/Badge";

/**
 * Ocean Sentinel — Main Application
 * 
 * Implements a continuous 5-stage cinematic storytelling pipeline:
 * - 01 Hero (0–3s)               --> OceanHero component (Atmospheric underwater, volumetric light, particles)
 * - 02 From Ocean to Orbit (3–6s)--> OceanToOrbit section (Earth curvature, Sentinel-1 radar satellite, conical beam)
 * - 03 Spot the Spill (6–9s)     --> SpotTheSpill section (Coastal radar view, segmented coral slick polygon, HUD stats)
 * - 04 Predict & Protect (9–12s) --> PredictAndProtect section (Ocean currents, 72h drift trajectory cones)
 * - 05 The Platform (12–15s)     --> PlatformIntro section + live operational CommandCenter dashboard
 */
function App() {
  return (
    <div className="os-app">
      {/* Left-Side Sticky Storyline Progress Tracker */}
      <ScrollTimeline />

      {/* Global Sticky Maritime Navigation Bar */}
      <Navigation />

      {/* =====================================================================
          SECTION 1: THE OCEAN (0–3s)
          ===================================================================== */}
      <OceanHero />

      {/* =====================================================================
          SECTION 2: FROM OCEAN TO ORBIT (3–6s)
          ===================================================================== */}
      <OceanToOrbit />

      {/* =====================================================================
          SECTION 3: SPOT THE SPILL IN REAL TIME (6–9s)
          ===================================================================== */}
      <SpotTheSpill />

      {/* =====================================================================
          SECTION 4: TRACK, FORECAST AND PROTECT (9–12s)
          ===================================================================== */}
      <PredictAndProtect />

      {/* =====================================================================
          SECTION 5: THE OCEAN INTELLIGENCE PLATFORM (12–15s)
          ===================================================================== */}
      <PlatformIntro />

      {/* =====================================================================
          OPERATIONAL COMMAND CENTER TACTICAL DASHBOARD CONSOLE
          ===================================================================== */}
      <div id="command-center-console" style={{ scrollMarginTop: "80px", borderTop: "1px solid rgba(0, 213, 232, 0.25)", background: "#050B14" }}>
        <div style={{ padding: "40px 24px 0", maxWidth: "1360px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div className="eyebrow-tag">TACTICAL COMMAND CONSOLE</div>
            <Badge variant="live" dot pulse size="sm">LIVE MISSION OPERATIONS</Badge>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "4px 0 8px" }}>
            Maritime Intelligence Tactical Command Center
          </h2>
          <p style={{ color: "#94A9B8", fontSize: "14px", margin: 0, maxWidth: "780px" }}>
            Real-time geospatial console combining live AccessAIS vessel telemetry, Lagrangian hydrodynamic drift simulation, SOG/COG kinematic anomaly alerts, and automated Coast Guard emergency dispatch.
          </p>
        </div>

        {/* Existing Operational CommandCenter Dashboard Component */}
        <CommandCenter />
      </div>

      {/* Global Maritime Intelligence Footer */}
      <footer style={{ borderTop: "1px solid rgba(57, 169, 255, 0.16)", background: "#02060B", padding: "40px 24px", color: "#718898", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ color: "#FFFFFF", fontWeight: "700" }}>OCEAN SENTINEL</span> — Smart India Hackathon PS ID 1655 / NTRO
            <div style={{ marginTop: "4px", color: "#4E6778" }}>
              Detecting Oil Spills in Marine Environment using AIS and Satellite Datasets.
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>CPU-OPTIMIZED</span>
            <span>ZERO-FABRICATION GUARANTEE</span>
            <span>WGS-84 EPSG:4326</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
