import React, { useState } from "react";
import "../styles/storytelling.css";
import Badge from "../components/Badge";
import DetectionVisualizer from "../components/DetectionVisualizer";
import SarComparisonSlider from "../components/SarComparisonSlider";
import { Eye, ShieldAlert, CheckCircle, Crosshair, Cpu, MapPin, Sliders } from "lucide-react";

/**
 * SpotTheSpill Component — Section 3 of Cinematic Storyline
 * 
 * Supports three presentation modes:
 * 1. SCIENTIFIC CV PIPELINE: Interactive 4-stage OpenCV pipeline (Raw SAR, 4x ESRGAN, Land Mask, Segmented Polygon)
 * 2. BEFORE/AFTER SPLITTER: Interactive before/after swipe slider comparing raw microwave SAR and neural segmentation
 * 3. SATELLITE VIEW: The cinematic concept view with targeting reticle [ ] and SPILL ANALYSIS HUD card
 */
export default function SpotTheSpill() {
  const [viewMode, setViewMode] = useState("slider"); // "slider" | "scientific" | "cinematic"

  return (
    <section id="detection" className="os-story-section" aria-label="Detect the Spill in Real Time">
      <div className="os-story-section__inner">
        {/* Left Narrative Column */}
        <div className="os-story-section__narrative">
          <div className="os-story-section__tag">
            <Eye size={14} className="os-pulse" />
            <span>DETECT</span>
          </div>

          <h2 className="os-story-section__title">Spot the Spill in Real Time</h2>

          <p className="os-story-section__lead">
            AI detects and segments oil spills from satellite imagery with high precision.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <Badge variant="critical" dot size="sm">ANOMALY SEGMENTATION</Badge>
            <Badge variant="info" size="sm">4x ESRGAN ENHANCED</Badge>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: "inline-flex", background: "rgba(5, 11, 20, 0.7)", padding: "4px", borderRadius: "6px", border: "1px solid rgba(0, 213, 232, 0.25)", marginBottom: "20px", flexWrap: "wrap", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: viewMode === "slider" ? "#00D5E8" : "transparent",
                color: viewMode === "slider" ? "#050B14" : "#94A9B8",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <Sliders size={12} />
              COMPARISON SPLITTER
            </button>
            <button
              type="button"
              onClick={() => setViewMode("scientific")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: viewMode === "scientific" ? "#00D5E8" : "transparent",
                color: viewMode === "scientific" ? "#050B14" : "#94A9B8",
                border: "none",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              <Cpu size={12} />
              SCIENTIFIC PIPELINE
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
              <Crosshair size={12} />
              RETICLE HUD
            </button>
          </div>

          {/* Architectural Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", maxWidth: "380px" }}>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(255, 83, 83, 0.25)" }}>
              <span style={{ fontSize: "10px", color: "#FF8B8B", fontFamily: "var(--font-mono)", display: "block" }}>DETECTED AREA</span>
              <strong style={{ fontSize: "16px", color: "#FF5353" }}>42.7 km²</strong>
            </div>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(0, 213, 232, 0.25)" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>CIRCULARITY</span>
              <strong style={{ fontSize: "16px", color: "#00F5A0" }}>0.38 (&lt; 0.70)</strong>
            </div>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.16)", gridColumn: "span 2" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>DISCRIMINATION METHOD</span>
              <strong style={{ fontSize: "12px", color: "#FFFFFF" }}>Otsu binarization + Isoperimetric filter rejects compact algal blooms</strong>
            </div>
          </div>
        </div>

        {/* Right Stage: Interactive Scientific Visualizer, Comparison Splitter, or Cinematic Reticle */}
        <div className="os-story-section__stage" style={{ minHeight: "440px" }}>
          {viewMode === "slider" ? (
            <SarComparisonSlider height="420px" />
          ) : viewMode === "scientific" ? (
            <DetectionVisualizer />
          ) : (
            <div className="os-detection-stage">
              {/* Coastal Landmass & Ocean Vector Simulation */}
              <svg
                className="os-detection-coastal"
                viewBox="0 0 600 380"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="coastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1B3322" />
                    <stop offset="60%" stopColor="#2A4834" />
                    <stop offset="100%" stopColor="#13271A" />
                  </linearGradient>

                  <linearGradient id="seaWater" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#04121F" />
                    <stop offset="50%" stopColor="#072033" />
                    <stop offset="100%" stopColor="#051624" />
                  </linearGradient>

                  <filter id="slickGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <rect width="600" height="380" fill="url(#seaWater)" />

                <path
                  d="M 0 0 L 260 0 C 230 60, 210 110, 180 150 C 150 190, 110 240, 80 290 C 50 340, 20 370, 0 380 Z"
                  fill="url(#coastGradient)"
                  opacity="0.85"
                />
                <path
                  d="M 260 0 C 230 60, 210 110, 180 150 C 150 190, 110 240, 80 290 C 50 340, 20 370, 0 380"
                  stroke="#3E6B4B"
                  strokeWidth="2.5"
                  fill="none"
                />

                <g className="os-slick-polygon" filter="url(#slickGlow)">
                  <path
                    d="M 330 160 C 370 145, 410 170, 435 185 C 460 200, 480 205, 510 215 C 500 230, 470 235, 440 230 C 410 225, 380 205, 360 200 C 340 195, 310 185, 330 160 Z"
                    fill="rgba(255, 83, 83, 0.85)"
                    stroke="#FF5353"
                    strokeWidth="2"
                  />
                </g>

                <path
                  d="M 320 150 C 365 135, 415 160, 445 178 C 475 195, 495 200, 525 210 C 512 240, 475 248, 435 242 C 400 238, 370 215, 350 210 C 328 202, 298 190, 320 150 Z"
                  fill="none"
                  stroke="#00D5E8"
                  strokeWidth="1.8"
                  strokeDasharray="6 6"
                  opacity="0.95"
                />
              </svg>

              <div className="os-reticle-frame" aria-hidden="true">
                <span className="os-bracket os-bracket--tl" />
                <span className="os-bracket os-bracket--tr" />
                <span className="os-bracket os-bracket--bl" />
                <span className="os-bracket os-bracket--br" />
              </div>

              <div className="os-hud-card os-hud-card--top-right">
                <div className="os-hud-card__title">SPILL ANALYSIS</div>
                <div className="os-hud-card__legend-item">
                  <span className="os-legend-box os-legend-box--coral" />
                  <span>Oil Spill (Detected)</span>
                </div>
                <div className="os-hud-card__legend-item">
                  <span className="os-legend-box os-legend-box--cyan-dash" />
                  <span>Segmentation Mask</span>
                </div>
                <div className="os-hud-card__stat-row">
                  <span style={{ color: "#94A9B8" }}>Area:</span>
                  <span className="os-hud-card__stat-val" style={{ color: "#FF5353" }}>42.7 km²</span>
                </div>
                <div className="os-hud-card__stat-row">
                  <span style={{ color: "#94A9B8" }}>Circularity:</span>
                  <span className="os-hud-card__stat-val" style={{ color: "#00F5A0" }}>0.38 (&lt; 0.70)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
