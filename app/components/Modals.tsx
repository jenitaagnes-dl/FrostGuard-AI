"use client";

import React from "react";
import { useTelemetry } from "../context/TelemetryContext";

export function DisclaimerBanner() {
  return (
    <div className="mb-6 p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-on-surface shadow-xs">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-primary text-xl">
          info
        </span>
        <span className="text-body-sm">
          <strong className="font-semibold text-primary">
            SIMULATED DEMO ENVIRONMENT
          </strong>{" "}
          • Academic Prototype: Not intended for clinical or production medical deployment. Data shown is simulated sensor telemetry.
        </span>
      </div>
      <span className="text-label-sm bg-surface-container-lowest px-2.5 py-1 rounded border border-outline-variant text-outline self-start sm:self-auto font-mono">
        v1.2-ALPHA
      </span>
    </div>
  );
}

export function CalibrationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { calibrateSensors, units } = useTelemetry();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              tune
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">
              Sensor Calibration (NIST Traceable)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs text-on-surface-variant">
            Performs a software zero-point calibration across all four BLE thermistor nodes against a simulated ice-point (+0.00°C) and triple-point water cell.
          </p>

          <div className="space-y-2">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs"
              >
                <div>
                  <div className="font-semibold text-on-surface">{unit.name} ({unit.model})</div>
                  <div className="text-outline font-mono">Offset: ±0.04°C • Probe Pt100</div>
                </div>
                <div className="text-right">
                  <div className="font-telemetry-metric font-bold text-primary">
                    +{unit.temperature.toFixed(1)}°C
                  </div>
                  <span className="text-[10px] text-tertiary font-medium">Valid</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-outline hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              calibrateSensors();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-all"
          >
            Run NIST Re-Zero
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportSummaryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { units, setToastMessage } = useTelemetry();

  if (!isOpen) return null;

  const handleDownload = (format: string) => {
    onClose();
    setToastMessage(`📥 Report successfully compiled in ${format} format with cryptographic hash check!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              download
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">
              Export Cold-Chain Summary
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs text-on-surface-variant">
          <p>
            Generate WHO PQS / 21 CFR Part 11 compliant temperature verification record for all 4 monitored cold-chain storage assets.
          </p>
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 font-mono text-[11px] space-y-1">
            <div>Assets: 4 Monitored Nodes</div>
            <div>Timeframe: Past 24 Hours (86,400 points)</div>
            <div>Verification: NIST Traceable #98421</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => handleDownload("PDF (Audit Dossier)")}
            className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            Export Official GXP PDF Report
          </button>
          <button
            onClick={() => handleDownload("CSV (Raw Telemetry)")}
            className="w-full py-2.5 px-4 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface hover:bg-surface-container font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            Export Raw CSV Telemetry Data
          </button>
        </div>
      </div>
    </div>
  );
}
