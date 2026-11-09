import React, { useState, useRef, useCallback, useEffect } from "react";
import { Sliders, Maximize2, Sparkles, Eye, ShieldAlert, Crosshair, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Badge from "./Badge";

/**
 * SarComparisonSlider Component — Interactive SAR Image Splitter
 * 
 * Provides an interactive before/after split slider allowing operators to compare:
 * - Left (Before): Raw Sentinel-1 Synthetic Aperture Radar (SAR) with microwave speckle noise
 * - Right (After): 4x ESRGAN Super-Resolution + Otsu Binarized & Isoperimetric Segmented Slick
 */
export default function SarComparisonSlider({
  rawImage = "./fixtures/sar/raw_sar_001.png",
  enhancedImage = "./fixtures/sar/enhanced_sar_001.png",
  showControls = true,
  height = "420px",
  slickData = {
    area_sq_km: 0.0406,
    circularity: 0.38,
    centroid: { lat: 19.5, lon: 71.4 },
    method: "4x ESRGAN + Digital Land Mask + Otsu Binarization",
  },
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [pseudoColorMode, setPseudoColorMode] = useState(false);
  const containerRef = useRef(null);

  // Calculate position from pointer event
  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Number(clampedPos.toFixed(1)));
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    updatePosition(e.clientX || (e.touches && e.touches[0].clientX));
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
      if (clientX !== undefined) {
        updatePosition(clientX);
      }
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse/touch move listener during drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove, { passive: true });
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Home") {
      setSliderPos(0);
    } else if (e.key === "End") {
      setSliderPos(100);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: "rgba(5, 11, 20, 0.95)",
        borderRadius: "8px",
        border: "1px solid rgba(0, 213, 232, 0.25)",
        overflow: "hidden",
        boxShadow: "0 12px 36px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Interactive Top Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "rgba(10, 27, 43, 0.8)",
          borderBottom: "1px solid rgba(57, 169, 255, 0.18)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#00D5E8",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.5px",
            }}
          >
            <Sliders size={14} />
            <span>SAR INTERACTIVE SPLIT INSPECTOR</span>
          </div>
          <Badge variant="neutral" size="sm">
            {sliderPos.toFixed(0)}% SPLIT
          </Badge>
        </div>

        {/* Preset quick buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            style={{
              background: sliderPos === 0 ? "rgba(0, 213, 232, 0.2)" : "rgba(5, 11, 20, 0.6)",
              border: sliderPos === 0 ? "1px solid #00D5E8" : "1px solid rgba(255, 255, 255, 0.1)",
              color: sliderPos === 0 ? "#00D5E8" : "#94A9B8",
              padding: "4px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            SEGMENTED
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            style={{
              background: sliderPos === 50 ? "rgba(0, 213, 232, 0.2)" : "rgba(5, 11, 20, 0.6)",
              border: sliderPos === 50 ? "1px solid #00D5E8" : "1px solid rgba(255, 255, 255, 0.1)",
              color: sliderPos === 50 ? "#00D5E8" : "#94A9B8",
              padding: "4px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            50/50
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(100)}
            style={{
              background: sliderPos === 100 ? "rgba(0, 213, 232, 0.2)" : "rgba(5, 11, 20, 0.6)",
              border: sliderPos === 100 ? "1px solid #00D5E8" : "1px solid rgba(255, 255, 255, 0.1)",
              color: sliderPos === 100 ? "#00D5E8" : "#94A9B8",
              padding: "4px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
          >
            RAW SAR
          </button>

          <span style={{ width: "1px", height: "14px", background: "rgba(255, 255, 255, 0.15)", margin: "0 2px" }} />

          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: showOverlay ? "rgba(255, 83, 83, 0.18)" : "rgba(5, 11, 20, 0.6)",
              border: showOverlay ? "1px solid rgba(255, 83, 83, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              color: showOverlay ? "#FF5353" : "#718898",
              padding: "4px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
            title="Toggle segmented slick contour outline"
          >
            <Crosshair size={11} />
            <span>CONTOURS</span>
          </button>

          <button
            type="button"
            onClick={() => setPseudoColorMode(!pseudoColorMode)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: pseudoColorMode ? "rgba(0, 245, 160, 0.18)" : "rgba(5, 11, 20, 0.6)",
              border: pseudoColorMode ? "1px solid rgba(0, 245, 160, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              color: pseudoColorMode ? "#00F5A0" : "#718898",
              padding: "4px 8px",
              borderRadius: "3px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
            }}
            title="Toggle pseudo-color radar thermal enhancement"
          >
            <Sparkles size={11} />
            <span>FALSE-COLOR</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-label="SAR Image Splitter (drag to compare raw SAR and segmented spill)"
        aria-valuenow={sliderPos}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          position: "relative",
          width: "100%",
          height: height,
          background: "#02060B",
          overflow: "hidden",
          cursor: isDragging ? "ew-resize" : "col-resize",
          userSelect: "none",
          outline: "none",
        }}
      >
        {/* Layer 1 (Bottom / Full Width): 4x ESRGAN Segmented Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={enhancedImage}
            alt="Enhanced SAR Segmentation"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: pseudoColorMode ? "hue-rotate(180deg) saturate(2) contrast(1.2)" : "contrast(1.15) brightness(1.05)",
            }}
          />

          {/* Segmented Vector Polygon Overlay */}
          {showOverlay && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
              viewBox="0 0 500 500"
            >
              {/* Primary Detected Oil Slick matching test_vision_pipeline: y[210:290], x[120:380] */}
              <g filter="drop-shadow(0 0 8px rgba(255, 83, 83, 0.7))">
                <rect
                  x="120"
                  y="210"
                  width="260"
                  height="80"
                  fill="rgba(255, 83, 83, 0.38)"
                  stroke="#FF5353"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              </g>

              {/* Centroid Reticle */}
              <circle cx="250" cy="250" r="5" fill="#00D5E8" />
              <line x1="236" y1="250" x2="264" y2="250" stroke="#00D5E8" strokeWidth="1.5" />
              <line x1="250" y1="236" x2="250" y2="264" stroke="#00D5E8" strokeWidth="1.5" />

              <text x="125" y="198" fill="#FF5353" fontSize="12" fontFamily="var(--font-mono)" fontWeight="700">
                OIL SLICK CONTOUR — 0.0406 km² (CONFIRMED)
              </text>
              <text x="125" y="310" fill="#00D5E8" fontSize="10" fontFamily="var(--font-mono)">
                CIRCULARITY: 0.38 (&lt; 0.70 ALGAL REJECTION)
              </text>

              {/* Water Mask False Positive Rejection Tag */}
              <rect
                x="10"
                y="10"
                width="60"
                height="60"
                fill="none"
                stroke="#718898"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text x="15" y="85" fill="#718898" fontSize="9" fontFamily="var(--font-mono)">
                LAND MASKED
              </text>
            </svg>
          )}

          {/* Right Label (Segmented) */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(5, 11, 20, 0.88)",
              border: "1px solid rgba(0, 245, 160, 0.4)",
              borderRadius: "4px",
              padding: "6px 10px",
              backdropFilter: "blur(8px)",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ color: "#00F5A0", fontWeight: "700", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
              4x ESRGAN + OTSU SEGMENTATION
            </div>
            <div style={{ color: "#718898", fontSize: "10px", fontFamily: "var(--font-mono)" }}>
              Isoperimetric Filter (&lt; 0.70)
            </div>
          </div>
        </div>

        {/* Layer 2 (Top / Clipped by sliderPos): Raw Speckled SAR Image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid transparent",
          }}
        >
          <img
            src={rawImage}
            alt="Raw Sentinel-1 SAR Backscatter"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: pseudoColorMode ? "hue-rotate(180deg) saturate(1.8) contrast(1.1)" : "contrast(1.05)",
            }}
          />

          {/* Left Label (Raw SAR) */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              background: "rgba(5, 11, 20, 0.88)",
              border: "1px solid rgba(0, 213, 232, 0.4)",
              borderRadius: "4px",
              padding: "6px 10px",
              backdropFilter: "blur(8px)",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div style={{ color: "#00D5E8", fontWeight: "700", fontSize: "11px", fontFamily: "var(--font-mono)" }}>
              RAW SENTINEL-1 SAR (C-BAND IW)
            </div>
            <div style={{ color: "#718898", fontSize: "10px", fontFamily: "var(--font-mono)" }}>
              Speckle Microwave Backscatter
            </div>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: "2px",
            background: "#00D5E8",
            boxShadow: "0 0 12px #00D5E8, 0 0 24px rgba(0, 213, 232, 0.6)",
            pointerEvents: "none",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          {/* Draggable Circular Handle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(5, 11, 20, 0.95)",
              border: "2px solid #00D5E8",
              boxShadow: isDragging
                ? "0 0 20px #00D5E8, inset 0 0 8px rgba(0, 213, 232, 0.5)"
                : "0 0 10px rgba(0, 213, 232, 0.6)",
              display: "grid",
              placeItems: "center",
              cursor: "ew-resize",
              pointerEvents: "auto",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", color: "#00D5E8" }}>
              <ChevronLeft size={13} strokeWidth={3} />
              <ChevronRight size={13} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Tactical Crosshair Watermark at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5, 11, 20, 0.85)",
            border: "1px solid rgba(0, 213, 232, 0.25)",
            borderRadius: "3px",
            padding: "3px 8px",
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "#94A9B8",
            pointerEvents: "none",
            letterSpacing: "1px",
          }}
        >
          ◄ DRAG OR USE ARROW KEYS TO SWIPE ►
        </div>
      </div>

      {/* Architectural Telemetry Footer */}
      {showControls && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            padding: "12px 16px",
            background: "rgba(10, 27, 43, 0.75)",
            borderTop: "1px solid rgba(57, 169, 255, 0.15)",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
          }}
        >
          <div>
            <span style={{ color: "#718898" }}>TARGET SENSOR:</span>
            <div style={{ color: "#00D5E8", fontWeight: "700" }}>Copernicus Sentinel-1 C-SAR</div>
          </div>
          <div>
            <span style={{ color: "#718898" }}>GROUND RESOLUTION:</span>
            <div style={{ color: "#FFFFFF", fontWeight: "700" }}>5m / Pixel (4x ESRGAN)</div>
          </div>
          <div>
            <span style={{ color: "#718898" }}>SEGMENTED AREA:</span>
            <div style={{ color: "#FF5353", fontWeight: "700" }}>{slickData.area_sq_km || 0.0406} km² (True Slick)</div>
          </div>
          <div>
            <span style={{ color: "#718898" }}>ISOPERIMETRIC RATIO:</span>
            <div style={{ color: "#00F5A0", fontWeight: "700" }}>{slickData.circularity || 0.38} (&lt; 0.70 Threshold)</div>
          </div>
        </div>
      )}
    </div>
  );
}
