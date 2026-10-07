"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner } from "../components/Modals";

export default function AlertsPage() {
  const {
    units,
    alerts,
    acknowledgeAlert,
    triageChecklist,
    toggleChecklistItem,
    dispatchPreventativeAction,
    triggerSimulatedBreach,
    isBreachSimulated,
    setToastMessage,
  } = useTelemetry();

  const [activeFilter, setActiveFilter] = useState<string>("All");

  const unitB = units.find((u) => u.id === "unitB") || units[1];
  const isUnitBBreach = unitB.status === "Breach";

  const completedChecklistCount = Object.values(triageChecklist).filter(Boolean).length;

  const filteredAlerts = alerts.filter((a) => {
    if (activeFilter === "Warnings") return a.severity === "warning" || a.severity === "critical";
    if (activeFilter === "Resolved") return a.severity === "resolved" || a.acknowledged;
    if (activeFilter === "Info") return a.severity === "info";
    return true;
  });

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Alerts &amp; Incident Triage Station
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 ${
                isBreachSimulated
                  ? "bg-red-100 text-error border border-red-300 animate-pulse"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isBreachSimulated ? "bg-error animate-ping" : "bg-amber-600 animate-pulse"
                }`}
              />
              {isBreachSimulated
                ? "1 FATAL EXCURSION BREACH ACTIVE"
                : "1 Active Drift Warning • 0 Fatal Breaches"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Real-time thermal excursion escalation, root cause telemetry, and WHO PQS compliance response.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={triggerSimulatedBreach}
            className="px-3.5 py-2 rounded-lg bg-surface-container-low border border-error/50 text-error hover:bg-error-container/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            {isBreachSimulated ? "Reset Breach" : "Simulate Breach"}
          </button>

          <button
            onClick={() => {
              alerts.forEach((a) => acknowledgeAlert(a.id));
              setToastMessage("All open incidents acknowledged in compliance log.");
            }}
            className="px-3.5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">done_all</span>
            Acknowledge All (Demo)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Active Excursions</span>
            <span className="p-1 rounded bg-surface-container text-error material-symbols-outlined text-base">
              warning
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                isUnitBBreach ? "text-error" : "text-tertiary"
              }`}
            >
              {isUnitBBreach ? "1 Fatal" : "0 Fatal"}
            </span>
            <span className="text-xs text-outline font-mono">
              {isUnitBBreach ? "Immediate action" : "Threshold clean"}
            </span>
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            Vaccine viability limit: +8.0°C
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>At-Risk Assets</span>
            <span className="p-1 rounded bg-surface-container text-amber-700 material-symbols-outlined text-base">
              thermostat
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-700">1</span>
            <span className="text-xs text-amber-800 font-mono font-medium">At-Risk</span>
          </div>
          <div className="text-xs text-amber-800 mt-1 flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>Unit B - Upward drift (~42m ETA)</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Resolved Past 24h</span>
            <span className="p-1 rounded bg-surface-container text-tertiary material-symbols-outlined text-base">
              task_alt
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-on-surface">7</span>
            <span className="text-xs text-outline font-mono">Incidents</span>
          </div>
          <div className="text-xs text-outline mt-1 flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-xs">timer</span>
            <span>Mean resolution: 4.8 min</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="flex items-center justify-between text-outline text-xs font-mono uppercase font-semibold">
            <span>Anomaly Index</span>
            <span className="p-1 rounded bg-surface-container text-primary material-symbols-outlined text-base">
              insights
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-on-surface">14%</span>
            <span className="text-xs text-primary font-mono font-medium">Low-Medium</span>
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            Simulated LSTM detector
          </div>
        </div>
      </div>

      {/* Active Excursion Deep-Dive Focal Card */}
      <div
        className={`bg-surface-container-lowest rounded-xl border shadow-xs overflow-hidden transition-all ${
          isUnitBBreach ? "border-2 border-error" : "border-2 border-amber-300"
        }`}
      >
        <div
          className={`px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isUnitBBreach
              ? "bg-red-50 border-error/40"
              : "bg-amber-50/80 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isUnitBBreach ? "bg-error" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isUnitBBreach ? "bg-error" : "bg-amber-500"
                }`}
              />
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  isUnitBBreach
                    ? "bg-error text-on-error"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {isUnitBBreach ? "CRITICAL BREACH" : "ACTION REQUIRED"}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-on-surface">
                Incident ALT-2024-089: Critical Upward Thermal Drift Detected
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900">
            <span className="material-symbols-outlined text-base">alarm</span>
            <span>
              {isUnitBBreach
                ? "EXCURSION TIME: +8.3°C ACTIVE BREACH"
                : "TIME TO EXCURSION: ~42 MIN"}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Diagnostic Column */}
          <div className="lg:col-span-4 space-y-4 lg:border-r border-outline-variant/60 pr-0 lg:pr-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
                Affected Asset
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-on-surface">
                  Storage Unit B
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-xs font-semibold">
                  Cryo-Carrier #CC-842
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Location: Transit Van 02 • Route Regional Hub #4
              </p>
            </div>

            {/* Thermal Core Gauge Box */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-outline">Current Core Telemetry</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  +0.4°C / 10m drift
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-bold font-mono ${
                    isUnitBBreach ? "text-error" : "text-amber-700"
                  }`}
                >
                  +{unitB.temperature.toFixed(1)}°C
                </span>
                <span className="text-xs font-mono text-outline">
                  / Target +2.0°C to +8.0°C
                </span>
              </div>

              {/* Range progress visualization */}
              <div className="space-y-1">
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-sky-400 h-full w-[25%]" />
                  <div className="bg-emerald-500 h-full w-[60%]" />
                  <div
                    className={`h-full w-[15%] ${
                      isUnitBBreach ? "bg-error animate-pulse" : "bg-amber-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-outline">
                  <span>+2.0°C (Min)</span>
                  <span className="font-bold text-amber-700">
                    +{unitB.temperature.toFixed(1)}°C (Now)
                  </span>
                  <span className="text-error font-bold">+8.0°C (Max)</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg border border-outline-variant leading-relaxed">
              <strong className="text-on-surface font-semibold">Predictive Assessment:</strong>{" "}
              Telemetry indicates latent insulation depletion or lid seal relaxation during transport vibrations. At current velocity, upper barrier (+8.0°C) is breached or imminent.
            </div>
          </div>

          {/* Middle Column: Recommended SOP Checklist */}
          <div className="lg:col-span-5 space-y-4 lg:border-r border-outline-variant/60 pr-0 lg:pr-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
                Simulated Triage Protocol (WHO PQS Standard)
              </p>
              <span className="text-xs font-mono text-tertiary font-bold">
                {completedChecklistCount} of 3 Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Checklist 1 */}
              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant cursor-pointer hover:bg-surface-container transition-colors">
                <input
                  type="checkbox"
                  checked={triageChecklist[1] || false}
                  onChange={() => toggleChecklistItem(1)}
                  className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <div className="space-y-0.5 text-xs">
                  <span
                    className={`font-semibold ${
                      triageChecklist[1]
                        ? "line-through text-outline"
                        : "text-on-surface"
                    }`}
                  >
                    1. Operator push notification dispatched
                  </span>
                  <p className="text-outline font-mono text-[11px]">
                    Automated SMS/Push sent to Van 02 Driver (14:26:10)
                  </p>
                </div>
              </label>

              {/* Checklist 2 */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  triageChecklist[2]
                    ? "bg-surface-container-low border-outline-variant"
                    : "bg-amber-50/70 border-amber-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={triageChecklist[2] || false}
                  onChange={() => toggleChecklistItem(2)}
                  className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <div className="space-y-0.5 text-xs">
                  <span
                    className={`font-semibold ${
                      triageChecklist[2]
                        ? "line-through text-outline"
                        : "text-amber-900"
                    }`}
                  >
                    2. Inspect secondary mechanical latch &amp; seal
                  </span>
                  <p className="text-on-surface-variant text-[11px]">
                    Driver protocol: pull over safely and verify secondary compression latches.
                  </p>
                </div>
              </label>

              {/* Checklist 3 */}
              <label className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant cursor-pointer hover:bg-surface-container-low transition-colors">
                <input
                  type="checkbox"
                  checked={triageChecklist[3] || false}
                  onChange={() => toggleChecklistItem(3)}
                  className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
                />
                <div className="space-y-0.5 text-xs">
                  <span
                    className={`font-semibold ${
                      triageChecklist[3]
                        ? "line-through text-outline"
                        : "text-on-surface"
                    }`}
                  >
                    3. Transfer to dry-ice emergency backup kit
                  </span>
                  <p className="text-outline text-[11px]">
                    Contingency transfer if internal chamber exceeds +8.0°C for &gt;15 minutes.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-outline font-semibold">
              Emergency Triggers
            </p>

            <button
              onClick={() => {
                dispatchPreventativeAction();
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">send</span>
              Dispatch Preventative SOP
            </button>

            <button
              onClick={() => {
                setToastMessage("📲 High-priority encrypted radio ping broadcast to Van 02 dashboard.");
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">notifications_active</span>
              Radio Van 02 Driver
            </button>

            <button
              onClick={() => {
                acknowledgeAlert("alt-1");
                setToastMessage("✅ Incident ALT-2024-089 marked resolved in QA register.");
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-surface-container-lowest border border-tertiary text-tertiary hover:bg-tertiary-container/15 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Mark Triage Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Incident Resolution Log Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-xs overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">history</span>
            <h2 className="text-sm font-bold text-on-surface">
              Telemetry Incident &amp; Escalation Log
            </h2>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono">
            {["All", "Warnings", "Resolved", "Info"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeFilter === tab
                    ? "bg-primary text-on-primary font-semibold"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface-container-low text-outline uppercase border-b border-outline-variant text-[11px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Event Description</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary">{a.code}</td>
                  <td className="py-3 px-4 font-sans font-medium text-on-surface max-w-sm">
                    {a.title}
                    <div className="text-[11px] text-outline font-normal mt-0.5">
                      {a.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold">{a.unitId.toUpperCase()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        a.severity === "critical"
                          ? "bg-red-100 text-error animate-pulse"
                          : a.severity === "warning"
                          ? "bg-amber-100 text-amber-900"
                          : a.severity === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-surface-container text-primary"
                      }`}
                    >
                      {a.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-outline">{a.timestamp}</td>
                  <td className="py-3 px-4 text-right">
                    {!a.acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(a.id)}
                        className="px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary-container font-semibold transition-colors"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-tertiary flex items-center justify-end gap-1 font-semibold">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                        Logged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
