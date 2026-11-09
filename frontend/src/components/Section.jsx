import React from "react";

/**
 * Section Component — Ocean Sentinel Design System
 * 
 * Reusable full-width section wrapper with consistent responsive padding,
 * max-width container, section index indicator, and cinematic header hierarchy.
 */
export default function Section({
  id,
  index = null,
  eyebrow = null,
  title = null,
  lead = null,
  badge = null,
  actions = null,
  gridBackground = false,
  vignette = false,
  className = "",
  containerClassName = "",
  headerClassName = "",
  children,
  style = {},
  ...rest
}) {
  const hasHeader = Boolean(index || eyebrow || title || lead || badge || actions);

  return (
    <section
      id={id}
      className={`os-section ${gridBackground ? "bg-tactical-grid" : ""} ${vignette ? "vignette-overlay" : ""} ${className}`}
      style={style}
      {...rest}
    >
      <div className={`os-section__container ${containerClassName}`}>
        {hasHeader && (
          <header className={`os-section__header ${headerClassName}`}>
            <div className="os-section__header-meta">
              {index && <span className="os-section__index">{index}</span>}
              {eyebrow && <span className="eyebrow-tag">{eyebrow}</span>}
              {badge}
            </div>

            <div className="os-section__header-main">
              <div className="os-section__title-group">
                {title && <h2 className="os-section__title">{title}</h2>}
                {lead && <p className="os-section__lead">{lead}</p>}
              </div>

              {actions && <div className="os-section__actions">{actions}</div>}
            </div>
          </header>
        )}

        <div className="os-section__content">
          {children}
        </div>
      </div>
    </section>
  );
}
