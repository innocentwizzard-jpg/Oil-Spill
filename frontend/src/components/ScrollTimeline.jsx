import React, { useEffect, useState } from "react";
import "../styles/storytelling.css";

/**
 * ScrollTimeline Component — Left Vertical Storyline Tracker
 * 
 * Implements the sticky narrative indicator from the design concept:
 * - 01 Hero (0-3s)
 * - 02 From Ocean to Orbit (3-6s)
 * - 03 Detection & Segmentation (6-9s)
 * - 04 Prediction & Impact (9-12s)
 * - 05 The Platform (12-15s)
 * 
 * Uses an IntersectionObserver scroll-spy to actively highlight the current section
 * and provides smooth one-click navigation between stages.
 */
export default function ScrollTimeline() {
  const [activeSection, setActiveSection] = useState("overview");

  const timelineSteps = [
    { id: "overview", label: "Ocean Abyss" },
    { id: "orbit", label: "Orbit & Radar" },
    { id: "detection", label: "Spill Detection" },
    { id: "drift", label: "Drift Forecast" },
    { id: "command-center", label: "Command Center" },
  ];

  useEffect(() => {
    const sectionElements = timelineSteps
      .map((step) => document.getElementById(step.id))
      .filter(Boolean);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-25% 0px -40% 0px", // Trigger when section is prominently in viewport
        threshold: 0.1,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <nav className="os-timeline" aria-label="Storyline Progress Navigation">
      {timelineSteps.map((step) => {
        const isActive = activeSection === step.id;
        return (
          <a
            key={step.id}
            href={`#${step.id}`}
            onClick={(e) => handleClick(e, step.id)}
            className={`os-timeline__item ${isActive ? "is-active" : ""}`}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="os-timeline__node" />
            <div className="os-timeline__meta">
              <span className="os-timeline__label">{step.label}</span>
            </div>
          </a>
        );
      })}
    </nav>
  );
}
