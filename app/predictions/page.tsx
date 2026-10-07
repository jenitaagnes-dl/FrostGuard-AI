"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner } from "../components/Modals";

export default function PredictionsPage() {
  const {
    units,
    dispatchPreventativeAction,
    triggerSimulatedBreach,
    isBreachSimulated,
    setToastMessage,
  } = useTelemetry();

  const [ambientTemp, setAmbientTemp] = useState<number>(31.5);
  const [transitRemaining, setTransitRemaining] = useState<number>(45);
  const [selectedTrajectory, setSelectedTrajectory] = useState<"both" | "unmitigated" | "intervention">("both");

  const unitB = units.find((u) => u.id === "unitB") || units[1];

  // Dynamic calculation for predicted time to excursion based on sliders
  const calculatedEtaMinutes = Math.max(
    8,
    Math.round(42 - (ambientTemp - 25) * 1.5 - (transitRemaining > 30 ? 5 : 0))
  );

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              AI Cold-Chain Risk Prediction &amp; Anomaly Forecaster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary-fixed text-on-primary-fixed">
              LSTM + RANDOM FOREST v1.2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Machine learning early-warning engine projecting thermodynamic drift and barrier excursions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={triggerSimulatedBreach}
            className="px-3.5 py-2 rounded-lg bg-surface-container-low border border-error/50 text-error hover:bg-error-container/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            {isBreachSimulated ? "Reset Spike" : "Simulate Heat Spike"}
          </button>

          <button
            onClick={() =>
              setToastMessage(
                "⚡ Recalculated 24-step Monte Carlo trajectory simulation across 50,000 thermal paths."
              )
            }
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">model_training</span>
            Run Model Inference
          </button>
        </div>
      </div>

      {/* 4-Up KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Fleet Risk Index</span>
            <span className="material-symbols-outlined text-primary text-xl">
              speed
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono ${
                isBreachSimulated ? "text-error" : "text-amber-700"
              }`}
            >
              {isBreachSimulated ? "84" : "24"}
            </span>
            <span className="text-xs text-outline font-mono">/ 100 Risk</span>
          </div>
          <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBreachSimulated ? "bg-error w-[84%]" : "bg-amber-500 w-[24%]"
              }`}
            />
          </div>
          <p className="text-xs text-outline mt-2 flex items-center justify-between font-mono">
            <span>Safe: &lt; 50</span>
            <span className="text-tertiary font-semibold">96% Fleet stable</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Anomaly Forecast (2h)</span>
            <span className="material-symbols-outlined text-error text-xl">
              warning
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-error">1 Unit</span>
            <span className="text-xs font-bold text-on-surface">At-Risk</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-xs font-mono font-semibold">
              Storage Unit B
            </span>
            <span className="text-xs text-outline">Cryo-Carrier 02</span>
          </div>
          <p className="text-xs text-outline mt-2 font-mono">
            3 units normal • 0 fatal breach
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Projected Time-to-Excursion</span>
            <span className="material-symbols-outlined text-primary text-xl">
              timer
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono ${
                calculatedEtaMinutes < 20 ? "text-error" : "text-primary"
              }`}
            >
              {calculatedEtaMinutes}
            </span>
            <span className="text-xs font-semibold text-outline font-mono">
              Minutes
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-medium text-error">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Breach ETA: +8.0°C threshold if unmitigated</span>
          </div>
          <p className="text-xs text-outline mt-2">
            Transit Route Delta-7 • Regional Hub
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Model Accuracy</span>
            <span className="material-symbols-outlined text-tertiary text-xl">
              verified
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-tertiary">89.4%</span>
            <span className="text-xs text-outline font-mono">R² = 0.88</span>
          </div>
          <p className="text-xs text-outline mt-2 font-mono">
            10-fold cross validation score
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40 text-xs font-mono text-outline">
            <span>Residual: 0.08°C</span>
            <span className="text-tertiary font-semibold">1,240 Test Cycles</span>
          </div>
        </div>
      </div>

      {/* Main Feature Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-bright">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-container text-on-error-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  High-Priority Cold-Chain Anomaly Forecast
                </h2>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-error-container text-on-error-container">
                  CRITICAL PROJECTION
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Asset: <strong className="text-on-surface">Storage Unit B</strong> (Cryo-Carrier #CC-842) • Payload:{" "}
                <span className="text-primary font-medium">mRNA COVID-19 &amp; Pneumococcal (240 Doses)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-outline font-mono uppercase">Current Temp</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-on-surface">
                +{unitB.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div className="text-right">
              <p className="text-xs text-outline font-mono uppercase">Threshold Limit</p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-error">
                +8.0°C
              </p>
            </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="m-6 p-4 rounded-xl bg-surface-container-low border border-primary/30 flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary text-on-primary mt-0.5">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary uppercase">
                  AI Insight &amp; Root Cause Inference
                </span>
                <span className="text-[11px] font-mono bg-surface-container text-outline px-2 py-0.5 rounded">
                  Confidence: 94.2%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface mt-1.5 leading-relaxed">
                Temperature fluctuations detected in <strong className="text-primary font-semibold">Storage Unit B</strong>. Ambient heat penetration (+{ambientTemp}°C external) and vibration anomalies indicate potential coolant latch relaxation. Continued deviation will breach <strong className="text-error font-semibold">+8.0°C upper threshold within {calculatedEtaMinutes} minutes</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setToastMessage("📄 Telemetry inference log exported to JSON.")
            }
            className="px-3.5 py-2 rounded-lg border border-primary text-primary hover:bg-primary-fixed text-xs font-semibold whitespace-nowrap transition-colors self-start"
          >
            Export Telemetry Log
          </button>
        </div>

        {/* Interactive Trajectory Projection & Sliders Layout */}
        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chart visual (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-on-surface">
                Thermal Trajectory Forecast (+2.0°C to +8.0°C Envelope)
              </span>

              {/* Trajectory switcher */}
              <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant text-xs font-mono">
                <button
                  onClick={() => setSelectedTrajectory("both")}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedTrajectory === "both"
                      ? "bg-surface-container-lowest text-primary font-bold shadow-2xs"
                      : "text-outline"
                  }`}
                >
                  Both Scenarios
                </button>
                <button
                  onClick={() => setSelectedTrajectory("unmitigated")}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedTrajectory === "unmitigated"
                      ? "bg-error text-on-error font-bold"
                      : "text-outline"
                  }`}
                >
                  Unmitigated Risk
                </button>
                <button
                  onClick={() => setSelectedTrajectory("intervention")}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedTrajectory === "intervention"
                      ? "bg-tertiary text-on-tertiary font-bold"
                      : "text-outline"
                  }`}
                >
                  With Intervention
                </button>
              </div>
            </div>

            {/* High Precision Visual SVG Chart */}
            <div className="relative w-full h-80 bg-surface-bright rounded-xl border border-outline-variant/70 p-4 overflow-hidden">
              <svg
                className="w-full h-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 650 240"
              >
                <defs>
                  <linearGradient id="envelopeGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ECFDF5" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                {/* Safe zone band (2°C to 8°C) */}
                <rect
                  fill="url(#envelopeGrad)"
                  height="120"
                  width="580"
                  x="45"
                  y="60"
                />

                {/* Upper limit +8.0°C */}
                <line
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  x1="45"
                  x2="630"
                  y1="60"
                  y2="60"
                />
                <text className="font-mono text-[10px]" fill="#EF4444" x="10" y="64">
                  +8.0°C
                </text>

                {/* Lower limit +2.0°C */}
                <line
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  x1="45"
                  x2="630"
                  y1="180"
                  y2="180"
                />
                <text className="font-mono text-[10px]" fill="#EF4444" x="10" y="184">
                  +2.0°C
                </text>

                {/* Past 2h Historical line */}
                <path
                  d="M45,130 C120,126 190,118 260,105 C310,95 340,85 370,72"
                  fill="none"
                  stroke="#006194"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                {/* Present Marker Divider */}
                <line
                  stroke="#64748B"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                  x1="370"
                  x2="370"
                  y1="30"
                  y2="210"
                />
                <text
                  className="font-mono text-[10px] font-bold"
                  fill="#006194"
                  x="360"
                  y="225"
                >
                  NOW
                </text>

                {/* Scenario 1: Unmitigated Risk (climbs past 8°C -> y=35) */}
                {(selectedTrajectory === "both" || selectedTrajectory === "unmitigated") && (
                  <>
                    <path
                      d="M370,72 C420,58 480,45 610,32"
                      fill="none"
                      stroke="#EF4444"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <circle cx="610" cy="32" fill="#EF4444" r="5" />
                    <text
                      className="font-mono text-[10px] font-bold"
                      fill="#EF4444"
                      x="530"
                      y="24"
                    >
                      +9.4°C Breach
                    </text>
                  </>
                )}

                {/* Scenario 2: With Intervention (bends down safely -> y=125) */}
                {(selectedTrajectory === "both" || selectedTrajectory === "intervention") && (
                  <>
                    <path
                      d="M370,72 C430,95 500,125 610,125"
                      fill="none"
                      stroke="#006947"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <circle cx="610" cy="125" fill="#006947" r="5" />
                    <text
                      className="font-mono text-[10px] font-bold"
                      fill="#006947"
                      x="530"
                      y="145"
                    >
                      +4.8°C Safe
                    </text>
                  </>
                )}

                {/* X-axis labels */}
                <text className="font-mono text-[10px]" fill="#94A3B8" x="50" y="225">
                  -2h
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="200" y="225">
                  -1h
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="500" y="225">
                  +1h (Forecast)
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="590" y="225">
                  +2h
                </text>
              </svg>
            </div>
          </div>

          {/* Feature Importance & What-If Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Feature Importance Breakdown */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <span className="text-xs font-mono uppercase font-bold text-on-surface">
                Feature Importance Weights (Random Forest)
              </span>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-mono">
                    <span>Ambient Temp Gradient</span>
                    <span className="font-bold text-primary">38%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-primary h-full rounded-full w-[38%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono">
                    <span>Door/Latch Seal State</span>
                    <span className="font-bold text-primary">26%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-primary h-full rounded-full w-[26%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono">
                    <span>Transit Road Vibration</span>
                    <span className="font-bold text-primary">18%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-primary h-full rounded-full w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono">
                    <span>Battery Voltage Ripple</span>
                    <span className="font-bold text-primary">11%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-primary h-full rounded-full w-[11%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono">
                    <span>Sensor Age &amp; Calibration Drift</span>
                    <span className="font-bold text-primary">7%</span>
                  </div>
                  <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-primary h-full rounded-full w-[7%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive What-If Simulator */}
            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">
                  tune
                </span>
                <span className="text-xs font-mono uppercase font-bold text-on-surface">
                  What-If Sensitivity Tuning
                </span>
              </div>

              {/* Slider 1: Ambient Exterior Temp */}
              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span>External Ambient Temp</span>
                  <span className="font-bold text-amber-700">+{ambientTemp.toFixed(1)}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="38"
                  step="0.5"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
                  className="w-full mt-1.5 accent-primary cursor-pointer"
                />
              </div>

              {/* Slider 2: Transit Remaining */}
              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span>Transit Duration Remaining</span>
                  <span className="font-bold text-primary">{transitRemaining} Min</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={transitRemaining}
                  onChange={(e) => setTransitRemaining(parseInt(e.target.value))}
                  className="w-full mt-1.5 accent-primary cursor-pointer"
                />
              </div>

              <button
                onClick={dispatchPreventativeAction}
                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-base">send</span>
                Dispatch Simulated Intervention
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
