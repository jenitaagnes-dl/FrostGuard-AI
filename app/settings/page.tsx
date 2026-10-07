"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import { DisclaimerBanner } from "../components/Modals";

export default function SettingsPage() {
  const { calibrateSensors, setToastMessage, isLiveStreaming, setIsLiveStreaming } = useTelemetry();

  const [upperLimit, setUpperLimit] = useState(8.0);
  const [lowerLimit, setLowerLimit] = useState(2.0);
  const [warningOffset, setWarningOffset] = useState(0.5);
  const [smsNotification, setSmsNotification] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("https://telemetry-gateway.hospital.internal/v1/webhook");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("⚙️ Telemetry threshold profiles updated and pushed to all 4 BLE gateway nodes!");
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-4xl">
      <DisclaimerBanner />

      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          System Settings &amp; Telemetry Thresholds
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Configure temperature alarm bands, BLE sensor beacon frequency, and automated dispatch escalation triggers.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Temperature Safety Envelope */}
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary text-xl">
              thermostat
            </span>
            <h2 className="text-base font-bold text-on-surface">
              Cold-Chain Temperature Envelope (WHO Standard)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono uppercase font-bold text-on-surface-variant">
                Upper Breach Limit (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={upperLimit}
                onChange={(e) => setUpperLimit(parseFloat(e.target.value))}
                className="mt-1 w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-mono text-sm focus:outline-none focus:border-primary"
              />
              <span className="text-[11px] text-outline font-mono mt-1 block">
                Standard: +8.0°C
              </span>
            </div>

            <div>
              <label className="text-xs font-mono uppercase font-bold text-on-surface-variant">
                Lower Breach Limit (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={lowerLimit}
                onChange={(e) => setLowerLimit(parseFloat(e.target.value))}
                className="mt-1 w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-mono text-sm focus:outline-none focus:border-primary"
              />
              <span className="text-[11px] text-outline font-mono mt-1 block">
                Standard: +2.0°C
              </span>
            </div>

            <div>
              <label className="text-xs font-mono uppercase font-bold text-on-surface-variant">
                Warning Offset (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={warningOffset}
                onChange={(e) => setWarningOffset(parseFloat(e.target.value))}
                className="mt-1 w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-mono text-sm focus:outline-none focus:border-primary"
              />
              <span className="text-[11px] text-outline font-mono mt-1 block">
                Triggers warning at +{(upperLimit - warningOffset).toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Real-time Telemetry Stream */}
        <div className="p-6 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary text-xl">
              sensors
            </span>
            <h2 className="text-base font-bold text-on-surface">
              Telemetry Stream &amp; Gateway Simulation
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-on-surface">
                Simulated 1 Hz Real-Time Stream
              </div>
              <div className="text-xs text-outline">
                Broadcast simulated thermistor readings across all 4 nodes every 2 seconds.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
                isLiveStreaming
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-surface-container text-outline border border-outline-variant"
              }`}
            >
              {isLiveStreaming ? "STREAMING (ON)" : "PAUSED (OFF)"}
            </button>
          </div>

          <div className="pt-2">
            <label className="text-xs font-mono uppercase font-bold text-on-surface-variant">
              Emergency Dispatch Webhook
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg font-mono text-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="smsDispatch"
              checked={smsNotification}
              onChange={(e) => setSmsNotification(e.target.checked)}
              className="h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="smsDispatch" className="text-xs text-on-surface cursor-pointer">
              Enable automated SMS/Push dispatch to mobile transit drivers during detected drift.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={calibrateSensors}
            className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base">tune</span>
            Reset Sensors to Factory Default
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </main>
  );
}
