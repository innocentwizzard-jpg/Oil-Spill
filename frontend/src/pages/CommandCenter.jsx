import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Waves,
  Eye,
  Crosshair,
  Compass,
  LayoutDashboard,
  Map as MapIcon,
  FileText,
  Radio,
  Layers,
  ChevronRight,
} from "lucide-react";

import VesselLeaderboard from "../components/VesselLeaderboard";
import IncidentMap from "../components/IncidentMap";
import GlobalMap from "../components/GlobalMap";
import ErrorBoundary from "../components/ErrorBoundary";
import AnomalyPanel from "../components/AnomalyPanel";
import DetectionVisualizer from "../components/DetectionVisualizer";
import DriftVisualizer from "../components/DriftVisualizer";
import AlertsConsole from "../components/AlertsConsole";
import ReportViewer from "../components/ReportViewer";
import Badge from "../components/Badge";

import {
  getHealth,
  getSuspects,
  getVessels,
  runSegmentation,
  calculateDrift,
  dispatchAlert,
  VERIFIED_FIXTURE_SLICK,
} from "../services/api";

/**
 * CommandCenter Component — Ocean Sentinel Tactical Command Center
 * 
 * Integrated operational command platform providing multi-view tactical access:
 * - DASHBOARD: Combined mission overview (Map, Key Metrics, Dispatch, Drift Timeline, Anomalies, Suspects)
 * - DETECTION: Full scientific SAR 4-stage computer vision suite & segmentation analytics
 * - PREDICTION: Lagrangian hydrodynamic transport modeling & coastal proximity simulation
 * - MAPS: Expanded full-screen geospatial GIS intelligence map
 * - ALERTS: Dedicated emergency alert dispatcher, audit logs, and Coast Guard notification
 * - REPORTS: Official mission report generator, viewer, and multi-format export suite
 */
function CommandCenter() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mapViewMode, setMapViewMode] = useState("global");
  const [systemOnline, setSystemOnline] = useState(false);
  const [alertStatus, setAlertStatus] = useState("READY");
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertDetails, setAlertDetails] = useState(null);
  const [suspects, setSuspects] = useState([]);
  const [vesselsCount, setVesselsCount] = useState(0);
  const [slickData, setSlickData] = useState(VERIFIED_FIXTURE_SLICK);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [driftData, setDriftData] = useState(null);
  const [driftLoading, setDriftLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // URL Hash synchronization for operational tabs
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace("#", "");
      if (["dashboard", "detection", "prediction", "maps", "alerts", "reports"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Smoothly update URL hash without scrolling jump
    if (window.history.replaceState) {
      window.history.replaceState(null, "", `#${tabId}`);
    }
  };

  // Check backend health & telemetry on load
  useEffect(() => {
    let mounted = true;

    async function initSystem() {
      try {
        const health = await getHealth();
        if (mounted && health.status === "ok") {
          setSystemOnline(true);
        }
      } catch (err) {
        console.warn("Backend health check:", err.message);
        if (mounted) setSystemOnline(false);
      }

      try {
        const allVessels = await getVessels();
        if (mounted) setVesselsCount(allVessels.length);
      } catch (err) {
        console.warn("Vessels fetch error:", err.message);
      }

      try {
        const rankedSuspects = await getSuspects();
        if (mounted) setSuspects(rankedSuspects);
      } catch (err) {
        console.log("Suspects status:", err.message);
      }
    }

    initSystem();
    return () => {
      mounted = false;
    };
  }, []);

  const topSuspect = suspects.length > 0 ? suspects[0] : null;

  // Real alert dispatch triggered by user
  const handleDispatchAlert = async () => {
    try {
      setAlertLoading(true);
      setAlertStatus("DISPATCHING...");
      setErrorMessage("");

      const payload = topSuspect
        ? {
            incident: "Marine Oil Spill Incident",
            priority: topSuspect.riskTier || "HIGH",
            vessel: topSuspect.vessel,
            score: topSuspect.score,
          }
        : {};

      const response = await dispatchAlert(payload);

      if (response.status === "success" && response.alert) {
        setAlertStatus("ALERT SENT");
        setAlertDetails(response.alert);
      } else {
        throw new Error("Unexpected alert response schema");
      }
    } catch (error) {
      console.error("Alert dispatch error:", error);
      setAlertStatus("DISPATCH FAILED");
      setErrorMessage(error.message || "Failed to dispatch alert.");
    } finally {
      setAlertLoading(false);
    }
  };

  // Run Member 1 Segmentation
  const handleRunSegmentation = async () => {
    try {
      setSegmentLoading(true);
      setErrorMessage("");
      const res = await runSegmentation({
        roi_lat: 19.5,
        roi_lon: 71.4,
        timestamp: "2025-05-01T12:00:00+00:00",
      });
      setSlickData(res);
    } catch (err) {
      console.error("Segmentation error:", err);
      setErrorMessage("Segmentation error: " + err.message);
    } finally {
      setSegmentLoading(false);
    }
  };

  // Run Member 2 Drift
  const handleRunDrift = async () => {
    try {
      setDriftLoading(true);
      setErrorMessage("");
      const driftPayload = {
        slick: {
          polygon: slickData?.polygon || null,
          centroid: slickData?.centroid || { lat: 19.5, lon: 71.4 },
          area_sq_km: slickData?.area_sq_km || 0.0406,
          perimeter_km: slickData?.perimeter_km || 0.985,
          observation_timestamp: slickData?.observation_timestamp || "2025-05-01T12:00:00Z",
        },
        environment: {
          wind_speed: 14.5,
          wind_deg: 315.0,
          current_speed: 1.8,
          current_deg: 242.0,
          convention: "toward",
        },
        elapsed_hours: 2.0,
        forecast_hours: 5,
      };
      const result = await calculateDrift(driftPayload);
      setDriftData(result);

      // Fetch newly correlated suspects from Member 3
      const ranked = await getSuspects();
      setSuspects(ranked);
    } catch (err) {
      console.error("Drift simulation error:", err);
      setErrorMessage("Drift simulation error: " + err.message);
    } finally {
      setDriftLoading(false);
    }
  };

  const trajectory = driftData?.forecast?.map((pt) => ({
    time: `+${pt.hour}h`,
    label: `FC ${pt.hour}H`,
    latitude: pt.lat,
    longitude: pt.lon,
  })) || [];

  const navigationTabs = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "detection", label: "DETECTION", icon: Crosshair, badge: "CV" },
    { id: "prediction", label: "PREDICTION", icon: Compass, badge: "DRIFT" },
    { id: "maps", label: "MAPS", icon: MapIcon },
    { id: "alerts", label: "ALERTS", icon: Bell, badge: alertDetails ? "SENT" : "READY", alertBadge: true },
    { id: "reports", label: "REPORTS", icon: FileText, badge: "NOS-DCP" },
  ];

  return (
    <div className="command-center">
      {/* Tactical Top Bar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Waves size={24} />
          </div>

          <div>
            <h1>OCEAN SENTINEL</h1>
            <span>MARITIME OIL SPILL SURVEILLANCE &amp; ATTRIBUTION</span>
          </div>
        </div>

        <div className="system-status">
          <span className={`status-dot ${systemOnline ? "" : "offline"}`} />
          {systemOnline ? "BACKEND OPERATIONAL" : "STANDALONE / FIXTURE MODE"}
        </div>
      </header>

      {/* Operational Navigation Tabs Bar */}
      <nav className="command-center-nav-bar" aria-label="Command Center Modules">
        <div className="command-center-tabs">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`command-center-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`command-center-tab-badge ${
                      tab.alertBadge && alertDetails ? "badge-alert" : ""
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "#718898" }}>
          <span>ACTIVE SECTOR:</span>
          <span style={{ color: "#00D5E8", fontWeight: "700" }}>ARABIAN SEA (19.5°N, 71.4°E)</span>
        </div>
      </nav>

      {/* =========================================================================
          VIEW 1: INTEGRATED MISSION DASHBOARD
          ========================================================================= */}
      {activeTab === "dashboard" && (
        <main className="dashboard">
          <section className="hero-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">LIVE INCIDENT MONITOR</span>
                <h2>Autonomous Maritime Surveillance</h2>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={handleRunSegmentation}
                  disabled={segmentLoading}
                  style={{
                    background: "rgba(0, 213, 232, 0.15)",
                    border: "1px solid #00D5E8",
                    color: "#00D5E8",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Crosshair size={13} />
                  {segmentLoading ? "SEGMENTING..." : "RUN POST /segment"}
                </button>

                <div className="incident-status">
                  <AlertTriangle size={16} />
                  ATTRIBUTION READY
                </div>
              </div>
            </div>

            <ErrorBoundary fallbackMessage="Incident tactical map temporarily unavailable. Please retry.">
              <IncidentMap
                trajectory={trajectory}
                origin={driftData?.origin ? { latitude: driftData.origin.lat, longitude: driftData.origin.lon } : null}
                detected={slickData ? {
                  latitude: slickData.centroid?.lat,
                  longitude: slickData.centroid?.lon,
                  polygon: slickData.polygon,
                  area_sq_km: slickData.area_sq_km,
                  perimeter_km: slickData.perimeter_km,
                  circularity: slickData.circularity,
                } : null}
              />
            </ErrorBoundary>
          </section>

          <aside className="intelligence-panel">
            <div className="panel-title">
              <ShieldCheck size={18} />
              INCIDENT INTELLIGENCE
            </div>

            <div className="metric">
              <span>VESSELS IN CORRIDOR</span>
              <strong>{vesselsCount > 0 ? String(vesselsCount).padStart(2, "0") : "04"}</strong>
            </div>

            <div className="metric">
              <span>DETECTED AREA</span>
              <strong style={{ color: "#FF5353" }}>
                {slickData?.area_sq_km ? `${slickData.area_sq_km.toFixed(4)} km²` : "0.0406 km²"}
              </strong>
            </div>

            <div className="metric">
              <span>SHORE PROXIMITY</span>
              <strong style={{ color: "#00D5E8" }}>
                {driftData?.coastal_impact?.distance_to_shore_km || 18.4} km
              </strong>
              <span style={{ color: "#00F5A0", fontSize: "10px", marginTop: "2px" }}>
                Threat: Negative within 5h window
              </span>
            </div>

            <div className="metric">
              <span>PRIME ATTRIBUTION</span>
              <strong>{topSuspect ? topSuspect.vessel : "Awaiting Run"}</strong>
              {topSuspect && (
                <span style={{ color: "#ff887d", fontSize: "11px", marginTop: "4px" }}>
                  Score: {topSuspect.score}% ({topSuspect.riskTier})
                </span>
              )}
            </div>

            <button
              className={`alert-button ${
                alertStatus === "ALERT SENT" ? "alert-sent" : ""
              }`}
              onClick={handleDispatchAlert}
              disabled={alertLoading}
            >
              {alertStatus === "ALERT SENT" ? <CheckCircle2 size={17} /> : <Bell size={17} />}
              {alertLoading ? "DISPATCHING..." : alertStatus === "ALERT SENT" ? "ALERT DISPATCHED" : "DISPATCH EMERGENCY ALERT"}
            </button>

            {alertDetails && (
              <div style={{ marginTop: "14px", padding: "10px", background: "rgba(103, 232, 165, 0.08)", border: "1px solid rgba(103, 232, 165, 0.3)", borderRadius: "8px", fontSize: "11px" }}>
                <div style={{ color: "#67e8a5", fontWeight: 700 }}>EMERGENCY ALERT RECORDED</div>
                <div>Suspect: {alertDetails.top_suspect || alertDetails.suspect_vessel}</div>
                <div>Priority: {alertDetails.priority}</div>
                <div>Recipient: {alertDetails.recipient || "Indian Coast Guard MRCC Mumbai"}</div>
                <div>Status: DELIVERED</div>
              </div>
            )}

            {errorMessage && (
              <div style={{ marginTop: "12px", color: "#ff725f", fontSize: "11px" }}>
                {errorMessage}
              </div>
            )}
          </aside>

          <section className="bottom-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(120, 190, 210, 0.1)", paddingBottom: "12px" }}>
              <div className="panel-title" style={{ paddingBottom: 0, borderBottom: "none" }}>
                <Activity size={18} />
                DRIFT RECONSTRUCTION TRAJECTORY
              </div>
              <button
                onClick={handleRunDrift}
                disabled={driftLoading}
                style={{
                  background: "rgba(83, 213, 230, 0.12)",
                  border: "1px solid rgba(83, 213, 230, 0.4)",
                  color: "#53d5e6",
                  borderRadius: "7px",
                  padding: "8px 14px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  transition: "all 0.2s ease",
                }}
              >
                <Activity size={14} />
                {driftLoading ? "COMPUTING DRIFT..." : (driftData ? "RE-RUN DRIFT SIMULATION" : "RUN DRIFT & ATTRIBUTION")}
              </button>
            </div>

            {driftLoading ? (
              <div className="drift-loading">
                COMPUTING HYDRODYNAMIC DRIFT...
              </div>
            ) : trajectory.length > 0 ? (
              <div className="timeline">
                <div className="timeline-line" />

                {trajectory.map((point, index) => (
                  <div
                    className={`timeline-point ${
                      index === trajectory.length - 1 ? "active" : ""
                    }`}
                    key={`${point.time}-${index}`}
                  >
                    <span>{point.time}</span>
                    <strong>{point.label}</strong>
                    <div style={{ fontSize: "9px", color: "#8faab6" }}>
                      {point.latitude.toFixed(2)}, {point.longitude.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="drift-loading">
                HYDRODYNAMIC DRIFT ENGINE READY (5h FORECAST + 2h HINDCAST)
              </div>
            )}
          </section>

          <AnomalyPanel />

          <VesselLeaderboard />
        </main>
      )}

      {/* =========================================================================
          VIEW 2: SCIENTIFIC SAR DETECTION & SEGMENTATION
          ========================================================================= */}
      {activeTab === "detection" && (
        <section style={{ marginBottom: "40px" }}>
          <div style={{ marginBottom: "16px", padding: "16px 20px", background: "var(--color-bg-glass)", border: "1px solid var(--color-border-medium)", borderRadius: "var(--radius-md)" }}>
            <span className="eyebrow">COMPUTER VISION PIPELINE</span>
            <h2 style={{ fontSize: "20px", color: "#FFFFFF", margin: "4px 0" }}>
              Sentinel-1 SAR Oil Slick Detection &amp; Segmentation Analysis
            </h2>
            <p style={{ color: "#94A9B8", fontSize: "12px", margin: 0 }}>
              Inspect raw radar backscatter, ESRGAN spatial super-resolution upscaling, digital land masking, and deterministic polygon boundary extraction.
            </p>
          </div>
          <DetectionVisualizer />
        </section>
      )}

      {/* =========================================================================
          VIEW 3: HYDRODYNAMIC DRIFT PREDICTION & IMPACT
          ========================================================================= */}
      {activeTab === "prediction" && (
        <section style={{ marginBottom: "40px" }}>
          <div style={{ marginBottom: "16px", padding: "16px 20px", background: "var(--color-bg-glass)", border: "1px solid var(--color-border-medium)", borderRadius: "var(--radius-md)" }}>
            <span className="eyebrow">LAGRANGIAN TRANSPORT SIMULATOR</span>
            <h2 style={{ fontSize: "20px", color: "#FFFFFF", margin: "4px 0" }}>
              Hydrodynamic Drift Forecaster &amp; Release Origin Hindcast
            </h2>
            <p style={{ color: "#94A9B8", fontSize: "12px", margin: 0 }}>
              Simulate oil slick transport under coupled atmospheric wind and surface current advection, evaluate coastal threat, and identify origin coordinates.
            </p>
          </div>
          <DriftVisualizer />
        </section>
      )}

      {/* =========================================================================
          VIEW 4: FULL GEOSPATIAL INTELLIGENCE MAP
          ========================================================================= */}
      {activeTab === "maps" && (
        <section className="full-map-view">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1px solid rgba(0, 213, 232, 0.2)", paddingBottom: "12px" }}>
            <div>
              <span className="eyebrow">TACTICAL GIS // FULL GEOSPATIAL INTELLIGENCE MAP</span>
              <h2 style={{ fontSize: "20px", color: "#FFFFFF", margin: "4px 0" }}>
                {mapViewMode === "global"
                  ? "Global Maritime Surveillance & Corridor Map (Free GeoAPIs)"
                  : "Arabian Sea Shipping Corridor Tactical Incident View"}
              </h2>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {/* Map View Mode Switcher */}
              <div style={{ display: "flex", background: "rgba(5, 11, 20, 0.8)", border: "1px solid rgba(0, 213, 232, 0.3)", borderRadius: "5px", padding: "3px" }}>
                <button
                  type="button"
                  onClick={() => setMapViewMode("global")}
                  style={{
                    background: mapViewMode === "global" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                    border: mapViewMode === "global" ? "1px solid #00D5E8" : "none",
                    color: mapViewMode === "global" ? "#00D5E8" : "#718898",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  GLOBAL GEOAPI MAP
                </button>
                <button
                  type="button"
                  onClick={() => setMapViewMode("local")}
                  style={{
                    background: mapViewMode === "local" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                    border: mapViewMode === "local" ? "1px solid #00D5E8" : "none",
                    color: mapViewMode === "local" ? "#00D5E8" : "#718898",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ARABIAN SEA INCIDENT MAP
                </button>
              </div>

              {mapViewMode === "local" && (
                <button
                  onClick={handleRunDrift}
                  disabled={driftLoading}
                  style={{
                    background: "rgba(0, 213, 232, 0.15)",
                    border: "1px solid #00D5E8",
                    color: "#00D5E8",
                    borderRadius: "5px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                  }}
                >
                  {driftLoading ? "UPDATING MAP..." : "REFRESH DRIFT VECTORS"}
                </button>
              )}
            </div>
          </div>

          {/* Conditional Map View */}
          <ErrorBoundary fallbackMessage="Geospatial visualization module temporarily interrupted. Please retry.">
            {mapViewMode === "global" ? (
              <GlobalMap height="680px" />
            ) : (
              <>
                <div style={{ height: "680px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(57, 169, 255, 0.25)" }}>
                  <IncidentMap
                    trajectory={trajectory}
                    origin={driftData?.origin ? { latitude: driftData.origin.lat, longitude: driftData.origin.lon } : null}
                    detected={slickData ? {
                      latitude: slickData.centroid?.lat,
                      longitude: slickData.centroid?.lon,
                      polygon: slickData.polygon,
                      area_sq_km: slickData.area_sq_km,
                      perimeter_km: slickData.perimeter_km,
                      circularity: slickData.circularity,
                    } : null}
                  />
                </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", padding: "14px", background: "rgba(5, 11, 20, 0.6)", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.08)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
                <div>
                  <span style={{ color: "#718898" }}>SURVEILLANCE BBOX:</span>
                  <div style={{ color: "#FFFFFF", fontWeight: "700" }}>18.50°N - 20.50°N / 70.50°E - 72.50°E</div>
                </div>
                <div>
                  <span style={{ color: "#718898" }}>CURRENT SLICK CENTROID:</span>
                  <div style={{ color: "#FF5353", fontWeight: "700" }}>
                    {slickData?.centroid ? `${slickData.centroid.lat.toFixed(4)}°N, ${slickData.centroid.lon.toFixed(4)}°E` : "19.5000°N, 71.4000°E"}
                  </div>
                </div>
                <div>
                  <span style={{ color: "#718898" }}>CORRIDOR VESSEL DENSITY:</span>
                  <div style={{ color: "#00D5E8", fontWeight: "700" }}>{vesselsCount || 4} Tracked Merchant Vessels</div>
                </div>
                <div>
                  <span style={{ color: "#718898" }}>SHORELINE DISTANCE:</span>
                  <div style={{ color: "#00F5A0", fontWeight: "700" }}>{driftData?.coastal_impact?.distance_to_shore_km || 18.4} km (Safe Buffer)</div>
                </div>
              </div>
            </>
          )}
          </ErrorBoundary>
        </section>
      )}

      {/* =========================================================================
          VIEW 5: EMERGENCY ALERT DISPATCH CONSOLE
          ========================================================================= */}
      {activeTab === "alerts" && (
        <AlertsConsole
          suspects={suspects}
          slickData={slickData}
          driftData={driftData}
          alertDetails={alertDetails}
          onAlertDispatched={(details) => {
            setAlertDetails(details);
            setAlertStatus("ALERT SENT");
          }}
        />
      )}

      {/* =========================================================================
          VIEW 6: OFFICIAL MARITIME INCIDENT REPORTS
          ========================================================================= */}
      {activeTab === "reports" && (
        <ReportViewer
          slickData={slickData}
          driftData={driftData}
          suspects={suspects}
          alertDetails={alertDetails}
          systemOnline={systemOnline}
        />
      )}
    </div>
  );
}

export default CommandCenter;
