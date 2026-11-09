import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Send,
  Radio,
  Clock,
  Compass,
  FileCheck,
  Ship,
  MapPin,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";
import { dispatchAlert } from "../services/api";

/**
 * AlertsConsole Component — Ocean Sentinel Emergency Dispatch
 * 
 * Provides dedicated maritime emergency alerting operations,
 * automated Coast Guard MRCC Mumbai dispatch, priority overrides,
 * real-time dispatch event logs, and NOS-DCP standard operating procedure checklists.
 */
export default function AlertsConsole({
  suspects = [],
  slickData = null,
  driftData = null,
  alertDetails = null,
  onAlertDispatched = null,
}) {
  const [priority, setPriority] = useState("HIGH");
  const [recipient, setRecipient] = useState("Indian Coast Guard MRCC Mumbai");
  const [notes, setNotes] = useState("Immediate reconnaissance flight and interception recommended.");
  const [isDispatching, setIsDispatching] = useState(false);
  const [localAlert, setLocalAlert] = useState(alertDetails);
  const [dispatchError, setDispatchError] = useState("");
  const [activeTab, setActiveTab] = useState("dispatch"); // 'dispatch' | 'audit_log' | 'sop'

  // Pre-populated historical audit trail
  const [auditLog, setAuditLog] = useState([
    {
      id: "OS-ALR-892101",
      timestamp: "2025-05-01 12:15:30 UTC",
      priority: "HIGH",
      recipient: "Indian Coast Guard MRCC Mumbai",
      suspect: "MT ARABIAN STAR (IMO 9312345)",
      status: "DELIVERED",
      protocol: "REST API Bridge // NOS-DCP Tier-1",
      lat: 19.5,
      lon: 71.4,
    },
    {
      id: "OS-ALR-881904",
      timestamp: "2025-04-18 09:42:15 UTC",
      priority: "CRITICAL",
      recipient: "Mumbai Port Trust Marine Command",
      suspect: "MV BENGAL CARRIER (IMO 9456789)",
      status: "ACKNOWLEDGED",
      protocol: "Secure Webhook // DG Shipping",
      lat: 18.92,
      lon: 72.84,
    },
    {
      id: "OS-ALR-870312",
      timestamp: "2025-03-22 17:05:00 UTC",
      priority: "HIGH",
      recipient: "Gujarat Maritime Board (Kandla / Mundra)",
      suspect: "MT GULF PHOENIX (IMO 9512346)",
      status: "CLOSED",
      protocol: "REST API Bridge // GMB Operations",
      lat: 22.75,
      lon: 69.7,
    },
  ]);

  const topSuspect = suspects.length > 0 ? suspects[0] : {
    vessel: "MT ARABIAN STAR",
    imo: "9312345",
    score: 88.5,
    riskTier: "CRITICAL",
    speed: 6.2,
    course: 220,
    anomaly: "SPEED DROP (56% Deceleration)",
    distanceToOriginKm: 4.8,
  };

  const handleDispatch = async () => {
    try {
      setIsDispatching(true);
      setDispatchError("");

      const payload = {
        incident: "Marine Oil Spill Incident",
        priority: priority,
        vessel: topSuspect.vessel,
        score: topSuspect.score,
        recipient: recipient,
        notes: notes,
        coordinates: {
          lat: slickData?.centroid?.lat != null ? Number(slickData.centroid.lat) : 19.5,
          lon: slickData?.centroid?.lon != null ? Number(slickData.centroid.lon) : 71.4,
        },
        area_sq_km: slickData?.area_sq_km || 0.0406,
      };

      const res = await dispatchAlert(payload);

      if (res.status === "success" && res.alert) {
        setLocalAlert(res.alert);
        if (onAlertDispatched) onAlertDispatched(res.alert);

        // Add entry to audit log
        const newEntry = {
          id: res.alert.incident_id || `OS-ALR-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          priority: priority,
          recipient: recipient,
          suspect: `${topSuspect.vessel} (IMO ${topSuspect.imo})`,
          status: "DELIVERED",
          protocol: "REST API Bridge // NOS-DCP Tier-1",
          lat: slickData?.centroid?.lat || 19.5,
          lon: slickData?.centroid?.lon || 71.4,
        };

        setAuditLog([newEntry, ...auditLog]);
      } else {
        throw new Error("Invalid alert response schema");
      }
    } catch (err) {
      console.error("Alert dispatch failed:", err);
      setDispatchError(err.message || "Failed to deliver emergency alert.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="alerts-console" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-sans)" }}>
      {/* Console Sub-Header & Mode Switcher */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
          padding: "16px 20px",
          background: "var(--color-bg-glass)",
          border: "1px solid var(--color-border-medium)",
          borderRadius: "var(--radius-md)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              background: "rgba(255, 83, 83, 0.15)",
              border: "1px solid #FF5353",
              display: "grid",
              placeItems: "center",
              color: "#FF5353",
            }}
          >
            <Bell size={18} />
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#FFFFFF" }}>
              Maritime Emergency Alert Dispatcher
            </div>
            <div style={{ fontSize: "11px", color: "#94A9B8", fontFamily: "var(--font-mono)" }}>
              DIRECT LINK: INDIAN COAST GUARD MRCC MUMBAI // PROTOCOL TIER-1
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: "flex", gap: "6px", background: "rgba(5, 11, 20, 0.6)", padding: "4px", borderRadius: "6px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <button
            onClick={() => setActiveTab("dispatch")}
            style={{
              background: activeTab === "dispatch" ? "rgba(255, 83, 83, 0.25)" : "transparent",
              border: activeTab === "dispatch" ? "1px solid #FF5353" : "none",
              color: activeTab === "dispatch" ? "#FF5353" : "#94A9B8",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            DISPATCH CONSOLE
          </button>
          <button
            onClick={() => setActiveTab("audit_log")}
            style={{
              background: activeTab === "audit_log" ? "rgba(0, 213, 232, 0.25)" : "transparent",
              border: activeTab === "audit_log" ? "1px solid #00D5E8" : "none",
              color: activeTab === "audit_log" ? "#00D5E8" : "#94A9B8",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            AUDIT TRAIL ({auditLog.length})
          </button>
          <button
            onClick={() => setActiveTab("sop")}
            style={{
              background: activeTab === "sop" ? "rgba(57, 169, 255, 0.25)" : "transparent",
              border: activeTab === "sop" ? "1px solid #39A9FF" : "none",
              color: activeTab === "sop" ? "#39A9FF" : "#94A9B8",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            NOS-DCP PROTOCOL
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE DISPATCH CONSOLE */}
      {activeTab === "dispatch" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)", gap: "20px" }}>
          {/* Left Form: Incident Dispatch Configuration */}
          <div
            style={{
              background: "rgba(10, 27, 43, 0.8)",
              border: "1px solid var(--color-border-medium)",
              borderRadius: "var(--radius-md)",
              padding: "24px",
              boxShadow: "var(--shadow-panel)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Radio size={16} color="#FF5353" />
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
                  INCIDENT DISPATCH CONFIGURATION
                </h3>
              </div>
              <Badge variant={localAlert ? "live" : "warning"} dot size="sm">
                {localAlert ? "NOTIFICATION TRANSMITTED" : "AWAITING AUTHORIZATION"}
              </Badge>
            </div>

            {/* Target Vessel & Threat Card */}
            <div
              style={{
                background: "rgba(5, 11, 20, 0.65)",
                border: "1px solid rgba(255, 83, 83, 0.25)",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "#FF8B8B", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    IDENTIFIED PRIME SUSPECT
                  </span>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "#FFFFFF" }}>
                    {topSuspect.vessel}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A9B8", fontFamily: "var(--font-mono)" }}>
                    IMO: {topSuspect.imo} | SPEED: {topSuspect.speed} kn | COURSE: {topSuspect.course}°
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "10px", color: "#718898", display: "block" }}>ATTRIBUTION SCORE</span>
                  <span style={{ fontSize: "20px", fontWeight: "800", color: "#FF5353", fontFamily: "var(--font-mono)" }}>
                    {topSuspect.score}%
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontFamily: "var(--font-mono)", color: "#00D5E8", paddingTop: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <span>ANOMALY: {topSuspect.anomaly}</span>
                <span>•</span>
                <span>DISTANCE TO HINDCAST ORIGIN: {topSuspect.distanceToOriginKm || 4.8} km</span>
              </div>
            </div>

            {/* Recipient Authority Selection */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94A9B8", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                PRIMARY DESIGNATED RECIPIENT
              </label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(5, 11, 20, 0.8)",
                  border: "1px solid rgba(57, 169, 255, 0.3)",
                  borderRadius: "5px",
                  padding: "10px",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <option value="Indian Coast Guard MRCC Mumbai">Indian Coast Guard MRCC Mumbai (West Coast Sector)</option>
                <option value="Directorate General of Shipping">Directorate General of Shipping (DG Shipping HQ)</option>
                <option value="Mumbai Port Authority Marine Operations">Mumbai Port Authority Marine Operations</option>
                <option value="Gujarat Maritime Board (Kandla / Mundra)">Gujarat Maritime Board (Kandla / Mundra)</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94A9B8", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                INCIDENT RESPONSE TIER / SEVERITY
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  { id: "CRITICAL", label: "TIER-1 CRITICAL", color: "#FF5353" },
                  { id: "HIGH", label: "TIER-2 HIGH", color: "#FFB703" },
                  { id: "MEDIUM", label: "TIER-3 STANDARD", color: "#39A9FF" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    style={{
                      background: priority === p.id ? `${p.color}22` : "rgba(5, 11, 20, 0.6)",
                      border: priority === p.id ? `1.5px solid ${p.color}` : "1px solid rgba(255, 255, 255, 0.1)",
                      color: priority === p.id ? p.color : "#94A9B8",
                      padding: "8px",
                      borderRadius: "5px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Operational Instructions Notes */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#94A9B8", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                TACTICAL NOTES &amp; RECOMMENDATION
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(5, 11, 20, 0.8)",
                  border: "1px solid rgba(57, 169, 255, 0.3)",
                  borderRadius: "5px",
                  padding: "10px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  resize: "none",
                }}
              />
            </div>

            {/* Dispatch Action Button */}
            <button
              onClick={handleDispatch}
              disabled={isDispatching}
              style={{
                width: "100%",
                background: localAlert ? "rgba(0, 245, 160, 0.2)" : "#FF5353",
                border: localAlert ? "1.5px solid #00F5A0" : "1.5px solid #FF5353",
                color: localAlert ? "#00F5A0" : "#FFFFFF",
                borderRadius: "6px",
                padding: "14px",
                fontSize: "13px",
                fontWeight: "800",
                letterSpacing: "1px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "var(--font-mono)",
                boxShadow: localAlert ? "0 0 16px rgba(0, 245, 160, 0.3)" : "0 0 16px rgba(255, 83, 83, 0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {isDispatching ? (
                <>TRANSMITTING TO MRCC...</>
              ) : localAlert ? (
                <>
                  <CheckCircle2 size={18} />
                  EMERGENCY DISPATCH TRANSMITTED (CLICK TO RE-SEND)
                </>
              ) : (
                <>
                  <Send size={18} />
                  DISPATCH EMERGENCY ALERT TO COAST GUARD (POST /alert)
                </>
              )}
            </button>

            {dispatchError && (
              <div style={{ marginTop: "12px", padding: "10px", background: "rgba(255, 83, 83, 0.15)", border: "1px solid #FF5353", borderRadius: "5px", color: "#FF8B8B", fontSize: "11px" }}>
                {dispatchError}
              </div>
            )}
          </div>

          {/* Right Status Card: Live Telemetry & Dispatch Confirmation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Active Telemetry Snapshot */}
            <div
              style={{
                background: "rgba(10, 27, 43, 0.8)",
                border: "1px solid var(--color-border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
              }}
            >
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#00D5E8", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>
                ● INCIDENT GEOSPATIAL PARAMETERS
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                  <span style={{ color: "#718898" }}>Centroid Coordinates:</span>
                  <span style={{ color: "#FFFFFF" }}>19.5000°N, 71.4000°E</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                  <span style={{ color: "#718898" }}>Detected Spill Area:</span>
                  <span style={{ color: "#FF5353", fontWeight: "700" }}>{slickData?.area_sq_km || 0.0406} km²</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                  <span style={{ color: "#718898" }}>Shore Distance:</span>
                  <span style={{ color: "#00D5E8" }}>{driftData?.coastal_impact?.distance_to_shore_km || 18.4} km</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                  <span style={{ color: "#718898" }}>Hydrodynamic Drift:</span>
                  <span style={{ color: "#94A9B8" }}>242° @ 1.8 kn (SW)</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#718898" }}>Coast Guard Sector:</span>
                  <span style={{ color: "#00F5A0" }}>MRCC Mumbai (Area III)</span>
                </div>
              </div>
            </div>

            {/* Confirmed Delivery Box */}
            {localAlert && (
              <div
                style={{
                  background: "rgba(0, 245, 160, 0.08)",
                  border: "1px solid rgba(0, 245, 160, 0.4)",
                  borderRadius: "var(--radius-md)",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#00F5A0", fontWeight: "800", fontSize: "13px", marginBottom: "8px" }}>
                  <CheckCircle2 size={16} />
                  TRANSMISSION ACKNOWLEDGED
                </div>

                <div style={{ fontSize: "11px", color: "#DCE5EB", fontFamily: "var(--font-mono)", lineHeight: "1.6" }}>
                  <div>Incident Token: <strong>{localAlert.incident_id || "OS-INC-784012"}</strong></div>
                  <div>Recipient: <strong>{localAlert.recipient || recipient}</strong></div>
                  <div>Attributed Vessel: <strong>{localAlert.top_suspect || localAlert.suspect_vessel || topSuspect.vessel}</strong></div>
                  <div>Priority Tier: <strong>{localAlert.priority || priority}</strong></div>
                  <div>Delivery Method: <strong>Member 4 Dispatcher Bridge (HTTP 200)</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: AUDIT TRAIL LOG */}
      {activeTab === "audit_log" && (
        <div
          style={{
            background: "rgba(10, 27, 43, 0.8)",
            border: "1px solid var(--color-border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#FFFFFF", margin: 0 }}>
              OFFICIAL EMERGENCY DISPATCH AUDIT LOG
            </h3>
            <span style={{ fontSize: "11px", color: "#94A9B8", fontFamily: "var(--font-mono)" }}>
              {auditLog.length} RECORDED DISPATCH EVENTS
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "11px", fontFamily: "var(--font-mono)", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(5, 11, 20, 0.8)", borderBottom: "1px solid rgba(57, 169, 255, 0.2)", color: "#718898", textAlign: "left" }}>
                  <th style={{ padding: "8px" }}>ALERT ID</th>
                  <th style={{ padding: "8px" }}>TIMESTAMP</th>
                  <th style={{ padding: "8px" }}>PRIORITY</th>
                  <th style={{ padding: "8px" }}>RECIPIENT</th>
                  <th style={{ padding: "8px" }}>SUSPECT VESSEL</th>
                  <th style={{ padding: "8px" }}>COORDINATES</th>
                  <th style={{ padding: "8px", textAlign: "right" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "10px 8px", color: "#00D5E8", fontWeight: "700" }}>{log.id}</td>
                    <td style={{ padding: "10px 8px", color: "#94A9B8" }}>{log.timestamp}</td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{ color: log.priority === "CRITICAL" ? "#FF5353" : "#FFB703", fontWeight: "700" }}>
                        {log.priority}
                      </span>
                    </td>
                    <td style={{ padding: "10px 8px", color: "#FFFFFF" }}>{log.recipient}</td>
                    <td style={{ padding: "10px 8px", color: "#DCE5EB" }}>{log.suspect}</td>
                    <td style={{ padding: "10px 8px", color: "#718898" }}>{log.lat}°N, {log.lon}°E</td>
                    <td style={{ padding: "10px 8px", textAlign: "right", color: "#00F5A0", fontWeight: "700" }}>
                      ✓ {log.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: NOS-DCP PROTOCOL CHECKLIST */}
      {activeTab === "sop" && (
        <div
          style={{
            background: "rgba(10, 27, 43, 0.8)",
            border: "1px solid var(--color-border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          <div style={{ marginBottom: "18px", borderBottom: "1px solid rgba(57, 169, 255, 0.2)", paddingBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#FFFFFF", margin: "0 0 6px" }}>
              National Oil Spill Disaster Contingency Plan (NOS-DCP) Protocol
            </h3>
            <p style={{ fontSize: "12px", color: "#94A9B8", margin: 0 }}>
              Standard operational response procedure executed by Ocean Sentinel autonomous intelligence agents.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ padding: "16px", background: "rgba(5, 11, 20, 0.6)", borderRadius: "6px", border: "1px solid rgba(0, 213, 232, 0.2)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#00D5E8", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                SATELLITE SAR DETECTION
              </div>
              <div style={{ fontSize: "12px", color: "#DCE5EB", lineHeight: "1.5" }}>
                Sentinel-1 SAR interferometric wide swath captures sea surface backscatter attenuation. 4x ESRGAN super-resolution suppresses noise and land mask zeroes coastal terrain.
              </div>
            </div>

            <div style={{ padding: "16px", background: "rgba(5, 11, 20, 0.6)", borderRadius: "6px", border: "1px solid rgba(57, 169, 255, 0.2)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#39A9FF", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                HYDRODYNAMIC HINDCAST
              </div>
              <div style={{ fontSize: "12px", color: "#DCE5EB", lineHeight: "1.5" }}>
                Lagrangian advection reverses surface current and wind drift to pinpoint the geographic origin and timestamp of deliberate or accidental bunker discharge.
              </div>
            </div>

            <div style={{ padding: "16px", background: "rgba(5, 11, 20, 0.6)", borderRadius: "6px", border: "1px solid rgba(255, 183, 3, 0.2)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#FFB703", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                AIS CORRIDOR ATTRIBUTION
              </div>
              <div style={{ fontSize: "12px", color: "#DCE5EB", lineHeight: "1.5" }}>
                AccessAIS telemetry cross-references vessels within the corridor, flagging sudden speed drops (e.g. 56% deceleration during discharge) and course shifts.
              </div>
            </div>

            <div style={{ padding: "16px", background: "rgba(5, 11, 20, 0.6)", borderRadius: "6px", border: "1px solid rgba(0, 245, 160, 0.2)" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#00F5A0", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                MRCC EMERGENCY DISPATCH
              </div>
              <div style={{ fontSize: "12px", color: "#DCE5EB", lineHeight: "1.5" }}>
                Member 4 dispatcher transmits incident dossier to Indian Coast Guard MRCC Mumbai for immediate aerial surveillance verification and vessel interception.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
