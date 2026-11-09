import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  Globe,
  Layers,
  MapPin,
  Compass,
  Ship,
  AlertTriangle,
  Radio,
  ExternalLink,
  ChevronDown,
  Navigation,
  Ruler,
  Crosshair,
  RotateCcw,
  MousePointer,
} from "lucide-react";
import Badge from "./Badge";

/**
 * Haversine formula to compute great-circle distance between two WGS-84 coordinates
 */
function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const km = R * c;
  const nm = km / 1.852;
  return { km: Number(km.toFixed(2)), nm: Number(nm.toFixed(2)) };
}

/**
 * Compute true initial compass bearing between two points
 */
function calculateCompassBearing(lat1, lon1, lat2, lon2) {
  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;

  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const dirIdx = Math.round(bearing / 22.5) % 16;
  return { deg: Math.round(bearing), cardinal: directions[dirIdx] };
}

/**
 * GlobalMap Component — Free GeoAPI-Powered Global Maritime Intelligence Map
 * 
 * Powered by 100% Free Public GeoAPIs:
 * 1. Esri World Imagery (High-Resolution Satellite GeoAPI)
 * 2. CartoDB Dark Matter (Dark Maritime Intelligence GeoAPI)
 * 3. OpenStreetMap Standard (Global Base Cartography GeoAPI)
 * 4. Esri Ocean Basemap (Marine Bathymetry & Seabed Topography GeoAPI)
 * 5. OpenSeaMap (Free Global Marine Navigational Seamarks & TSS Shipping Lanes)
 * 6. OpenStreetMap Nominatim GeoAPI (Free Forward & Reverse Geocoding)
 */

// Custom Icons for Global Markers
const globalSpillIcon = (severity = "CRITICAL") => L.divIcon({
  className: "global-spill-pin",
  html: `
    <div style="
      background: ${severity === "CRITICAL" ? "rgba(255, 83, 83, 0.95)" : "rgba(255, 183, 3, 0.95)"};
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 14px ${severity === "CRITICAL" ? "#FF5353" : "#FFB703"};
      cursor: pointer;
    ">
      <span style="color: #FFF; font-weight: 800; font-size: 11px;">⚠</span>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const chokepointIcon = L.divIcon({
  className: "global-chokepoint-pin",
  html: `
    <div style="
      background: rgba(0, 213, 232, 0.9);
      border: 1.5px solid #FFFFFF;
      border-radius: 4px;
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 10px #00D5E8;
      cursor: pointer;
    ">
      <span style="color: #050B14; font-weight: 800; font-size: 10px;">⚓</span>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const inspectorIcon = L.divIcon({
  className: "global-inspector-pin",
  html: `
    <div style="
      background: rgba(0, 213, 232, 0.95);
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 16px #00D5E8;
      cursor: pointer;
    ">
      <span style="color: #050B14; font-weight: 900; font-size: 11px;">+</span>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const measurePinA = L.divIcon({
  className: "measure-pin-a",
  html: `
    <div style="
      background: #00F5A0;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 14px #00F5A0;
      color: #050B14;
      font-weight: 900;
      font-size: 11px;
      font-family: var(--font-mono);
    ">A</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const measurePinB = L.divIcon({
  className: "measure-pin-b",
  html: `
    <div style="
      background: #FF5353;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      box-shadow: 0 0 14px #FF5353;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 11px;
      font-family: var(--font-mono);
    ">B</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Map Controller for smooth programmatic flying
function MapFlyController({ targetLocation }) {
  const map = useMap();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (targetLocation && targetLocation.lat && targetLocation.lon) {
      map.flyTo([targetLocation.lat, targetLocation.lon], targetLocation.zoom || 8, {
        duration: 1.8,
        easeLinearity: 0.25,
      });
    }
  }, [targetLocation, map]);
  return null;
}

// Map Event Handler: Live Mouse Coordinates + Distance Measuring + Nominatim Location Inspector
function MapInteractiveHUDHandler({
  isMeasuring,
  onMouseMove,
  onAddMeasurePoint,
  onLocationSelected,
}) {
  const lastRequestTime = useRef(0);
  const activeController = useRef(null);

  useMapEvents({
    mousemove: (e) => {
      onMouseMove({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      });
    },
    click: async (e) => {
      const { lat, lng } = e.latlng;
      if (isMeasuring) {
        onAddMeasurePoint({ lat, lon: lng });
        return;
      }

      let placeInfo = null;
      const now = Date.now();
      if (now - lastRequestTime.current >= 1000) {
        lastRequestTime.current = now;
        if (activeController.current) {
          activeController.current.abort();
        }
        activeController.current = new AbortController();
        const timeoutId = setTimeout(() => activeController.current?.abort(), 4000);

        try {
          // Query Free Nominatim Reverse Geocoding GeoAPI with timeout guard & 1 req/sec rate limit
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1&email=oceansentinel.maritime@gmail.com`,
            {
              signal: activeController.current.signal,
              headers: {
                "Accept-Language": "en",
              },
            }
          );
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json();
            placeInfo = {
              displayName: data.display_name || "International Waters",
              country: data.address?.country || "Open Ocean",
              sea: data.address?.sea || data.address?.ocean || "Maritime Exclusive Economic Zone (EEZ)",
            };
          }
        } catch (err) {
          console.warn("Nominatim reverse geocoding fallback:", err);
        }
      }

      onLocationSelected({
        lat,
        lon: lng,
        place: placeInfo,
      });
    },
  });
  return null;
}

export default function GlobalMap({ height = "650px", showSearch = true, onSelectSlick = null }) {
  // Tile Providers (Free GeoAPIs)
  const TILE_PROVIDERS = {
    dark: {
      name: "CARTO Dark Matter (Intelligence)",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://osm.org/">OSM</a>',
      subdomains: "abcd",
    },
    satellite: {
      name: "Esri World Imagery (Satellite GeoAPI)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP",
      maxZoom: 18,
    },
    ocean: {
      name: "Esri Ocean Basemap (Bathymetry GeoAPI)",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; GEBCO, NOAA, National Geographic, DeLorme, HERE",
      maxZoom: 13,
    },
    osm: {
      name: "OpenStreetMap Standard (Cartography)",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  };

  const [activeBaseLayer, setActiveBaseLayer] = useState("dark");
  const [showSeaMarks, setShowSeaMarks] = useState(false);
  const [showSpillHotspots, setShowSpillHotspots] = useState(true);
  const [showChokepoints, setShowChokepoints] = useState(true);

  // Search State using Free Nominatim Geocoding GeoAPI
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [flyTarget, setFlyTarget] = useState({ lat: 19.5, lon: 71.4, zoom: 6 });
  const [clickedLocation, setClickedLocation] = useState(null);

  // Point 2: Live Mouse Coordinates & Nautical Distance Measurement State
  const [mouseCoords, setMouseCoords] = useState(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]);

  const handleAddMeasurePoint = useCallback((pt) => {
    setMeasurePoints((prev) => {
      if (prev.length >= 2) {
        return [pt];
      }
      return [...prev, pt];
    });
  }, []);

  const handleClearMeasurement = useCallback(() => {
    setMeasurePoints([]);
  }, []);

  const measurementResult =
    measurePoints.length === 2
      ? {
          distance: calculateHaversine(
            measurePoints[0].lat,
            measurePoints[0].lon,
            measurePoints[1].lat,
            measurePoints[1].lon
          ),
          bearing: calculateCompassBearing(
            measurePoints[0].lat,
            measurePoints[0].lon,
            measurePoints[1].lat,
            measurePoints[1].lon
          ),
        }
      : null;

  // Major Global Shipping Chokepoints
  const GLOBAL_CHOKEPOINTS = [
    { name: "Arabian Sea Corridor", lat: 19.5, lon: 71.4, zoom: 8, traffic: "Very High", desc: "Primary crude tanker route off Mumbai / Gujarat coast" },
    { name: "Strait of Hormuz", lat: 26.56, lon: 56.25, zoom: 9, traffic: "Critical (21M bpd)", desc: "World's most critical crude oil transit chokepoint" },
    { name: "Strait of Malacca", lat: 1.43, lon: 103.3, zoom: 9, traffic: "Extremely High", desc: "Main maritime route connecting Indian Ocean & South China Sea" },
    { name: "Bab-el-Mandeb / Red Sea", lat: 12.58, lon: 43.33, zoom: 9, traffic: "High Security Zone", desc: "Southern gateway to Red Sea and Suez Canal" },
    { name: "Suez Canal", lat: 30.45, lon: 32.35, zoom: 10, traffic: "Strategic Chokepoint", desc: "Connects Mediterranean to Red Sea" },
    { name: "Panama Canal", lat: 9.08, lon: -79.68, zoom: 10, traffic: "Strategic Inter-Ocean", desc: "Connects Atlantic and Pacific oceans" },
    { name: "English Channel (Dover)", lat: 51.02, lon: 1.45, zoom: 10, traffic: "Heavy Merchant Traffic", desc: "Busiest shipping lane in European waters" },
    { name: "Gulf of Mexico", lat: 26.5, lon: -90.5, zoom: 7, traffic: "High Density Oil Infrastructure", desc: "Offshore extraction platforms and refinery hubs" },
  ];

  // Documented Global Oil Spill Surveillance Incidents
  const GLOBAL_SPILL_HOTSPOTS = [
    {
      id: "OS-GLOBAL-01",
      name: "Arabian Sea Offshore Incident",
      lat: 19.5,
      lon: 71.4,
      areaKm2: 0.0406,
      status: "ACTIVE SURVEILLANCE",
      severity: "CRITICAL",
      sensor: "Sentinel-1 C-SAR IW",
      vessel: "MT ARABIAN STAR (Suspect)",
      desc: "Fresh slick detected via Copernicus Sentinel-1. 5h Lagrangian drift active.",
    },
    {
      id: "OS-GLOBAL-02",
      name: "Red Sea Tanker SOUNION Corridor",
      lat: 15.2,
      lon: 41.8,
      areaKm2: 18.5,
      status: "MONITORED",
      severity: "HIGH",
      sensor: "Sentinel-1 & Sentinel-2",
      vessel: "MT SOUNION Salvage Zone",
      desc: "Environmental monitoring zone following missile attack and crude cargo salvage.",
    },
    {
      id: "OS-GLOBAL-03",
      name: "Mauritius Pointe d'Esny (Wakashio Zone)",
      lat: -20.44,
      lon: 57.75,
      areaKm2: 2.1,
      status: "HISTORIC / RECOVERY",
      severity: "MEDIUM",
      sensor: "High-Res Multispectral",
      vessel: "MV WAKASHIO",
      desc: "Coral reef ecological sanctuary recovery monitoring corridor.",
    },
    {
      id: "OS-GLOBAL-04",
      name: "Kharg Island Crude Loading Terminal",
      lat: 29.23,
      lon: 50.31,
      areaKm2: 4.8,
      status: "HIGH-RISK WATCH",
      severity: "HIGH",
      sensor: "Sentinel-1 SAR Dual-Pol",
      vessel: "Anchorage Shuttle Fleet",
      desc: "Regular bunker discharge surveillance around Persian Gulf crude terminals.",
    },
    {
      id: "OS-GLOBAL-05",
      name: "Gulf of Mexico Macondo Corridor",
      lat: 28.73,
      lon: -88.38,
      areaKm2: 1.2,
      status: "ROUTINE SWEEP",
      severity: "MEDIUM",
      sensor: "NOAA RADARSAT / S-1",
      vessel: "Offshore Platform Sector",
      desc: "Persistent natural seeps and offshore infrastructure inspection.",
    },
  ];

  // Execute Free Nominatim Geocoding GeoAPI
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&email=oceansentinel.maritime@gmail.com`,
        {
          signal: controller.signal,
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Nominatim search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setFlyTarget({ lat, lon, zoom: 10 });
    setClickedLocation({
      lat,
      lon,
      place: {
        displayName: result.display_name,
        country: "Target Region",
        sea: "GeoAPI Search Result",
      },
    });
    setSearchResults([]);
    setSearchQuery(result.display_name.split(",")[0]);
  };

  return (
    <div className="os-global-map" style={{ position: "relative", width: "100%", height, borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(0, 213, 232, 0.25)", background: "#02060B" }}>
      {/* Top Search & GeoAPI Controls Bar */}
      {showSearch && (
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            right: "14px",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          {/* Nominatim Search Input Card */}
          <div style={{ pointerEvents: "auto", position: "relative", width: "100%", maxWidth: "380px" }}>
            <form onSubmit={handleSearch} style={{ display: "flex", background: "rgba(5, 11, 20, 0.92)", border: "1px solid rgba(0, 213, 232, 0.35)", borderRadius: "6px", backdropFilter: "blur(12px)", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
              <input
                type="text"
                placeholder="Search Global Port / Strait / Coordinates (Free GeoAPI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "9px 12px",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: "rgba(0, 213, 232, 0.18)",
                  border: "none",
                  borderLeft: "1px solid rgba(0, 213, 232, 0.3)",
                  color: "#00D5E8",
                  padding: "0 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={15} />
              </button>
            </form>

            {/* Nominatim Autocomplete Results Dropdown */}
            {searchResults.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: "6px",
                  background: "rgba(5, 11, 20, 0.96)",
                  border: "1px solid rgba(0, 213, 232, 0.4)",
                  borderRadius: "6px",
                  backdropFilter: "blur(14px)",
                  maxHeight: "220px",
                  overflowY: "auto",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.8)",
                  zIndex: 1001,
                }}
              >
                {searchResults.map((res, i) => (
                  <div
                    key={`${res.place_id}-${i}`}
                    onClick={() => handleSelectSearchResult(res)}
                    style={{
                      padding: "8px 12px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      fontSize: "11px",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 213, 232, 0.15)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <MapPin size={13} color="#00D5E8" />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {res.display_name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GeoAPI Provider Switcher Pills */}
          <div style={{ pointerEvents: "auto", display: "flex", gap: "6px", background: "rgba(5, 11, 20, 0.92)", border: "1px solid rgba(57, 169, 255, 0.25)", padding: "4px", borderRadius: "6px", backdropFilter: "blur(12px)" }}>
            <button
              type="button"
              onClick={() => setActiveBaseLayer("dark")}
              style={{
                background: activeBaseLayer === "dark" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                border: activeBaseLayer === "dark" ? "1px solid #00D5E8" : "none",
                color: activeBaseLayer === "dark" ? "#00D5E8" : "#94A9B8",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              DARK INTELLIGENCE
            </button>
            <button
              type="button"
              onClick={() => setActiveBaseLayer("satellite")}
              style={{
                background: activeBaseLayer === "satellite" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                border: activeBaseLayer === "satellite" ? "1px solid #00D5E8" : "none",
                color: activeBaseLayer === "satellite" ? "#00D5E8" : "#94A9B8",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              ESRI SATELLITE (GEOAPI)
            </button>
            <button
              type="button"
              onClick={() => setActiveBaseLayer("ocean")}
              style={{
                background: activeBaseLayer === "ocean" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                border: activeBaseLayer === "ocean" ? "1px solid #00D5E8" : "none",
                color: activeBaseLayer === "ocean" ? "#00D5E8" : "#94A9B8",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              OCEAN BATHYMETRY
            </button>
            <button
              type="button"
              onClick={() => setActiveBaseLayer("osm")}
              style={{
                background: activeBaseLayer === "osm" ? "rgba(0, 213, 232, 0.25)" : "transparent",
                border: activeBaseLayer === "osm" ? "1px solid #00D5E8" : "none",
                color: activeBaseLayer === "osm" ? "#00D5E8" : "#94A9B8",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              OSM CARTOGRAPHY
            </button>
          </div>

          {/* Point 2: Distance Measurement Tool Button */}
          <div style={{ pointerEvents: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => {
                setIsMeasuring(!isMeasuring);
                if (isMeasuring) setMeasurePoints([]);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: isMeasuring ? "rgba(0, 245, 160, 0.25)" : "rgba(5, 11, 20, 0.92)",
                border: isMeasuring ? "1px solid #00F5A0" : "1px solid rgba(57, 169, 255, 0.3)",
                color: isMeasuring ? "#00F5A0" : "#DCE5EB",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                fontWeight: "700",
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                transition: "all 0.15s ease",
              }}
              title="Click two points on the map to measure nautical miles, kilometers, and compass bearing"
            >
              <Ruler size={13} />
              <span>{isMeasuring ? "RULER ACTIVE (CLICK A & B)" : "MEASURE DISTANCE"}</span>
            </button>
            {measurePoints.length > 0 && (
              <button
                type="button"
                onClick={handleClearMeasurement}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "rgba(255, 83, 83, 0.2)",
                  border: "1px solid rgba(255, 83, 83, 0.4)",
                  color: "#FF5353",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "700",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                }}
              >
                <RotateCcw size={11} />
                <span>RESET</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Leaflet Global Map Container */}
      <MapContainer
        center={[flyTarget.lat, flyTarget.lon]}
        zoom={flyTarget.zoom}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
          background: "#02060B",
          cursor: isMeasuring ? "crosshair" : "grab",
        }}
      >
        <MapFlyController targetLocation={flyTarget} />
        <MapInteractiveHUDHandler
          isMeasuring={isMeasuring}
          onMouseMove={setMouseCoords}
          onAddMeasurePoint={handleAddMeasurePoint}
          onLocationSelected={setClickedLocation}
        />

        {/* Selected Free GeoAPI Base Layer */}
        <TileLayer
          url={TILE_PROVIDERS[activeBaseLayer].url}
          attribution={TILE_PROVIDERS[activeBaseLayer].attribution}
          subdomains={TILE_PROVIDERS[activeBaseLayer].subdomains || "abc"}
          maxZoom={TILE_PROVIDERS[activeBaseLayer].maxZoom || 19}
        />

        {/* Optional OpenSeaMap Marine Seamarks & TSS Shipping Lanes Overlay (Free GeoAPI) */}
        {showSeaMarks && (
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            opacity={0.85}
          />
        )}

        {/* Global Oil Spill Hotspots Layer */}
        {showSpillHotspots &&
          GLOBAL_SPILL_HOTSPOTS.map((spill) => (
            <React.Fragment key={spill.id}>
              <Circle
                center={[spill.lat, spill.lon]}
                radius={spill.areaKm2 * 8000}
                pathOptions={{
                  color: spill.severity === "CRITICAL" ? "#FF5353" : "#FFB703",
                  fillColor: spill.severity === "CRITICAL" ? "#FF5353" : "#FFB703",
                  fillOpacity: 0.25,
                  weight: 2,
                  dashArray: "6 4",
                }}
              />
              <Marker
                position={[spill.lat, spill.lon]}
                icon={globalSpillIcon(spill.severity)}
                eventHandlers={{
                  click: () => {
                    if (onSelectSlick) onSelectSlick(spill);
                  },
                }}
              >
                <Popup>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", minWidth: "200px" }}>
                    <div style={{ color: spill.severity === "CRITICAL" ? "#FF5353" : "#FFB703", fontWeight: "800", fontSize: "13px", marginBottom: "4px" }}>
                      {spill.name}
                    </div>
                    <div style={{ fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
                      ID: {spill.id} | SENSOR: {spill.sensor}
                    </div>
                    <div>Area: <strong>{spill.areaKm2} km²</strong></div>
                    <div>Status: <span style={{ color: "#00F5A0", fontWeight: "700" }}>{spill.status}</span></div>
                    <div>Vessel Attribution: <strong>{spill.vessel}</strong></div>
                    <p style={{ margin: "6px 0 0", color: "#94A9B8", fontSize: "11px" }}>{spill.desc}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

        {/* Global Strategic Chokepoints Layer */}
        {showChokepoints &&
          GLOBAL_CHOKEPOINTS.map((cp) => (
            <Marker
              key={cp.name}
              position={[cp.lat, cp.lon]}
              icon={chokepointIcon}
            >
              <Popup>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", minWidth: "190px" }}>
                  <div style={{ color: "#00D5E8", fontWeight: "800", fontSize: "13px" }}>{cp.name}</div>
                  <div style={{ fontSize: "10px", color: "#FFB703", fontFamily: "var(--font-mono)", margin: "3px 0 6px" }}>
                    Traffic Density: {cp.traffic}
                  </div>
                  <div style={{ fontSize: "11px", color: "#DCE5EB" }}>{cp.desc}</div>
                  <div style={{ marginTop: "8px", fontSize: "10px", color: "#718898", fontFamily: "var(--font-mono)" }}>
                    COORDINATES: {cp.lat.toFixed(2)}°N, {cp.lon.toFixed(2)}°E
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Clicked Location Inspector Marker with Free Nominatim Data */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lon]} icon={inspectorIcon}>
            <Popup>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: "12px", minWidth: "210px" }}>
                <div style={{ color: "#00D5E8", fontWeight: "700", borderBottom: "1px solid rgba(0, 213, 232, 0.3)", paddingBottom: "4px", marginBottom: "6px" }}>
                  POINT TELEMETRY (NOMINATIM GEOAPI)
                </div>
                <div>Position: <strong>{clickedLocation.lat.toFixed(4)}°N, {clickedLocation.lon.toFixed(4)}°E</strong></div>
                {clickedLocation.place && (
                  <>
                    <div style={{ marginTop: "4px" }}>Country: <strong>{clickedLocation.place.country}</strong></div>
                    <div>Zone: <span style={{ color: "#00F5A0" }}>{clickedLocation.place.sea}</span></div>
                    <div style={{ fontSize: "10px", color: "#718898", marginTop: "4px", maxHeight: "40px", overflow: "hidden" }}>
                      {clickedLocation.place.displayName}
                    </div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Point 2: Distance Measurement Markers & Polyline */}
        {measurePoints[0] && (
          <Marker position={[measurePoints[0].lat, measurePoints[0].lon]} icon={measurePinA}>
            <Popup>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                <strong style={{ color: "#00F5A0" }}>RULER ORIGIN [POINT A]</strong>
                <br />
                Coordinates: {measurePoints[0].lat.toFixed(4)}°N, {measurePoints[0].lon.toFixed(4)}°E
              </div>
            </Popup>
          </Marker>
        )}

        {measurePoints[1] && (
          <Marker position={[measurePoints[1].lat, measurePoints[1].lon]} icon={measurePinB}>
            <Popup>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
                <strong style={{ color: "#FF5353" }}>RULER TARGET [POINT B]</strong>
                <br />
                Coordinates: {measurePoints[1].lat.toFixed(4)}°N, {measurePoints[1].lon.toFixed(4)}°E
              </div>
            </Popup>
          </Marker>
        )}

        {measurePoints.length === 2 && (
          <Polyline
            positions={[
              [measurePoints[0].lat, measurePoints[0].lon],
              [measurePoints[1].lat, measurePoints[1].lon],
            ]}
            pathOptions={{
              color: "#00F5A0",
              weight: 3.5,
              dashArray: "6 6",
              opacity: 0.95,
            }}
          />
        )}
      </MapContainer>

      {/* Point 2: Live Mouse Coordinates HUD */}
      <div
        style={{
          position: "absolute",
          bottom: "64px",
          left: "14px",
          zIndex: 999,
          background: "rgba(5, 11, 20, 0.92)",
          border: "1px solid rgba(0, 213, 232, 0.35)",
          borderRadius: "4px",
          padding: "6px 12px",
          fontSize: "10px",
          fontFamily: "var(--font-mono)",
          color: "#DCE5EB",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#00D5E8", fontWeight: "700" }}>
          <Crosshair size={12} className="os-pulse" />
          <span>WGS-84 HUD:</span>
        </div>
        <span>
          LAT: <strong style={{ color: "#FFFFFF" }}>{mouseCoords ? Math.abs(mouseCoords.lat).toFixed(4) : "19.5000"}°{mouseCoords ? (mouseCoords.lat >= 0 ? "N" : "S") : "N"}</strong>
        </span>
        <span>
          LON: <strong style={{ color: "#FFFFFF" }}>{mouseCoords ? Math.abs(mouseCoords.lon).toFixed(4) : "71.4000"}°{mouseCoords ? (mouseCoords.lon >= 0 ? "E" : "W") : "E"}</strong>
        </span>
        <span style={{ color: "#718898" }}>// EPSG:4326 LIVE TRACKING</span>
      </div>

      {/* Point 2: Floating Nautical Range & Bearing Measurement HUD */}
      {measurementResult && (
        <div
          style={{
            position: "absolute",
            bottom: "64px",
            right: "14px",
            zIndex: 999,
            background: "rgba(5, 11, 20, 0.95)",
            border: "1px solid rgba(0, 245, 160, 0.5)",
            borderRadius: "6px",
            padding: "10px 14px",
            backdropFilter: "blur(12px)",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.7)",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            minWidth: "250px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0, 245, 160, 0.25)", paddingBottom: "4px", marginBottom: "2px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#00F5A0", fontWeight: "700" }}>
              <Ruler size={13} />
              <span>GEODESIC MEASUREMENT</span>
            </div>
            <button
              type="button"
              onClick={handleClearMeasurement}
              style={{
                background: "none",
                border: "none",
                color: "#94A9B8",
                cursor: "pointer",
                fontSize: "11px",
                padding: "0 2px",
              }}
              title="Close measurement"
            >
              ✕
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#94A9B8" }}>Distance:</span>
            <strong style={{ color: "#00F5A0" }}>
              {measurementResult.distance.nm} NM ({measurementResult.distance.km} km)
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#94A9B8" }}>Initial Bearing:</span>
            <strong style={{ color: "#00D5E8" }}>
              {measurementResult.bearing.deg}° ({measurementResult.bearing.cardinal})
            </strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#94A9B8" }}>Drift Travel ETA:</span>
            <strong style={{ color: "#FFB703" }}>
              ~{(measurementResult.distance.nm / 1.8).toFixed(1)} h (@ 1.8 kn)
            </strong>
          </div>
        </div>
      )}

      {/* Bottom Bar: Global Maritime Chokepoint Jump Buttons */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "14px",
          right: "14px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          background: "rgba(5, 11, 20, 0.92)",
          border: "1px solid rgba(0, 213, 232, 0.3)",
          borderRadius: "6px",
          padding: "8px 14px",
          backdropFilter: "blur(12px)",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#00D5E8", fontWeight: "700" }}>
          <Globe size={14} />
          <span>GLOBAL JUMP:</span>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {GLOBAL_CHOKEPOINTS.slice(0, 6).map((cp) => (
            <button
              key={cp.name}
              type="button"
              onClick={() => setFlyTarget({ lat: cp.lat, lon: cp.lon, zoom: cp.zoom })}
              style={{
                background: "rgba(57, 169, 255, 0.12)",
                border: "1px solid rgba(57, 169, 255, 0.3)",
                color: "#DCE5EB",
                padding: "3px 8px",
                borderRadius: "3px",
                fontSize: "10px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 213, 232, 0.25)";
                e.currentTarget.style.color = "#00D5E8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(57, 169, 255, 0.12)";
                e.currentTarget.style.color = "#DCE5EB";
              }}
            >
              {cp.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "#FFFFFF" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "10px" }}>
            <input
              type="checkbox"
              checked={showSeaMarks}
              onChange={(e) => setShowSeaMarks(e.target.checked)}
            />
            <span>OpenSeaMap (GeoAPI)</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "10px" }}>
            <input
              type="checkbox"
              checked={showSpillHotspots}
              onChange={(e) => setShowSpillHotspots(e.target.checked)}
            />
            <span>Spill Hotspots</span>
          </label>
        </div>
      </div>
    </div>
  );
}
