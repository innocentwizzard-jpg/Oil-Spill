import React, { useState, useEffect } from "react";
import { Waves, Menu, X, ShieldCheck, Terminal, Compass, ExternalLink } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";
import { getHealth } from "../services/api";

/**
 * Navigation Component — Ocean Sentinel Design System
 * 
 * Sticky maritime command bar providing global brand identity,
 * live backend telemetry status, section anchor navigation,
 * and quick-jump to the operational command center.
 */
export default function Navigation({ activeSection = "overview" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [systemOnline, setSystemOnline] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let mounted = true;
    getHealth()
      .then((res) => {
        if (mounted && res.status === "ok") setSystemOnline(true);
      })
      .catch(() => {
        if (mounted) setSystemOnline(false);
      });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { id: "overview", label: "OVERVIEW", href: "#overview" },
    { id: "orbit", label: "ORBIT", href: "#orbit" },
    { id: "detection", label: "DETECTION", href: "#detection" },
    { id: "drift", label: "DRIFT", href: "#drift" },
    { id: "command-center", label: "COMMAND CENTER", href: "#command-center" },
    { id: "maps", label: "GLOBAL MAP", href: "#maps" },
  ];

  const handleNavLinkClick = (e, link) => {
    setMobileMenuOpen(false);
    if (link.id === "maps") {
      e.preventDefault();
      if (window.history.replaceState) {
        window.history.replaceState(null, "", "#maps");
      }
      try {
        window.dispatchEvent(new Event("hashchange"));
      } catch {
        // fallback
      }
      const consoleEl = document.getElementById("command-center-console");
      if (consoleEl) {
        consoleEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className={`os-nav ${scrolled ? "os-nav--scrolled" : ""}`}>
      <div className="os-nav__inner">
        {/* Brand Identity */}
        <a href="#overview" className="os-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="os-brand__icon">
            <Waves size={22} />
          </div>
          <div className="os-brand__titles">
            <span className="os-brand__name">OCEAN SENTINEL</span>
            <span className="os-brand__tag">MARITIME OIL-SPILL INTELLIGENCE</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="os-nav__links" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`os-nav__link ${activeSection === link.id ? "is-active" : ""}`}
              onClick={(e) => handleNavLinkClick(e, link)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Telemetry Status & Direct Action */}
        <div className="os-nav__actions">
          <Badge
            variant={systemOnline ? "live" : "warning"}
            dot
            pulse={systemOnline}
            size="sm"
            className="os-nav__status-badge"
          >
            {systemOnline ? "SYSTEM ONLINE" : "CONNECTING..."}
          </Badge>

          <Button
            href="#command-center"
            variant="primary"
            size="sm"
            icon={ExternalLink}
            iconPosition="right"
            className="os-nav__cta"
          >
            Launch Platform
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="os-nav__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="os-nav__mobile-drawer">
          <nav className="os-nav__mobile-links">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`os-nav__mobile-link ${activeSection === link.id ? "is-active" : ""}`}
                onClick={(e) => handleNavLinkClick(e, link)}
              >
                {link.label}
              </a>
            ))}
            <div className="os-nav__mobile-action">
              <Button
                href="#command-center-console"
                variant="primary"
                size="md"
                icon={Terminal}
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                OPEN COMMAND CENTER
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
