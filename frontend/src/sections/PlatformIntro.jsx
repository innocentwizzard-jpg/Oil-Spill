import React from "react";
import "../styles/storytelling.css";
import Button from "../components/Button";
import Badge from "../components/Badge";
import { Terminal, Compass, ExternalLink, ArrowRight, ShieldCheck, Activity } from "lucide-react";

/**
 * PlatformIntro Component — Section 5 of Cinematic Storyline
 * 
 * Implements "The Ocean Intelligence Platform" section from the design reference:
 * - Act tag
 * - Title: The Ocean Intelligence Platform
 * - Lead: From detection to decision — a unified platform for a cleaner, safer ocean.
 * - Primary CTA: Launch Platform ↗
 * - Right visual: Tactical command console preview with Spill Area, Spread Risk, and Coastline ETA
 */
export default function PlatformIntro() {
  const handleLaunchClick = (e) => {
    e.preventDefault();
    const target = document.getElementById("command-center-console");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const jumpToModule = (tabId) => {
    if (window.history.replaceState) {
      window.history.replaceState(null, "", `#${tabId}`);
    }
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const target = document.getElementById("command-center-console");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="command-center" className="os-story-section" aria-label="The Ocean Intelligence Platform">
      <div className="os-story-section__inner">
        {/* Left Narrative Column */}
        <div className="os-story-section__narrative">
          <div className="os-story-section__tag">
            <Terminal size={14} className="os-pulse" />
            <span>ACT</span>
          </div>

          <h2 className="os-story-section__title">The Ocean Intelligence Platform</h2>

          <p className="os-story-section__lead">
            From detection to decision — a unified platform for a cleaner, safer ocean.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
            <Button
              href="#command-center-console"
              onClick={handleLaunchClick}
              variant="primary"
              size="lg"
              icon={ExternalLink}
              iconPosition="right"
            >
              Launch Platform
            </Button>
            <Badge variant="live" dot size="sm">
              OPERATIONAL M1–M4
            </Badge>
          </div>

          {/* Quick Access Module Jump Bar */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            <button
              type="button"
              onClick={() => jumpToModule("dashboard")}
              style={{ background: "rgba(0, 213, 232, 0.1)", border: "1px solid rgba(0, 213, 232, 0.3)", color: "#00D5E8", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => jumpToModule("detection")}
              style={{ background: "rgba(57, 169, 255, 0.1)", border: "1px solid rgba(57, 169, 255, 0.3)", color: "#39A9FF", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Detection
            </button>
            <button
              type="button"
              onClick={() => jumpToModule("prediction")}
              style={{ background: "rgba(0, 245, 160, 0.1)", border: "1px solid rgba(0, 245, 160, 0.3)", color: "#00F5A0", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Prediction
            </button>
            <button
              type="button"
              onClick={() => jumpToModule("maps")}
              style={{ background: "rgba(255, 183, 3, 0.1)", border: "1px solid rgba(255, 183, 3, 0.3)", color: "#FFB703", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Maps
            </button>
            <button
              type="button"
              onClick={() => jumpToModule("alerts")}
              style={{ background: "rgba(255, 83, 83, 0.1)", border: "1px solid rgba(255, 83, 83, 0.3)", color: "#FF5353", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Alerts
            </button>
            <button
              type="button"
              onClick={() => jumpToModule("reports")}
              style={{ background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#FFFFFF", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: "700", cursor: "pointer" }}
            >
              Reports
            </button>
          </div>

          <p style={{ fontSize: "12px", color: "#718898", margin: 0, lineHeight: "1.6" }}>
            Integrated with NOAA AccessAIS, Copernicus Sentinel-1 SAR, and automated Indian Coast Guard emergency dispatch alerting.
          </p>
        </div>

        {/* Right Cinematic Stage: Tactical Command Bridge Console Preview */}
        <div className="os-story-section__stage">
          <div className="os-platform-preview">
            {/* Console Screen Top Bar */}
            <div className="os-platform-preview__header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00F5A0", boxShadow: "0 0 6px #00F5A0" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", color: "#FFFFFF" }}>
                  OCEAN SENTINEL // TACTICAL CONSOLE
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(0, 213, 232, 0.15)", color: "#00D5E8", borderRadius: "3px", fontFamily: "var(--font-mono)" }}>
                  SECURE
                </span>
                <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(57, 169, 255, 0.15)", color: "#39A9FF", borderRadius: "3px", fontFamily: "var(--font-mono)" }}>
                  LIVE FEED
                </span>
              </div>
            </div>

            {/* Tactical Console Grid */}
            <div className="os-platform-preview__grid">
              {/* Left Screen Area: Simulated Radar Scan View */}
              <div
                style={{
                  background: "#030c18",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 213, 232, 0.18)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Radar Grid Circles */}
                <div style={{ position: "absolute", width: "180px", height: "180px", borderRadius: "50%", border: "1px solid rgba(0, 213, 232, 0.12)" }} />
                <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", border: "1px solid rgba(0, 213, 232, 0.16)" }} />
                <div style={{ position: "absolute", inset: "50% 0 0 0", borderTop: "1px dashed rgba(0, 213, 232, 0.1)" }} />
                <div style={{ position: "absolute", inset: "0 0 0 50%", borderLeft: "1px dashed rgba(0, 213, 232, 0.1)" }} />

                {/* Sensed Oil Slick Shape */}
                <svg width="180" height="120" viewBox="0 0 180 120" style={{ zIndex: 3 }}>
                  <path
                    d="M 40 50 C 65 35, 110 50, 135 60 C 120 80, 80 85, 45 70 Z"
                    fill="rgba(255, 83, 83, 0.75)"
                    stroke="#FF5353"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M 35 45 C 65 30, 115 45, 142 58 C 125 85, 80 90, 40 75 Z"
                    fill="none"
                    stroke="#00D5E8"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                </svg>

                <div style={{ position: "absolute", bottom: "10px", left: "10px", fontSize: "10px", fontFamily: "var(--font-mono)", color: "#00D5E8" }}>
                  <span>LAT 18.92°N // LON 72.84°E</span>
                </div>
              </div>

              {/* Right Telemetry Column (Matches Reference Image) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "12px", background: "rgba(5, 11, 20, 0.7)", borderRadius: "4px", border: "1px solid rgba(57, 169, 255, 0.12)" }}>
                  <span style={{ fontSize: "10px", color: "#718898", display: "block" }}>Spill Area</span>
                  <strong style={{ fontSize: "16px", color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>42.7 km²</strong>
                </div>

                <div style={{ padding: "12px", background: "rgba(5, 11, 20, 0.7)", borderRadius: "4px", border: "1px solid rgba(255, 83, 83, 0.2)" }}>
                  <span style={{ fontSize: "10px", color: "#FF8B8B", display: "block" }}>Spread Risk</span>
                  <strong style={{ fontSize: "16px", color: "#FF5353", fontFamily: "var(--font-mono)" }}>High</strong>
                </div>

                <div style={{ padding: "12px", background: "rgba(5, 11, 20, 0.7)", borderRadius: "4px", border: "1px solid rgba(255, 183, 3, 0.2)" }}>
                  <span style={{ fontSize: "10px", color: "#FFB703", display: "block" }}>ETA (Coastline)</span>
                  <strong style={{ fontSize: "16px", color: "#FFB020", fontFamily: "var(--font-mono)" }}>≈ 56 h</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
