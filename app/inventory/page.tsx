"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner } from "../components/Modals";

export default function InventoryPage() {
  const { units, setToastMessage, searchQuery, setSearchQuery } = useTelemetry();

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"risk" | "temp" | "doses">("risk");

  const filteredUnits = units.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.payload.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "Compliant") return u.status === "Safe";
    if (activeFilter === "Attention") return u.status === "Warning" || u.status === "Breach";
    if (activeFilter === "Cryo") return u.type.toLowerCase().includes("cryo") || u.type.toLowerCase().includes("freezer");
    if (activeFilter === "Refrigerated") return !u.type.toLowerCase().includes("freezer");
    return true;
  });

  const sortedUnits = [...filteredUnits].sort((a, b) => {
    if (sortBy === "temp") return b.temperature - a.temperature;
    if (sortBy === "doses") return b.doses - a.doses;
    // default: risk
    const riskScore = (u: typeof a) =>
      u.status === "Breach" ? 3 : u.status === "Warning" ? 2 : 1;
    return riskScore(b) - riskScore(a);
  });

  const totalDoses = units.reduce((acc, u) => acc + u.doses, 0);

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
              Storage Units &amp; Cold-Chain Inventory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary-fixed text-on-primary-fixed">
              4 ASSETS ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            GXP regulatory audit log, payload custody verification, and hardware sensor status.
          </p>
        </div>

        <button
          onClick={() =>
            setToastMessage("📋 Inventory registry re-synced with hospital central database.")
          }
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">sync</span>
          Sync Fleet Inventory
        </button>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="text-xs text-outline font-mono uppercase font-semibold">
            Monitored Units
          </div>
          <div className="text-2xl font-bold font-mono text-on-surface mt-1">
            4 / 4 Online
          </div>
          <div className="text-xs text-tertiary mt-1">100% telemetry uptime</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="text-xs text-outline font-mono uppercase font-semibold">
            Preserved Doses
          </div>
          <div className="text-2xl font-bold font-mono text-primary mt-1">
            {totalDoses.toLocaleString()} Vials
          </div>
          <div className="text-xs text-outline mt-1 font-mono">~$1,248,000 asset value</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="text-xs text-outline font-mono uppercase font-semibold">
            Compliance Grade
          </div>
          <div className="text-2xl font-bold font-mono text-tertiary mt-1">
            WHO PQS
          </div>
          <div className="text-xs text-outline mt-1">21 CFR Part 11 Validated</div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div className="text-xs text-outline font-mono uppercase font-semibold">
            Average Battery
          </div>
          <div className="text-2xl font-bold font-mono text-on-surface mt-1">
            93.2%
          </div>
          <div className="text-xs text-tertiary mt-1">Mains &amp; Lithium Hybrid</div>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 px-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs font-mono">
          {[
            { label: "All Units (4)", key: "All" },
            { label: "Compliant Safe (3)", key: "Compliant" },
            { label: "Attention Required (1)", key: "Attention" },
            { label: "Ultra-Cold / Cryo (1)", key: "Cryo" },
            { label: "Refrigerated 2-8°C (3)", key: "Refrigerated" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.key
                  ? "bg-primary text-on-primary font-semibold shadow-2xs"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Sort & View Toggles */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="py-1.5 pl-3 pr-8 text-xs font-mono bg-surface-container-low border border-outline-variant rounded-lg text-on-surface font-medium focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="risk">Sort by: Risk Level</option>
            <option value="temp">Temperature: High to Low</option>
            <option value="doses">Dose Volume</option>
          </select>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-surface-container-lowest text-primary shadow-2xs"
                  : "text-outline hover:text-on-surface"
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-surface-container-lowest text-primary shadow-2xs"
                  : "text-outline hover:text-on-surface"
              }`}
              title="Table View"
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content: Grid View or Table View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sortedUnits.map((u) => {
            const isWarning = u.status === "Warning";
            const isBreach = u.status === "Breach";

            return (
              <div
                key={u.id}
                className={`bg-surface-container-lowest border rounded-xl p-6 shadow-xs transition-all space-y-5 ${
                  isBreach
                    ? "border-2 border-error bg-red-50/20"
                    : isWarning
                    ? "border-2 border-amber-300 bg-amber-50/20"
                    : "border-outline-variant hover:border-primary/50"
                }`}
              >
                {/* Unit Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary mt-0.5">
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

                {/* Telemetry Core Box */}
                <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono uppercase text-on-surface-variant font-medium">
                      Core Chamber Temperature
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span
                        className={`text-3xl font-bold font-mono tracking-tight ${
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
                    <div className="text-xs font-mono text-outline mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-tertiary">
                        check_circle
                      </span>
                      <span>Pt100 RTD Primary Probe Calibrated</span>
                    </div>
                  </div>

                  <div className="w-full md:w-56 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                      <span>+2.0°C Min</span>
                      <span>+8.0°C Max</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-sky-400 h-full w-[25%]" />
                      <div className="bg-emerald-400 h-full w-[50%]" />
                      <div className="bg-amber-400 h-full w-[25%]" />
                    </div>
                    <div className="text-right text-[10px] font-mono text-outline">
                      Envelope Margin: Safe
                    </div>
                  </div>
                </div>

                {/* Pharmaceutical Payload Spec Table */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Payload Doses</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5">
                      {u.doses.toLocaleString()} Vials
                    </div>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Primary Vaccine</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5 truncate">
                      {u.payload.split("&")[0]}
                    </div>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Power Rail</div>
                    <div className="font-mono font-bold text-on-surface mt-0.5 truncate">
                      {u.powerSource}
                    </div>
                  </div>
                  <div className="p-3 bg-surface rounded-lg border border-outline-variant/40">
                    <div className="text-outline text-[11px]">Seal Status</div>
                    <div
                      className={`font-mono font-bold mt-0.5 ${
                        u.seal === "Closed" ? "text-tertiary" : "text-amber-700"
                      }`}
                    >
                      {u.seal}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                  <span className="text-outline font-mono">
                    Last Defrost: {u.lastDefrost}
                  </span>
                  <button
                    onClick={() =>
                      setToastMessage(
                        `📄 Chain-of-Custody GXP manifest printed for ${u.name} (Batch: FG-LOT-${Math.floor(
                          Math.random() * 8999 + 1000
                        )}).`
                      )
                    }
                    className="text-primary hover:underline font-semibold flex items-center gap-1 font-mono"
                  >
                    <span>Audit Manifest</span>
                    <span className="material-symbols-outlined text-sm">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-container-low text-outline uppercase border-b border-outline-variant text-[11px]">
                <tr>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Title &amp; Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Chamber Temp</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payload</th>
                  <th className="py-3 px-4">Battery</th>
                  <th className="py-3 px-4">Seal</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {sortedUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-primary">{u.model}</td>
                    <td className="py-3 px-4 font-sans font-medium text-on-surface">
                      {u.title}
                    </td>
                    <td className="py-3 px-4 text-outline font-sans">{u.location}</td>
                    <td className="py-3 px-4 font-bold text-base">
                      <span
                        className={
                          u.status === "Breach"
                            ? "text-error"
                            : u.status === "Warning"
                            ? "text-amber-700"
                            : "text-tertiary"
                        }
                      >
                        +{u.temperature.toFixed(1)}°C
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === "Breach"
                            ? "bg-red-100 text-error"
                            : u.status === "Warning"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-outline">
                      {u.doses.toLocaleString()} vials ({u.payload.split("&")[0]})
                    </td>
                    <td className="py-3 px-4">{u.battery}%</td>
                    <td className="py-3 px-4">{u.seal}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setToastMessage(`Inspection opened for ${u.name}`)
                        }
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
