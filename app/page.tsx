"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTelemetry } from "./context/TelemetryContext";
import { DisclaimerBanner, CalibrationModal, ExportSummaryModal } from "./components/Modals";

export default function DashboardPage() {
  const {
    units,
    isBreachSimulated,
    triggerSimulatedBreach,
    dispatchPreventativeAction,
    alerts,
    searchQuery,
  } = useTelemetry();

  const [activeUnitChartFilter, setActiveUnitChartFilter] = useState<string>("All Units");
  const [activeTimeframe, setActiveTimeframe] = useState<string>("12h");
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Filter units based on search
  const filteredUnits = units.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.payload.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const safeCount = units.filter((u) => u.status === "Safe").length;
  const warningCount = units.filter((u) => u.status === "Warning").length;
  const breachCount = units.filter((u) => u.status === "Breach").length;

  const meanTemp = (
    units.reduce((acc, u) => acc + u.temperature, 0) / units.length
  ).toFixed(1);

  const unitB = units.find((u) => u.id === "unitB") || units[1];

  // SVG coordinate calculation for unit B based on current temp
  // 10°C -> y=20, 8°C -> y=60, 5°C -> y=120, 2°C -> y=180, 0°C -> y=220
  // Formula: y = 120 - (temp - 5.0) * 20
  const unitBY = Math.max(30, Math.min(210, 120 - (unitB.temperature - 5.0) * 20));

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1">
      {/* Persistent MVP Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Header Section with Welcome & Telemetry Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Cold-Chain Overview &amp; Real-Time Telemetry
            </h1>
            <span
              className={`px-2.5 py-0.5 font-mono text-[11px] rounded-full font-semibold ${
                breachCount > 0
                  ? "bg-error text-on-error animate-pulse"
                  : warningCount > 0
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {breachCount > 0
                ? "STATUS: CRITICAL BREACH"
                : warningCount > 0
                ? "STATUS: ANOMALY DRIFT"
                : "STATUS: NOMINAL"}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Continuous monitoring of bio-storage units (Target Range: +2.0°C to +8.0°C)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="text-right hidden xl:block mr-2">
            <div className="text-xs text-outline font-mono">Live Demo Feed: 1s</div>
            <div className="text-xs text-primary font-medium">(GXP 21 CFR Sync)</div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={triggerSimulatedBreach}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
              isBreachSimulated
                ? "bg-error text-on-error animate-pulse"
                : "bg-surface-container-lowest border border-error text-error hover:bg-error-container/20"
            }`}
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            {isBreachSimulated ? "Reset Thermal Breach" : "Trigger Simulated Breach"}
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container-low text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Summary
          </button>

          <button
            onClick={() => setIsCalibrateOpen(true)}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Calibrate Sensors (Demo)
          </button>
        </div>
      </div>

      {/* Cold-Chain Health Metrics Row (KPI Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {/* KPI 1: Overall Status */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Fleet Integrity
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full inline-block ${
                breachCount > 0
                  ? "bg-error animate-ping"
                  : "bg-tertiary animate-pulse"
              }`}
            />
            <span className="text-xl sm:text-2xl font-bold text-on-surface">
              {breachCount > 0 ? "78.5%" : "94.2%"}
            </span>
          </div>
          <div className="text-xs text-tertiary flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">
              {breachCount > 0 ? "warning" : "check_circle"}
            </span>
            <span>{safeCount} of 4 in safe band</span>
          </div>
        </div>

        {/* KPI 2: Active Units */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Active Units
          </div>
          <div className="my-2">
            <span className="text-xl sm:text-2xl font-bold text-on-surface">
              4 / 4
            </span>
            <span className="text-xs text-outline ml-1">Monitored</span>
          </div>
          <div className="text-xs text-outline">Units A, B, C, D Online</div>
        </div>

        {/* KPI 3: Safe Units */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Safe Units
          </div>
          <div className="my-2">
            <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              {safeCount} Units
            </span>
          </div>
          <div className="text-xs text-outline">+2.0°C to +8.0°C Valid</div>
        </div>

        {/* KPI 4: Warning Units */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Warning Units
          </div>
          <div className="my-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                warningCount > 0 || breachCount > 0
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-surface-container text-outline border-outline-variant"
              }`}
            >
              {warningCount + breachCount} Unit{warningCount + breachCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="text-xs text-amber-800 truncate">
            Unit B (+{unitB.temperature.toFixed(1)}°C)
          </div>
        </div>

        {/* KPI 5: Critical Alerts */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Critical Alerts
          </div>
          <div className="my-2">
            <span
              className={`text-xl sm:text-2xl font-bold ${
                breachCount > 0 ? "text-error" : "text-tertiary"
              }`}
            >
              {breachCount} Active
            </span>
          </div>
          <div className="text-xs text-outline">
            {breachCount > 0 ? "Excursion in progress" : "Last resolved 18m ago"}
          </div>
        </div>

        {/* KPI 6: Mean Fleet Temp */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
            Mean Fleet Temp
          </div>
          <div className="my-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
              +{meanTemp}°C
            </span>
          </div>
          <div className="text-xs text-outline">Target midpoint: +4.0°C</div>
        </div>
      </div>

      {/* Two-Column Interactive Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* MAIN / LEFT COLUMN (8 cols of 12) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Primary Chart Card: Fleet Temperature Telemetry */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-outline-variant/40">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    show_chart
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">
                    Fleet Temperature Telemetry (Past 12 Hours)
                  </h2>
                </div>
                <p className="text-xs text-outline mt-0.5">
                  Calibrated thermistor stream across distributed cold storage nodes
                </p>
              </div>

              {/* Filters & Timeframe */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Unit Selector Tabs */}
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/50 text-xs">
                  {["All Units", "Unit A", "Unit B", "Unit C", "Unit D"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveUnitChartFilter(tab)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        activeUnitChartFilter === tab
                          ? "bg-surface-container-lowest text-primary font-semibold shadow-xs"
                          : "text-outline hover:text-on-surface"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Timeframe Pills */}
                <div className="flex bg-surface p-1 rounded-lg border border-outline-variant/40 text-xs font-mono">
                  {["1h", "6h", "12h", "24h", "7d"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeTimeframe === tf
                          ? "bg-primary text-on-primary font-semibold"
                          : "text-outline hover:text-on-surface"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Telemetry Legend & Boundaries */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-outline mb-4 gap-2">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-primary rounded" /> Unit A (+{units[0].temperature.toFixed(1)}°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-500 rounded" /> Unit B (+{unitB.temperature.toFixed(1)}°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-secondary rounded" /> Unit C (+{units[2].temperature.toFixed(1)}°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-tertiary rounded" /> Unit D (+{units[3].temperature.toFixed(1)}°C)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-100 border border-emerald-400 rounded-xs" /> Safe Zone (+2.0°C to +8.0°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-t border-dashed border-error" /> Threshold Breaches
                </span>
              </div>
            </div>

            {/* Continuous SVG Telemetry Graph */}
            <div className="relative w-full h-72 bg-surface-bright rounded-xl border border-outline-variant/40 p-2 overflow-hidden">
              <svg
                className="w-full h-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 700 240"
              >
                <defs>
                  <linearGradient id="safeZoneGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ECFDF5" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Safe Zone Box (representing 2°C to 8°C range) */}
                <rect
                  fill="url(#safeZoneGrad)"
                  height="120"
                  width="630"
                  x="50"
                  y="60"
                />

                {/* Upper Threshold Line (+8.0°C) */}
                <line
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  x1="50"
                  x2="680"
                  y1="60"
                  y2="60"
                />
                <text className="font-mono text-[10px]" fill="#B91C1C" x="15" y="64">
                  8.0°C
                </text>

                {/* Median Target Line (+5.0°C) */}
                <line
                  stroke="#CBD5E1"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                  x1="50"
                  x2="680"
                  y1="120"
                  y2="120"
                />
                <text className="font-mono text-[10px]" fill="#64748B" x="15" y="124">
                  5.0°C
                </text>

                {/* Lower Threshold Line (+2.0°C) */}
                <line
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  x1="50"
                  x2="680"
                  y1="180"
                  y2="180"
                />
                <text className="font-mono text-[10px]" fill="#B91C1C" x="15" y="184">
                  2.0°C
                </text>

                {/* Unit A Curve (Primary Blue, Stable around +4.2°C) */}
                {(activeUnitChartFilter === "All Units" || activeUnitChartFilter === "Unit A") && (
                  <path
                    d="M50,140 C120,135 180,142 250,138 C320,134 400,136 480,137 C560,138 620,135 680,136"
                    fill="none"
                    stroke="#006194"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                  />
                )}

                {/* Unit C Curve (Deep Slate, +3.8°C) */}
                {(activeUnitChartFilter === "All Units" || activeUnitChartFilter === "Unit C") && (
                  <path
                    d="M50,150 C130,148 210,142 300,146 C380,150 470,144 550,143 C610,142 650,145 680,144"
                    fill="none"
                    stroke="#565e74"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                  />
                )}

                {/* Unit D Curve (Green, +4.9°C) */}
                {(activeUnitChartFilter === "All Units" || activeUnitChartFilter === "Unit D") && (
                  <path
                    d="M50,126 C140,124 220,120 310,123 C390,125 480,121 570,123 C630,124 660,121 680,122"
                    fill="none"
                    stroke="#006947"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                )}

                {/* Unit B Curve (Dynamic according to unitBY) */}
                {(activeUnitChartFilter === "All Units" || activeUnitChartFilter === "Unit B") && (
                  <>
                    <path
                      d={`M50,128 C150,120 250,110 350,96 C450,84 550,76 680,${unitBY}`}
                      fill="none"
                      stroke={unitB.temperature > 8.0 ? "#EF4444" : "#D97706"}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    {/* Live pulse point on Unit B */}
                    <circle
                      cx="680"
                      cy={unitBY}
                      fill={unitB.temperature > 8.0 ? "#EF4444" : "#D97706"}
                      r="4.5"
                    />
                    <circle
                      className="animate-ping"
                      cx="680"
                      cy={unitBY}
                      fill={unitB.temperature > 8.0 ? "#EF4444" : "#D97706"}
                      opacity="0.4"
                      r="9"
                    />
                  </>
                )}

                {/* Time stamps on x-axis */}
                <text className="font-mono text-[10px]" fill="#94A3B8" x="60" y="215">
                  12h ago
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="210" y="215">
                  9h ago
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="360" y="215">
                  6h ago
                </text>
                <text className="font-mono text-[10px]" fill="#94A3B8" x="510" y="215">
                  3h ago
                </text>
                <text className="font-mono text-[10px] font-bold" fill="#006194" x="650" y="215">
                  Now
                </text>
              </svg>
            </div>
          </div>

          {/* Storage Unit Status Grid (4 Units) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                Monitored Bio-Storage Units
              </h2>
              <span className="text-xs text-outline">
                Real-time Node Status &amp; Sensors ({filteredUnits.length} units)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredUnits.map((u) => {
                const isUnitWarning = u.status === "Warning";
                const isUnitBreach = u.status === "Breach";

                return (
                  <div
                    key={u.id}
                    className={`bg-surface-container-lowest rounded-xl p-5 shadow-xs transition-all ${
                      isUnitBreach
                        ? "border-2 border-error bg-red-50/20"
                        : isUnitWarning
                        ? "border-2 border-amber-300 bg-amber-50/20"
                        : "border border-outline-variant/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-on-surface">
                            {u.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              isUnitBreach
                                ? "bg-error text-on-error animate-pulse"
                                : isUnitWarning
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                        <div className="text-xs text-outline mt-0.5 truncate max-w-[220px]">
                          {u.type} • {u.location}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold font-mono ${
                            isUnitBreach
                              ? "text-error"
                              : isUnitWarning
                              ? "text-amber-600"
                              : "text-primary"
                          }`}
                        >
                          +{u.temperature.toFixed(1)}°C
                        </div>
                        <div
                          className={`text-xs font-medium ${
                            isUnitBreach
                              ? "text-error font-bold"
                              : isUnitWarning
                              ? "text-amber-700"
                              : "text-tertiary"
                          }`}
                        >
                          {isUnitBreach
                            ? "CRITICAL EXCURSION"
                            : isUnitWarning
                            ? "Anomaly Detected"
                            : `${u.stability}% Stability`}
                        </div>
                      </div>
                    </div>

                    {/* Mini sparkline & metrics footer */}
                    <div
                      className={`mt-4 pt-4 border-t flex items-center justify-between text-xs ${
                        isUnitBreach
                          ? "border-error/40"
                          : isUnitWarning
                          ? "border-amber-200/60"
                          : "border-outline-variant/40"
                      }`}
                    >
                      <div className="flex items-center gap-4 text-outline font-mono">
                        <span className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{
                              color:
                                u.battery < 85
                                  ? "#d97706"
                                  : "#006947",
                            }}
                          >
                            battery_charging_full
                          </span>
                          {u.battery}%
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            {u.seal === "Closed" ? "lock" : "warning"}
                          </span>
                          Seal: {u.seal}
                        </span>
                      </div>

                      <Link
                        href={`/live-monitoring#${u.id}`}
                        className={`font-semibold flex items-center gap-0.5 hover:underline ${
                          isUnitBreach
                            ? "text-error"
                            : isUnitWarning
                            ? "text-amber-800"
                            : "text-primary"
                        }`}
                      >
                        <span>View Telemetry</span>
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols of 12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* AI Cold-Chain Risk Prediction Card */}
          <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-surface-variant/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">
                    psychology
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    FrostGuard Predictive Engine
                  </h3>
                  <div className="text-xs text-outline font-mono">
                    Simulated ML Model v1.2
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[11px] font-mono rounded font-semibold">
                ACTIVE
              </span>
            </div>

            {/* Risk Score Gauges */}
            <div className="my-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-outline uppercase tracking-wider font-semibold font-mono">
                  Composite Fleet Risk Score
                </span>
                <span
                  className={`text-xs font-bold font-mono ${
                    breachCount > 0
                      ? "text-error"
                      : warningCount > 0
                      ? "text-amber-700"
                      : "text-tertiary"
                  }`}
                >
                  {breachCount > 0 ? "84 / 100 (Critical)" : "18 / 100 (Low Overall)"}
                </span>
              </div>
              <div className="w-full bg-outline-variant/30 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    breachCount > 0
                      ? "bg-error w-[84%]"
                      : "bg-tertiary w-[18%]"
                  }`}
                />
              </div>
            </div>

            {/* Critical Forecast Notice */}
            <div
              className={`p-4 rounded-xl border mb-5 transition-colors ${
                breachCount > 0
                  ? "bg-red-50/80 border-error"
                  : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`material-symbols-outlined text-lg mt-0.5 ${
                    breachCount > 0 ? "text-error" : "text-amber-600"
                  }`}
                >
                  warning_amber
                </span>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      breachCount > 0 ? "text-red-900" : "text-amber-900"
                    }`}
                  >
                    {breachCount > 0
                      ? "Critical Excursion Active: Unit B"
                      : "Predicted Drift: Unit B"}
                  </div>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      breachCount > 0 ? "text-red-800" : "text-amber-800"
                    }`}
                  >
                    {breachCount > 0
                      ? "Unit B is actively reading above +8.0°C! Initiate cold-box transfer SOP immediately."
                      : "Unit B projected to exceed +8.0°C in ~42 minutes due to gradual ambient drift."}
                  </p>
                  <div
                    className={`mt-2 text-[11px] font-mono font-medium ${
                      breachCount > 0 ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    Confidence Score: 89% (Random Forest Ensemble - Demo)
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 mb-5">
              <div className="text-xs text-primary uppercase font-bold tracking-wider mb-1 flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-sm">
                  lightbulb
                </span>
                Prescriptive Action
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                Alert logistics operator to inspect secondary lid latch on{" "}
                <strong>Unit B</strong> before irreparable thermal degradation occurs.
              </p>
            </div>

            <button
              onClick={dispatchPreventativeAction}
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Dispatch Preventative Action
            </button>
          </div>

          {/* Recent Telemetry Alerts Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">
                  history
                </span>
                <h3 className="text-sm font-bold text-on-surface">
                  Recent Telemetry Alerts
                </h3>
              </div>
              <Link
                href="/alerts"
                className="text-primary hover:underline text-xs font-medium"
              >
                View Log
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {alerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    a.severity === "critical"
                      ? "bg-red-50/70 border-error/50"
                      : a.severity === "warning"
                      ? "bg-amber-50/60 border-amber-200/60"
                      : "bg-surface-container-low border-outline-variant/40"
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-md material-symbols-outlined text-sm ${
                      a.severity === "critical"
                        ? "bg-error text-on-error"
                        : a.severity === "warning"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-surface-container text-primary"
                    }`}
                  >
                    {a.severity === "critical"
                      ? "error"
                      : a.severity === "warning"
                      ? "thermostat"
                      : "sync"}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-on-surface truncate">
                        {a.title}
                      </span>
                      <span className="text-[10px] text-outline font-mono whitespace-nowrap">
                        {a.timestamp}
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2">
                      {a.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Telemetry Calibration Footnote */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 text-center">
            <div className="text-xs font-mono text-outline">
              Model Engine: NIST Traceable Biolog Calibration • Demo Seed: #98421
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalibrationModal
        isOpen={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
      />
      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </main>
  );
}
