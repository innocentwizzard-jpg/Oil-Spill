import React, { useState } from "react";
import "../styles/storytelling.css";
import Badge from "../components/Badge";
import DriftVisualizer from "../components/DriftVisualizer";
import { Waves, Compass, Wind, Navigation as NavIcon, Sliders, Activity } from "lucide-react";

/**
 * PredictAndProtect Component — Section 4 of Cinematic Storyline
 * 
 * Supports two presentation modes:
 * 1. SIMULATOR: Interactive Lagrangian hydrodynamic drift prediction calling POST /drift
 * 2. STREAMLINES: The cinematic ocean current flow with 72h trajectory cones from the design concept
 */
export default function PredictAndProtect() {
  const [viewMode, setViewMode] = useState("simulator"); // "simulator" | "cinematic"

  return (
    <section id="drift" className="os-story-section" aria-label="Track, Forecast and Protect">
      <div className="os-story-section__inner">
        {/* Left Narrative Column */}
        <div className="os-story-section__narrative">
          <div className="os-story-section__tag">
            <Waves size={14} className="os-pulse" />
            <span>PREDICT</span>
          </div>

          <h2 className="os-story-section__title">Track, Forecast and Protect</h2>

          <p className="os-story-section__lead">
            Model spill movement, understand its impact, and act before it spreads.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <Badge variant="live" dot size="sm">LAGRANGIAN HYDRODYNAMICS</Badge>
            <Badge variant="info" size="sm">72-HOUR TRAJECTORY</Badge>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: "inline-flex", background: "rgba(5, 11, 20, 0.7)", padding: "4px", borderRadius: "6px", border: "1px solid rgba(0, 213, 232, 0.25)", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => setViewMode("simulator")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: viewMode === "simulator" ? "#00D5E8" : "transparent",
                color: viewMode === "simulator" ? "#050B14" : "#94A9B8",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <Sliders size={12} />
              DRIFT SIMULATOR
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cinematic")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: viewMode === "cinematic" ? "#00D5E8" : "transparent",
                color: viewMode === "cinematic" ? "#050B14" : "#94A9B8",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <Activity size={12} />
              STREAMLINES VIEW
            </button>
          </div>

          <div style={{ width: "100%", maxWidth: "380px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(0, 213, 232, 0.2)", padding: "14px", marginBottom: "16px" }}>
            <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block", marginBottom: "4px" }}>
              GOVERNING DRIFT EQUATION
            </span>
            <code style={{ fontSize: "13px", color: "#00D5E8", fontWeight: "700", fontFamily: "var(--font-mono)" }}>
              V_oil = V_current + 0.03 · V_wind
            </code>
            <p style={{ fontSize: "11px", color: "#94A9B8", margin: "6px 0 0", lineHeight: "1.5" }}>
              Advection via Euler-Lagrange numerical integration at 10-minute timesteps with Fay spreading physics.
            </p>
          </div>
        </div>

        {/* Right Stage: Interactive Simulator or Cinematic Ocean Streamlines */}
        <div className="os-story-section__stage" style={{ minHeight: "440px" }}>
          {viewMode === "simulator" ? (
            <DriftVisualizer />
          ) : (
            <div className="os-drift-stage">
              <svg
                viewBox="0 0 600 380"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D5E8" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#39A9FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00D5E8" stopOpacity="0.1" />
                  </linearGradient>

                  <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#39A9FF" stopOpacity="0.1" />
                    <stop offset="60%" stopColor="#00D5E8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#39A9FF" stopOpacity="0.2" />
                  </linearGradient>

                  <pattern id="navGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 213, 232, 0.04)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="600" height="380" fill="url(#navGrid2)" />

                <path
                  className="os-current-spline"
                  d="M 20 280 C 140 290, 220 250, 310 210 C 400 170, 480 180, 580 140"
                  stroke="url(#streamGrad1)"
                  strokeWidth="2.5"
                  fill="none"
                />
                <path
                  className="os-current-spline"
                  d="M 50 320 C 170 330, 260 270, 340 230 C 420 190, 490 200, 590 170"
                  stroke="url(#streamGrad2)"
                  strokeWidth="1.8"
                  fill="none"
                  style={{ animationDelay: "-3s" }}
                />
                <path
                  className="os-current-spline"
                  d="M 0 240 C 120 250, 200 210, 290 180 C 370 150, 450 160, 560 120"
                  stroke="url(#streamGrad1)"
                  strokeWidth="1.5"
                  fill="none"
                  style={{ animationDelay: "-6s" }}
                />
                <path
                  className="os-current-spline"
                  d="M 80 350 C 200 360, 290 300, 370 250 C 450 200, 520 220, 600 190"
                  stroke="url(#streamGrad2)"
                  strokeWidth="2"
                  fill="none"
                  style={{ animationDelay: "-9s" }}
                />

                <g stroke="#00D5E8" strokeWidth="1.5" fill="none" opacity="0.75">
                  <path d="M 230 250 L 250 242 L 246 254" />
                  <path d="M 360 205 L 380 197 L 376 209" />
                  <path d="M 480 175 L 500 168 L 496 180" />
                </g>

                <path
                  d="M 220 250 C 240 240, 270 255, 290 265 C 280 280, 250 285, 230 275 Z"
                  fill="rgba(255, 83, 83, 0.85)"
                  stroke="#FF5353"
                  strokeWidth="2"
                />

                <path
                  d="M 280 235 C 315 215, 345 225, 375 235 C 365 255, 330 260, 295 250 Z"
                  fill="rgba(255, 159, 67, 0.45)"
                  stroke="#FF9F43"
                  strokeWidth="1.8"
                />

                <path
                  d="M 350 200 C 390 180, 430 190, 465 200 C 450 225, 410 230, 370 220 Z"
                  fill="rgba(254, 202, 87, 0.35)"
                  stroke="#FECA57"
                  strokeWidth="1.5"
                />

                <path
                  d="M 420 165 C 470 145, 520 155, 565 170 C 550 200, 490 205, 445 190 Z"
                  fill="rgba(0, 213, 232, 0.18)"
                  stroke="#00D5E8"
                  strokeWidth="1.8"
                  strokeDasharray="6 6"
                />

                <path
                  d="M 255 260 Q 340 230, 490 180"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  fill="none"
                  opacity="0.8"
                />
              </svg>

              <div className="os-hud-card os-hud-card--top-right">
                <div className="os-hud-card__title">SPILL TRAJECTORY (72H)</div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "rgba(255, 83, 83, 0.2)", border: "1px solid #FF5353", borderRadius: "12px", fontSize: "10px", color: "#FF5353", fontWeight: "700" }}>
                    Now
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "rgba(255, 159, 67, 0.2)", border: "1px solid #FF9F43", borderRadius: "12px", fontSize: "10px", color: "#FF9F43", fontWeight: "700" }}>
                    24 h
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "rgba(254, 202, 87, 0.2)", border: "1px solid #FECA57", borderRadius: "12px", fontSize: "10px", color: "#FECA57", fontWeight: "700" }}>
                    48 h
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", background: "rgba(0, 213, 232, 0.15)", border: "1px dashed #00D5E8", borderRadius: "12px", fontSize: "10px", color: "#00D5E8", fontWeight: "700" }}>
                    72 h
                  </span>
                </div>

                <div className="os-hud-card__stat-row">
                  <span style={{ color: "#94A9B8" }}>Ocean Current:</span>
                  <span className="os-hud-card__stat-val">1.8 kn (242° SW)</span>
                </div>

                <div className="os-hud-card__stat-row">
                  <span style={{ color: "#94A9B8" }}>Wind Forcing:</span>
                  <span className="os-hud-card__stat-val">14.5 kn NW (3%)</span>
                </div>

                <div className="os-hud-card__stat-row">
                  <span style={{ color: "#94A9B8" }}>Coastline ETA:</span>
                  <span className="os-hud-card__stat-val" style={{ color: "#FFB020" }}>~ 56 hours</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
