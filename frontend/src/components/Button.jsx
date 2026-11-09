import React from "react";

/**
 * Button Component — Ocean Sentinel Design System
 * 
 * Variants:
 *   - 'primary':   High-contrast electric cyan with deep navy text and restrained glow
 *   - 'secondary': Translucent deep navy glass with subtle electric blue border
 *   - 'danger':    Coral red accent for emergency alerts and critical dispatches
 *   - 'ghost':     Minimalist surface with cyan hover accents
 *   - 'outline':   Crisp fine cyan border with transparent background
 * 
 * Sizes:
 *   - 'sm': Compact telemetry actions (height: 32px)
 *   - 'md': Standard tactical action (height: 40px)
 *   - 'lg': Prominent hero CTA (height: 48px)
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon = null,
  iconPosition = "left",
  loading = false,
  disabled = false,
  onClick,
  href = null,
  className = "",
  style = {},
  type = "button",
  ...rest
}) {
  const baseClasses = "os-btn";
  const variantClass = `os-btn--${variant}`;
  const sizeClass = `os-btn--${size}`;
  const stateClass = loading ? "is-loading" : disabled ? "is-disabled" : "";
  const combinedClasses = [baseClasses, variantClass, sizeClass, stateClass, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? (
        <span className="os-btn__spinner" aria-hidden="true" />
      ) : (
        Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className="os-btn__icon" />
      )}
      <span className="os-btn__label">{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className="os-btn__icon" />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        style={style}
        aria-disabled={disabled || loading}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      style={style}
      {...rest}
    >
      {content}
    </button>
  );
}
