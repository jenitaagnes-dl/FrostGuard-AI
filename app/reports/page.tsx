"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner, ExportSummaryModal } from "../components/Modals";

export default function ReportsPage() {
  const { setToastMessage } = useTelemetry();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const reports = [
    {
      id: "rep-1",
      title: "GXP 21 CFR Part 11 Regulatory Compliance Dossier",
      period: "October 1 – 7, 2026",
      status: "Compliant (Validated)",
      format: "PDF",
      size: "2.4 MB",
      icon: "verified",
    },
    {
      id: "rep-2",
      title: "NIST Calibration & Thermistor Sensor Zero Logs",
      period: "Bi-Weekly Calibration Cycle",
      status: "Audited",
      format: "PDF",
      size: "1.1 MB",
      icon: "tune",
    },
    {
      id: "rep-3",
      title: "Cold-Chain Thermal Excursion & Triage Incident Register",
      period: "Past 30 Days (8 Incident Records)",
      status: "Attention Noted",
      format: "CSV",
      size: "8.6 MB",
      icon: "warning",
    },
    {
      id: "rep-4",
      title: "Mean Kinetic Temperature (MKT) Bio-Stability Certificate",
      period: "Q3 2026 Fleet Summary",
      status: "Certified",
      format: "PDF",
      size: "3.7 MB",
      icon: "assessment",
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
      <DisclaimerBanner />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Audit Reports &amp; Regulatory Compliance
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Generate cryptographically signed cold-chain custody reports for WHO PQS inspections.
          </p>
        </div>

        <button
          onClick={() => setIsExportOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Generate Custom Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {r.icon}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-on-surface">
                  {r.title}
                </h3>
                <div className="text-xs text-outline font-mono">
                  Period: {r.period}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-container text-primary">
                    {r.format} ({r.size})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                    {r.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/50 flex items-center justify-between">
              <span className="text-[11px] font-mono text-outline">
                SHA-256 Sign: e3b0c442...
              </span>
              <button
                onClick={() =>
                  setToastMessage(
                    `📥 Download initiated for ${r.title}. Certified digital stamp verified.`
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <ExportSummaryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </main>
  );
}
