import React, { useEffect, useRef, useState } from "react";
import "../styles/hero.css";
import Button from "./Button";
import Badge from "./Badge";
import {
  Compass,
  ArrowRight,
  ChevronDown,
  Satellite,
  Eye,
  Waves,
  Radio,
  ShieldAlert,
  Activity,
} from "lucide-react";

/**
 * OceanHero Component — Ocean Sentinel Cinematic Hero & Opening Experience
 * 
 * Implements a full-screen, atmospheric underwater oceanic environment featuring:
 * - Hardware-accelerated volumetric light shafts and caustic refraction.
 * - Ultra-lightweight HTML5 Canvas marine snow & bioluminescent particle physics.
 * - IntersectionObserver auto-pausing for 0% CPU consumption when scrolled out of view.
 * - Smooth mouse-driven parallax fluid response.
 * - Exact required brand titles, subtitles, value proposition, and telemetry cards.
 * - Subtle animated scroll indicator and seamless gradient transition into Section 2.
 */
export default function OceanHero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const isVisible = useRef(true);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Telemetry chip hover active state
  const [activeTelemetry, setActiveTelemetry] = useState(null);

  // Initialize Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // High-DPI handling clamped to 2x for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Particle Generation (Marine snow & bioluminescent specks)
    const particleCount = width < 768 ? 45 : 95;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const isForeground = Math.random() > 0.65;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: isForeground ? Math.random() * 1.8 + 1.0 : Math.random() * 0.9 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        speedY: (Math.random() * 0.4 + 0.15) * (isForeground ? 1.2 : 0.7),
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAmplitude: Math.random() * 1.5 + 0.5,
        isForeground,
        hue: Math.random() > 0.4 ? "cyan" : "blue", // Cyan or electric blue bioluminescence
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e) => {
      // Normalized coordinates from -1 to 1
      mousePos.current.targetX = (e.clientX / width - 0.5) * 2;
      mousePos.current.targetY = (e.clientY / height - 0.5) * 2;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver to suspend canvas when user scrolls to dashboard
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting && !animationFrameId.current) {
          loop();
        }
      },
      { threshold: 0.05 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // Canvas Render Loop
    const loop = () => {
      if (!isVisible.current) {
        animationFrameId.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;
      const mouseParallaxX = mousePos.current.x * 15;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fluid drifting mechanics
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayAmplitude + (p.isForeground ? mouseParallaxX * 0.08 : mouseParallaxX * 0.03);
        p.y -= p.speedY; // Marine snow gently ascending towards surface light

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // Subtle alpha breathing
        const alpha = p.baseAlpha + Math.sin(p.swayAngle * 2) * 0.15;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.hue === "cyan") {
          ctx.fillStyle = `rgba(0, 213, 232, ${Math.max(0.05, alpha)})`;
        } else {
          ctx.fillStyle = `rgba(57, 169, 255, ${Math.max(0.05, alpha)})`;
        }
        ctx.fill();

        // Soft glow for larger foreground specks
        if (p.isForeground && p.radius > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 213, 232, ${Math.max(0.02, alpha * 0.25)})`;
          ctx.fill();
        }
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    // Start animation loop
    loop();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      observer.disconnect();
    };
  }, []);

  // Telemetry items specification
  const telemetryPillars = [
    {
      id: "sar",
      code: "SATELLITE SAR",
      title: "Copernicus Sentinel-1",
      desc: "5.405 GHz C-band SAR penetrates weather and night across a 250 km IW swath.",
      icon: Satellite,
      badge: "5.405 GHz",
    },
    {
      id: "cv",
      code: "M1 VISION",
      title: "Dual-Domain AI",
      desc: "4x ESRGAN super-resolution + isoperimetric circularity quotient (< 0.70).",
      icon: Eye,
      badge: "4x ESRGAN",
    },
    {
      id: "drift",
      code: "M2 HYDRO",
      title: "Lagrangian Drift",
      desc: "3% windage hydrodynamic transport model with 10-minute timesteps and 5h forecast.",
      icon: Waves,
      badge: "3% Windage",
    },
    {
      id: "ais",
      code: "M3 TELEMETRY",
      title: "AIS Attribution",
      desc: "Multi-factor kinematic anomaly score (proximity, speed-drop, course-deviation).",
      icon: Radio,
      badge: "20 km Corridor",
    },
  ];

  return (
    <section id="overview" className="os-hero" ref={heroRef} aria-label="Hero Overview">
      {/* Procedural Atmospheric Volumetric Light Rays & Caustics */}
      <div className="os-hero__atmosphere" aria-hidden="true">
        <div className="os-hero__caustics" />
        <div className="os-hero__light-shafts">
          <div className="os-hero__shaft os-hero__shaft--1" />
          <div className="os-hero__shaft os-hero__shaft--2" />
          <div className="os-hero__shaft os-hero__shaft--3" />
          <div className="os-hero__shaft os-hero__shaft--4" />
        </div>
      </div>

      {/* Lightweight Marine Snow & Bioluminescent Particle Canvas */}
      <canvas ref={canvasRef} className="os-hero__canvas" aria-hidden="true" />

      {/* Hero Header & Typography Section */}
      <div className="os-hero__content">
        {/* Tactical HUD Coordinates & Sensor Telemetry */}
        <div className="os-hero__hud-strip" aria-label="Real-time telemetry readouts">
          <div className="os-hero__hud-item">
            <span className="os-hero__hud-dot" />
            <span>LAT 18°55'12"N</span>
            <span>LON 72°50'24"E</span>
          </div>
          <div className="os-hero__hud-item">
            <span>SECTOR: ARABIAN SEA CORRIDOR</span>
          </div>
          <div className="os-hero__hud-item">
            <span>BATHYMETRY: 420M</span>
          </div>
          <div className="os-hero__hud-item">
            <span>RADAR: S1A C-BAND VV/VH</span>
          </div>
        </div>

        {/* Tactical Eyebrow */}
        <div className="os-hero__eyebrow">
          <Badge variant="info" size="sm" dot>
            AUTONOMOUS MARITIME RECONNAISSANCE // COPERNICUS S1 + ACCESSAIS
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="os-hero__title">OCEAN SENTINEL</h1>

        {/* Supporting Heading */}
        <h2 className="os-hero__subtitle">AI-POWERED OIL SPILL INTELLIGENCE</h2>

        {/* Supporting Message */}
        <p className="os-hero__lead">
          The intelligence to detect, track and respond to threats beneath the surface.
        </p>

        {/* Primary Call to Actions */}
        <div className="os-hero__actions">
          <Button
            href="#command-center"
            variant="primary"
            size="lg"
            icon={Compass}
          >
            LAUNCH COMMAND CENTER
          </Button>

          <Button
            href="#orbit"
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            EXPLORE SATELLITE RADAR
          </Button>
        </div>
      </div>

      {/* Architectural Telemetry Micro-Cards */}
      <div className="os-hero__telemetry">
        <div className="os-hero__grid">
          {telemetryPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="os-hero__card"
                onMouseEnter={() => setActiveTelemetry(pillar.id)}
                onMouseLeave={() => setActiveTelemetry(null)}
              >
                <div className="os-hero__card-header">
                  <span className="os-hero__card-code">{pillar.code}</span>
                  <Badge variant="neutral" size="sm">
                    {pillar.badge}
                  </Badge>
                </div>
                <h3 className="os-hero__card-title">{pillar.title}</h3>
                <p className="os-hero__card-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Tactical Scroll Indicator */}
      <div className="os-hero__footer">
        <a href="#orbit" className="os-hero__scroll-link" aria-label="Scroll to Section 2: Orbit and Satellite Radar">
          <span>SCROLL TO EXPLORE SATELLITE RADAR</span>
          <ChevronDown size={18} className="os-hero__scroll-chevron" />
        </a>
      </div>

      {/* Seamless Transition Gradient into Section 2 */}
      <div className="os-hero__bottom-gradient" aria-hidden="true" />
    </section>
  );
}
