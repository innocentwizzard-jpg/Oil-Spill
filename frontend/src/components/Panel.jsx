import React from "react";

/**
 * Panel Component — Ocean Sentinel Design System
 * 
 * Reusable maritime intelligence card/container with fine borders,
 * restrained glassmorphic depth, and optional tactical corner brackets.
 * 
 * Props:
 *   - variant: 'default' | 'elevated' | 'glass' | 'subtle'
 *   - title: string | ReactNode
 *   - subtitle: string
 *   - icon: Lucide Icon component
 *   - badge: ReactNode (e.g. <Badge />)
 *   - actions: ReactNode (e.g. action buttons)
 *   - tacticalCorners: boolean (displays fine crosshair/bracket accents)
 *   - headerBorder: boolean
 */
export default function Panel({
  children,
  title,
  subtitle,
  icon: Icon = null,
  badge = null,
  actions = null,
  variant = "default",
  tacticalCorners = false,
  headerBorder = true,
  className = "",
  contentClassName = "",
  style = {},
  ...rest
}) {
  const hasHeader = Boolean(title || subtitle || Icon || badge || actions);

  return (
    <div
      className={`os-panel os-panel--${variant} ${tacticalCorners ? "os-panel--tactical" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {tacticalCorners && (
        <>
          <span className="os-corner os-corner--tl" aria-hidden="true" />
          <span className="os-corner os-corner--tr" aria-hidden="true" />
          <span className="os-corner os-corner--bl" aria-hidden="true" />
          <span className="os-corner os-corner--br" aria-hidden="true" />
        </>
      )}

      {hasHeader && (
        <div className={`os-panel__header ${headerBorder ? "os-panel__header--bordered" : ""}`}>
          <div className="os-panel__header-left">
            {Icon && (
              <div className="os-panel__header-icon">
                <Icon size={16} />
              </div>
            )}
            <div>
              {title && <h3 className="os-panel__title">{title}</h3>}
              {subtitle && <span className="os-panel__subtitle">{subtitle}</span>}
            </div>
          </div>

          {(badge || actions) && (
            <div className="os-panel__header-right">
              {badge}
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={`os-panel__content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
