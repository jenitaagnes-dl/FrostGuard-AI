"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner, CalibrationModal } from "../components/Modals";

export default function LiveMonitoringPage() {
  const {
    units,
    triggerSimulatedBreach,
    isBreachSimulated,
    isLiveStreaming,
    setIsLiveStreaming,
    setToastMessage,
    searchQuery,
  } = useTelemetry();

  const [filterMode, setFilterMode] = useState<"all" | "compliant" | "warning" | "offline">("all");
  const [isCalibrateOpen, setIsCalibrateOpen] = useState(false);

  const safeUnits = units.filter((u) => u.status === "Safe");
  const warningUnits = units.filter((u) => u.status === "Warning" || u.status === "Breach");

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === "compliant") return u.status === "Safe";
    if (filterMode === "warning") return u.status === "Warning" || u.status === "Breach";
    if (filterMode === "offline") return u.status === "Offline";
    return true;
  });

  const meanTemp = (
    units.reduce((acc, u) => acc + u.temperature, 0) / units.length
  ).toFixed(1);

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
      {/* MVP Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Live Telemetry &amp; Unit Monitoring
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-full border border-tertiary-fixed shadow-2xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveStreaming ? "bg-tertiary animate-pulse" : "bg-outline"
                }`}
              />
              <span className="font-mono text-xs text-tertiary font-semibold">
                {isLiveStreaming ? "Stream active • 1 Hz sampling rate" : "Stream paused"}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Multi-point real-time cryogenic and refrigerated cold-chain verification telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerSimulatedBreach}
            className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95 ${
              isBreachSimulated
                ? "bg-error text-on-error animate-pulse"
                : "bg-error text-on-error hover:opacity-90"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              electric_bolt
            </span>
            <span>
              {isBreachSimulated ? "Reset Temperature Spike" : "Simulate Temperature Spike"}
            </span>
          </button>

          <button
            onClick={() => setIsCalibrateOpen(true)}
            className="px-3.5 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-low transition-colors text-xs font-medium flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            <span>Calibrate</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant pb-3">
        <button
          onClick={() => setFilterMode("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
            filterMode === "all"
              ? "bg-primary text-on-primary shadow-xs"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant"
          }`}
        >
          All Units ({units.length})
        </button>
        <button
          onClick={() => setFilterMode("compliant")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
            filterMode === "compliant"
              ? "bg-primary text-on-primary shadow-xs"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant"
          }`}
        >
          Compliant ({safeUnits.length})
        </button>
        <button
          onClick={() => setFilterMode("warning")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors flex items-center gap-1 ${
            filterMode === "warning"
              ? "bg-error text-on-error shadow-xs"
              : "bg-surface-container-lowest text-error hover:bg-error-container/30 border border-outline-variant"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-error" />
          Warning/Anomaly ({warningUnits.length})
        </button>
        <button
          onClick={() => setFilterMode("offline")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
            filterMode === "offline"
              ? "bg-primary text-on-primary shadow-xs"
              : "bg-surface-container-lowest text-outline hover:bg-surface-container border border-outline-variant"
          }`}
        >
          Offline (0)
        </button>
      </div>

      {/* Quick Metrics 4-Up Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1: Avg Temp */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-mono uppercase font-semibold text-outline">
              Avg Fleet Temperature
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">
              thermostat
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-primary">
              +{meanTemp}°C
            </span>
            <span className="text-xs font-semibold text-tertiary flex items-center">
              <span className="material-symbols-outlined text-xs mr-0.5">
                check_circle
              </span>
              Target Safe
            </span>
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            Optimal target range +2°C to +8°C
          </div>
        </div>

        {/* 2: Total Doses */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-mono uppercase font-semibold text-outline">
              Total Monitored Doses
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">
              vaccines
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-on-surface">
              12,450
            </span>
            <span className="text-xs text-outline font-mono">Vials</span>
          </div>
          <div className="text-xs text-outline mt-1">
            Vaccine Doses (Simulated inventory)
          </div>
        </div>

        {/* 3: Compliance Rate */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-mono uppercase font-semibold text-outline">
              Real-Time Compliance Rate
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              verified
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                warningUnits.length > 0 ? "text-amber-700" : "text-tertiary"
              }`}
            >
              {isBreachSimulated ? "78.4%" : "96.8%"}
            </span>
            <span className="text-xs font-medium text-outline">
              {warningUnits.length} Anomaly alert
            </span>
          </div>
          <div className="text-xs text-outline mt-1 font-mono">
            GXP 21 CFR Part 11 Audit Grade
          </div>
        </div>

        {/* 4: Sensor Network Latency */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-mono uppercase font-semibold text-outline">
              Sensor Network Latency
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">
              router
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-on-surface">
              42ms
            </span>
            <span className="text-xs text-tertiary font-mono">Active mesh</span>
          </div>
          <div className="text-xs text-outline mt-1">
            Simulated BLE Gateway • 4 nodes
          </div>
        </div>
      </div>

      {/* DETAILED STORAGE UNIT CARDS GRID (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUnits.map((u) => {
          const isWarning = u.status === "Warning";
          const isBreach = u.status === "Breach";

          return (
            <div
              key={u.id}
              id={u.id}
              className={`bg-surface-container-lowest rounded-xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                isBreach
                  ? "border-2 border-error bg-red-50/20"
                  : isWarning
                  ? "border-2 border-amber-300 bg-amber-50/20"
                  : "border-outline-variant hover:border-primary/50"
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary mt-0.5">
                      <span className="material-symbols-outlined text-2xl">
                        {u.id === "unitB"
                          ? "local_shipping"
                          : u.id === "unitC"
                          ? "ac_unit"
                          : "kitchen"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">
                          {u.model}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          • {u.type}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-on-surface mt-1">
                        {u.title}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                        <span className="material-symbols-outlined text-sm text-outline">
                          location_on
                        </span>
                        <span>{u.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      isBreach
                        ? "bg-red-100 text-error border border-red-300 animate-pulse"
                        : isWarning
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-50 text-tertiary border border-emerald-200"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isBreach
                          ? "bg-error animate-ping"
                          : isWarning
                          ? "bg-amber-600 animate-pulse"
                          : "bg-tertiary"
                      }`}
                    />
                    {u.status}
                  </span>
                </div>

                {/* Core Temperature & Target readout */}
                <div className="mt-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase text-on-surface-variant font-medium">
                      Core Chamber Temperature
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span
                        className={`text-3xl sm:text-4xl font-bold font-mono tracking-tight ${
                          isBreach
                            ? "text-error"
                            : isWarning
                            ? "text-amber-700"
                            : "text-tertiary"
                        }`}
                      >
                        +{u.temperature.toFixed(1)}°C
                      </span>
                      <span className="text-xs text-on-surface-variant font-mono">
                        (Target: +2.0°C to +8.0°C)
                      </span>
                    </div>
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 font-mono ${
                        isBreach
                          ? "text-error font-bold"
                          : isWarning
                          ? "text-amber-800"
                          : "text-tertiary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isBreach || isWarning ? "trending_up" : "trending_flat"}
                      </span>
                      {isBreach
                        ? "Critical threshold breach (+8.0°C violated)"
                        : isWarning
                        ? "Upward drift (+0.4°C / 10m) — Warning"
                        : "Steady thermal gradient (σ=0.08°C)"}
                    </div>
                  </div>

                  {/* Micro Visual Range Bar */}
                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                      <span>+2.0°C</span>
                      <span>+8.0°C</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-sky-400 h-full w-[25%]" />
                      <div className="bg-emerald-400 h-full w-[50%]" />
                      <div className="bg-amber-400 h-full w-[25%]" />
                    </div>
                    <div className="text-right text-[10px] font-mono font-semibold text-outline">
                      Safe Envelope Band
                    </div>
                  </div>
                </div>

                {/* Sensor Probes Telemetry Matrix */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Primary Probe</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5">
                      Pt100 (Dual RTD)
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Door/Seal</div>
                    <div
                      className={`font-mono font-bold mt-0.5 ${
                        u.seal === "Closed" ? "text-tertiary" : "text-amber-700"
                      }`}
                    >
                      {u.seal}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Battery State</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5">
                      {u.battery}% ({u.batteryStatus})
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Payload Load</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5 truncate">
                      {u.doses.toLocaleString()} vials
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="text-outline font-mono">
                  Payload: {u.payload}
                </span>

                <button
                  onClick={() =>
                    setToastMessage(
                      `🔍 Diagnostics telemetry packet requested for ${u.name}. BLE ping latency: 38ms.`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant text-primary font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">
                    query_stats
                  </span>
                  <span>Probe Diagnostics</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CalibrationModal
        isOpen={isCalibrateOpen}
        onClose={() => setIsCalibrateOpen(false)}
      />
    </main>
  );
}
