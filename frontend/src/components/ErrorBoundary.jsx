import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * ErrorBoundary Component — Tactical Fail-Safe for Ocean Sentinel
 * Prevents third-party mapping or runtime errors from crashing the application.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Ocean Sentinel ErrorBoundary caught an exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "24px",
            background: "rgba(10, 27, 43, 0.85)",
            border: "1px solid rgba(255, 83, 83, 0.4)",
            borderRadius: "6px",
            color: "#FFFFFF",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            margin: "16px 0",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "rgba(255, 83, 83, 0.15)",
              color: "#FF5353",
              marginBottom: "12px",
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "#FF5353", letterSpacing: "1px" }}>
            MODULE TELEMETRY INTERRUPTED
          </h4>
          <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#94A9B8", maxWidth: "480px", marginInline: "auto" }}>
            {this.props.fallbackMessage || "An isolated rendering error occurred in this intelligence component. Surrounding telemetry and mission systems remain active."}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0, 213, 232, 0.15)",
              border: "1px solid rgba(0, 213, 232, 0.5)",
              color: "#00D5E8",
              padding: "6px 14px",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontWeight: "700",
            }}
          >
            <RefreshCw size={12} />
            <span>REINITIALIZE MODULE</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
