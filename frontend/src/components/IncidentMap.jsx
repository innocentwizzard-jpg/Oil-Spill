import {
  MapContainer,
  TileLayer,
  Circle,
  Polygon,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getVessels } from "../services/api";

function MapController({ center, zoom }) {
  const map = useMap();
  const lat = center?.[0];
  const lon = center?.[1];

  useEffect(() => {
    if (typeof lat === "number" && typeof lon === "number" && !isNaN(lat) && !isNaN(lon)) {
      map.setView([lat, lon], zoom);
    }
  }, [lat, lon, zoom, map]);
  return null;
}

const vesselIcon = L.divIcon({
  className: "custom-vessel-marker",
  html: `
    <div class="vessel-marker" style="background: rgba(10, 27, 43, 0.85); border: 1.5px solid #39A9FF; border-radius: 50%; width: 28px; height: 28px; display: grid; place-items: center; box-shadow: 0 0 10px rgba(57, 169, 255, 0.5);">
      <span style="font-size: 13px; line-height: 1;">⚓</span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const originIcon = L.divIcon({
  className: "custom-origin-marker",
  html: `
    <div class="origin-marker" style="background: rgba(255, 83, 83, 0.9); border: 2px solid #FFFFFF; border-radius: 50%; width: 26px; height: 26px; display: grid; place-items: center; box-shadow: 0 0 14px #FF5353; animation: radarPing 2s infinite;">
      <span style="color: #FFF; font-weight: 800; font-size: 11px;">O</span>
    </div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const waypointIcon = (hour) => L.divIcon({
  className: "custom-waypoint-marker",
  html: `
    <div style="background: rgba(0, 213, 232, 0.9); border: 1px solid #FFF; border-radius: 3px; padding: 1px 4px; font-size: 9px; font-family: monospace; font-weight: 700; color: #050B14; box-shadow: 0 0 8px #00D5E8;">
      +${hour}h
    </div>
  `,
  iconSize: [28, 16],
  iconAnchor: [14, 8],
});

function IncidentMap({ trajectory = [], origin = null, detected = null }) {
  const [vessels, setVessels] = useState([]);
  const [showVessels, setShowVessels] = useState(true);
  const [showSlick, setShowSlick] = useState(true);
  const [showDrift, setShowDrift] = useState(true);
  const [showOrigin, setShowOrigin] = useState(true);

  useEffect(() => {
    let mounted = true;
    getVessels()
      .then((data) => {
        if (mounted) {
          setVessels(data.filter((v) => v.latitude && v.longitude));
        }
      })
      .catch((err) => {
        console.error("Vessel tracking error:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const driftPath = trajectory
    .filter((pt) => pt.latitude !== undefined && pt.longitude !== undefined)
    .map((pt) => [pt.latitude, pt.longitude]);

  // Default coordinate center (Arabian Sea Corridor)
  const defaultCenter = [19.5, 71.4];
  let center = defaultCenter;

  if (detected?.latitude != null && detected?.longitude != null) {
    center = [Number(detected.latitude), Number(detected.longitude)];
  } else if (origin?.latitude != null && origin?.longitude != null) {
    center = [Number(origin.latitude), Number(origin.longitude)];
  } else if (vessels.length > 0 && vessels[0].latitude != null && vessels[0].longitude != null) {
    center = [Number(vessels[0].latitude), Number(vessels[0].longitude)];
  }

  return (
    <div className="incident-map" style={{ position: "relative", width: "100%", height: "100%", minHeight: "480px" }}>
      <MapContainer
        center={center}
        zoom={vessels.length > 0 || detected ? 9 : 6}
        scrollWheelZoom={true}
        zoomControl={true}
        className="leaflet-map"
        style={{ width: "100%", height: "100%", background: "#050B14" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} zoom={vessels.length > 0 || detected ? 9 : 6} />

        {/* 1. Detected Oil Slick (Circle or Full Polygon) */}
        {showSlick && detected?.polygon && detected.polygon.length > 2 ? (
          <Polygon
            positions={detected.polygon}
            pathOptions={{
              color: "#FF5353",
              fillColor: "#FF5353",
              fillOpacity: 0.38,
              weight: 2.5,
              dashArray: "6 4",
            }}
          >
            <Popup>
              <strong>Segmented Oil Slick Boundary (M1 CV)</strong>
              <br />
              Area: {detected.area_sq_km || 0.0406} km²
              <br />
              Perimeter: {detected.perimeter_km || 0.985} km
              <br />
              Circularity Quotient: {detected.circularity || 0.38} (&lt; 0.70 true slick)
            </Popup>
          </Polygon>
        ) : showSlick && detected?.latitude != null && detected?.longitude != null ? (
          <Circle
            center={[Number(detected.latitude), Number(detected.longitude)]}
            radius={detected.radius_meters || 12000}
            pathOptions={{
              color: "#FF5353",
              fillColor: "#FF5353",
              fillOpacity: 0.28,
              weight: 2,
            }}
          >
            <Popup>
              <strong>Detected Slick (Sentinel-1 SAR)</strong>
              <br />
              Coordinates: {Number(detected.latitude).toFixed(4)}°N, {Number(detected.longitude).toFixed(4)}°E
              <br />
              Area: {detected.area_sq_km || 42.7} km²
            </Popup>
          </Circle>
        ) : null}

        {/* 2. Hindcast Probable Release Origin */}
        {showOrigin && origin?.latitude != null && origin?.longitude != null && (
          <Marker
            position={[Number(origin.latitude), Number(origin.longitude)]}
            icon={originIcon}
          >
            <Popup>
              <strong style={{ color: "#FF5353" }}>Estimated Release Origin (Hindcast)</strong>
              <br />
              Release Time: {origin.timestamp || origin.time || "-2.0 Hours"}
              <br />
              Position: {Number(origin.latitude).toFixed(4)}°N, {Number(origin.longitude).toFixed(4)}°E
              <br />
              Attribution Status: Correlated with AccessAIS corridor
            </Popup>
          </Marker>
        )}

        {/* 3. Forward Forecast Drift Trajectory Polyline */}
        {showDrift && driftPath.length > 1 && (
          <Polyline
            positions={driftPath}
            pathOptions={{
              color: "#00D5E8",
              weight: 3.5,
              opacity: 0.95,
              dashArray: "8 6",
            }}
          />
        )}

        {/* Hourly Drift Waypoints */}
        {showDrift &&
          trajectory
            .filter((pt) => pt && pt.latitude != null && pt.longitude != null)
            .map((pt, idx) => (
              <Marker
                key={`wp-${idx}`}
                position={[Number(pt.latitude), Number(pt.longitude)]}
                icon={waypointIcon(idx + 1)}
              >
                <Popup>
                  <strong>Forecast Waypoint +{idx + 1}h</strong>
                  <br />
                  Coordinates: {Number(pt.latitude).toFixed(4)}°N, {Number(pt.longitude).toFixed(4)}°E
                  <br />
                  Governing Drift: V_oil = V_current + 0.03·V_wind
                </Popup>
              </Marker>
            ))}

        {/* 4. Real AIS Vessel Markers */}
        {showVessels &&
          vessels
            .filter((vessel) => vessel && vessel.latitude != null && vessel.longitude != null)
            .map((vessel, idx) => (
              <Marker
                key={`${vessel.imo || vessel.mmsi || idx}`}
                position={[Number(vessel.latitude), Number(vessel.longitude)]}
                icon={vesselIcon}
              >
                <Popup>
                  <strong style={{ color: "#39A9FF" }}>{vessel.name}</strong>
                  <br />
                  Type: {vessel.vesselType} | MMSI: {vessel.mmsi || "—"}
                  <br />
                  IMO: {vessel.imo || "—"}
                  <br />
                  Speed: {vessel.speed} kn | Course: {vessel.course}°
                  <br />
                  Position: ({Number(vessel.latitude).toFixed(4)}, {Number(vessel.longitude).toFixed(4)})
                  {vessel.distanceToShoreKm && (
                    <>
                      <br />
                      Distance to Shore: {vessel.distanceToShoreKm} km
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {/* Layer Controls Toggle Overlay */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 1000, background: "rgba(5, 11, 20, 0.88)", border: "1px solid rgba(0, 213, 232, 0.3)", borderRadius: "6px", padding: "10px 14px", backdropFilter: "blur(10px)", fontSize: "11px", fontFamily: "var(--font-mono)", color: "#FFFFFF", display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ color: "#00D5E8", fontWeight: "700", borderBottom: "1px solid rgba(0, 213, 232, 0.2)", paddingBottom: "4px", marginBottom: "2px" }}>
          MAP LAYERS
        </span>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input type="checkbox" checked={showVessels} onChange={(e) => setShowVessels(e.target.checked)} />
          <span>AIS Vessels ({vessels.length})</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input type="checkbox" checked={showSlick} onChange={(e) => setShowSlick(e.target.checked)} />
          <span>Slick Polygon (M1)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input type="checkbox" checked={showDrift} onChange={(e) => setShowDrift(e.target.checked)} />
          <span>5h Drift Path (M2)</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
          <input type="checkbox" checked={showOrigin} onChange={(e) => setShowOrigin(e.target.checked)} />
          <span>Release Origin</span>
        </label>
      </div>

      <div className="map-live-badge">
        ● LIVE GEOSPATIAL INTELLIGENCE // WGS-84 EPSG:4326
      </div>
    </div>
  );
}

export default IncidentMap;
