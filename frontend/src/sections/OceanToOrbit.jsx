import React, { useState } from "react";
import "../styles/storytelling.css";
import Badge from "../components/Badge";
import { Satellite, Radio, Compass, ShieldCheck, Eye, Layers } from "lucide-react";
import earthOrbitImg from "../assets/earth_orbit.png";

/**
 * OceanToOrbit Component — Section 2 of Cinematic Storyline
 * 
 * Implements the "From Ocean to Orbit" section from the design reference:
 * - Constant Watch tag
 * - Photorealistic Planet Earth viewed from Low Earth Orbit (oceans, continents, weather clouds, city lights, atmosphere)
 * - Sentinel-1 radar satellite visual with blue solar panels
 * - Conical radar scan sweep radiating onto the Earth's curved horizon
 * - Telemetry HUD card displaying orbital and microwave radar specifications
 */
export default function OceanToOrbit() {
  const [showRadarGrid, setShowRadarGrid] = useState(true);

  return (
    <section id="orbit" className="os-story-section" aria-label="From Ocean to Orbit">
      <div className="os-story-section__inner">
        {/* Left Narrative Column */}
        <div className="os-story-section__narrative">
          <div className="os-story-section__tag">
            <Radio size={14} className="os-pulse" />
            <span>CONSTANT WATCH</span>
          </div>

          <h2 className="os-story-section__title">From Ocean to Orbit</h2>

          <p className="os-story-section__lead">
            Satellite vision and AI, working together to keep our oceans safe.
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
            <Badge variant="live" dot size="sm">C-BAND SYNTHETIC APERTURE RADAR</Badge>
            <Badge variant="info" size="sm">250 KM SWATH</Badge>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", maxWidth: "380px" }}>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.16)" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>ALTITUDE</span>
              <strong style={{ fontSize: "14px", color: "#FFFFFF" }}>693 km Sun-Sync</strong>
            </div>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.16)" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>FREQUENCY</span>
              <strong style={{ fontSize: "14px", color: "#00D5E8" }}>5.405 GHz (C-Band)</strong>
            </div>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.16)" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>POLARIZATION</span>
              <strong style={{ fontSize: "14px", color: "#FFFFFF" }}>VV + VH Dual-Pol</strong>
            </div>
            <div style={{ padding: "12px", background: "rgba(10, 27, 43, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.16)" }}>
              <span style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", display: "block" }}>REVISIT</span>
              <strong style={{ fontSize: "14px", color: "#00D5E8" }}>6-Day Cycle</strong>
            </div>
          </div>
        </div>

        {/* Right Cinematic Stage: Photorealistic Earth Horizon & Sentinel-1 Satellite */}
        <div className="os-story-section__stage">
          {/* Deep Orbital Space & Atmosphere Backdrop */}
          <div className="os-orbit-backdrop">
            {/* Stars Specks */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7, zIndex: 2 }} aria-hidden="true">
              <circle cx="12%" cy="18%" r="1" fill="#FFFFFF" opacity="0.8" />
              <circle cx="28%" cy="10%" r="1.5" fill="#39A9FF" opacity="0.9" />
              <circle cx="45%" cy="14%" r="1" fill="#FFFFFF" opacity="0.6" />
              <circle cx="68%" cy="7%" r="1.2" fill="#00D5E8" opacity="0.8" />
              <circle cx="82%" cy="19%" r="1" fill="#FFFFFF" opacity="0.6" />
              <circle cx="92%" cy="11%" r="1.4" fill="#39A9FF" opacity="0.7" />
            </svg>

            {/* Photorealistic Planet Earth Horizon */}
            <div className="os-orbit-earth-container">
              <img
                src={earthOrbitImg}
                alt="Planet Earth from Low Earth Orbit with visible blue oceans, detailed continents, clouds and glowing atmosphere"
                className="os-orbit-earth-img"
              />
              <div className="os-orbit-atmosphere-glow" aria-hidden="true" />
              <div className="os-orbit-limb-light" aria-hidden="true" />

              {/* Orbital Ground Track Arcs */}
              {showRadarGrid && (
                <svg
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 6 }}
                  viewBox="0 0 800 500"
                  fill="none"
                >
                  {/* Radar Swath Projection on Earth's Surface */}
                  <polygon
                    points="320,380 620,440 480,490 220,410"
                    fill="rgba(0, 213, 232, 0.12)"
                    stroke="#00D5E8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                  <line x1="680" y1="120" x2="470" y2="430" stroke="rgba(0, 213, 232, 0.6)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="630" y1="110" x2="320" y2="390" stroke="rgba(0, 213, 232, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="340" y="420" fill="#00D5E8" fontSize="10" fontFamily="var(--font-mono)" letterSpacing="1">
                    SAR SWATH FOOTPRINT (250 KM)
                  </text>
                </svg>
              )}
            </div>

            {/* Conical Microwave Radar Scanning Beam */}
            <div className="os-radar-cone" aria-hidden="true" />

            {/* Realistic Vector Sentinel-1 Satellite Model */}
            <div className="os-satellite" aria-hidden="true">
              <svg width="220" height="130" viewBox="0 0 220 130" fill="none">
                {/* Left Solar Panel Array */}
                <g>
                  <rect x="10" y="44" width="70" height="38" rx="2" fill="#0C2E59" stroke="#39A9FF" strokeWidth="1.2" />
                  <line x1="28" y1="44" x2="28" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="46" y1="44" x2="46" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="64" y1="44" x2="64" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="10" y1="63" x2="80" y2="63" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  {/* Solar panel connector arm */}
                  <rect x="80" y="60" width="12" height="6" fill="#718898" />
                </g>

                {/* Central Satellite Body Bus */}
                <g>
                  {/* Main Equipment Bay */}
                  <rect x="92" y="42" width="42" height="46" rx="3" fill="#D4AF37" stroke="#F5D061" strokeWidth="1" />
                  <rect x="96" y="46" width="34" height="38" fill="#1A2D40" />
                  {/* Synthetic Aperture Radar (SAR) Antenna */}
                  <rect x="88" y="88" width="50" height="8" rx="1.5" fill="#00D5E8" />
                  <line x1="88" y1="92" x2="138" y2="92" stroke="#FFFFFF" strokeWidth="1" />
                  {/* Avionics & Optics dish */}
                  <circle cx="113" cy="56" r="7" fill="#39A9FF" stroke="#FFFFFF" strokeWidth="1" />
                  <circle cx="113" cy="56" r="2.5" fill="#00D5E8" />
                  {/* Status telemetry LED */}
                  <circle cx="124" cy="48" r="2" fill="#00F5A0" />
                </g>

                {/* Right Solar Panel Array */}
                <g>
                  <rect x="134" y="60" width="12" height="6" fill="#718898" />
                  <rect x="146" y="44" width="70" height="38" rx="2" fill="#0C2E59" stroke="#39A9FF" strokeWidth="1.2" />
                  <line x1="164" y1="44" x2="164" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="182" y1="44" x2="182" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="200" y1="44" x2="200" y2="82" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                  <line x1="146" y1="63" x2="216" y2="63" stroke="#39A9FF" strokeWidth="0.8" opacity="0.6" />
                </g>
              </svg>
            </div>
          </div>

          {/* Floating Telemetry HUD Card */}
          <div className="os-hud-card os-hud-card--top-right">
            <div className="os-hud-card__title">SATELLITE TELEMETRY</div>
            <div className="os-hud-card__legend-item">
              <span className="os-legend-box" style={{ background: "#00D5E8" }} />
              <span>Copernicus Sentinel-1A (Active)</span>
            </div>
            <div className="os-hud-card__stat-row">
              <span style={{ color: "#94A9B8" }}>Orbit Altitude</span>
              <span className="os-hud-card__stat-val">693 km LEO</span>
            </div>
            <div className="os-hud-card__stat-row">
              <span style={{ color: "#94A9B8" }}>Swath Width</span>
              <span className="os-hud-card__stat-val">250 km (IW Mode)</span>
            </div>
            <div className="os-hud-card__stat-row">
              <span style={{ color: "#94A9B8" }}>Incidence Angle</span>
              <span className="os-hud-card__stat-val">29.1° – 46.0°</span>
            </div>
            <div className="os-hud-card__stat-row" style={{ borderTop: "1px dashed rgba(0, 213, 232, 0.25)" }}>
              <span style={{ color: "#718898" }}>Surface Sensed</span>
              <span style={{ color: "#00F5A0", fontWeight: "700" }}>Global Ocean &amp; Seas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
