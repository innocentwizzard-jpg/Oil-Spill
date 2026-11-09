import React from "react";

/**
 * Badge Component — Ocean Sentinel Design System
 * 
 * Variants:
 *   - 'live':     Active real-time telemetry (pulsing emerald dot)
 *   - 'success':  Verified state / normal vessel behavior
 *   - 'warning':  Suspicious kinematic anomaly / medium risk
 *   - 'critical': Confirmed oil spill / high-risk suspect vessel
 *   - 'info':     System telemetry metadata / orbital passes
 *   - 'neutral':  Standard monospaced data label
 */
export default function Badge({
  children,
  variant = "neutral",
  dot = false,
  pulse = false,
  icon: Icon = null,
  size = "md",
  className = "",
  style = {},
  ...rest
}) {
  const baseClasses = "os-badge";
  const variantClass = `os-badge--${variant}`;
  const sizeClass = `os-badge--${size}`;
  const combinedClasses = [baseClasses, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={combinedClasses} style={style} {...rest}>
      {dot && (
        <span
          className={`os-badge__dot ${pulse ? "os-badge__dot--pulse" : ""}`}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon size={size === "sm" ? 12 : 14} className="os-badge__icon" />}
      <span className="os-badge__text">{children}</span>
    </span>
  );
}
