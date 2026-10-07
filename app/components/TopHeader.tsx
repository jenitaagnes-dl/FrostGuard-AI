"use client";

import React, { useState } from "react";
import { useTelemetry } from "../context/TelemetryContext";
import Link from "next/link";

export default function TopHeader() {
  const {
    isLiveStreaming,
    setIsLiveStreaming,
    searchQuery,
    setSearchQuery,
    alerts,
    toastMessage,
    setToastMessage,
    calibrateSensors,
    triggerSimulatedBreach,
    isBreachSimulated,
    setMobileMenuOpen,
  } = useTelemetry();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 px-4 lg:px-6 flex items-center justify-between z-30 bg-surface-container-lowest border-b border-outline-variant shadow-xs">
        {/* Mobile menu toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface text-on-surface border border-outline-variant rounded-lg text-body-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Search storage units, sensor tags, batch ID..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Live Status Pill & Stream Switch */}
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            title={isLiveStreaming ? "Pause Live Telemetry Stream" : "Resume Live Telemetry Stream"}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg border border-outline-variant/60 transition-colors"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveStreaming ? "bg-tertiary animate-ping" : "bg-outline"
              }`}
            />
            <span className="text-label-sm text-primary font-medium">
              Demo Feed: {isLiveStreaming ? "Live (1s)" : "Paused"}
            </span>
          </button>

          {/* Quick Simulation Trigger Button */}
          <button
            onClick={triggerSimulatedBreach}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-2xs active:scale-95 ${
              isBreachSimulated
                ? "bg-error text-on-error animate-pulse border border-error"
                : "bg-surface-container-low border border-error/50 text-error hover:bg-error-container/20"
            }`}
            title="Simulate sudden temperature excursion on Unit B"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>{isBreachSimulated ? "Reset Breach" : "Simulate Breach"}</span>
          </button>

          {/* Calibration Shortcut */}
          <button
            onClick={calibrateSensors}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface text-xs font-medium transition-colors"
            title="Zero thermistor sensor offsets across all nodes"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Calibrate</span>
          </button>

          <div className="h-5 w-px bg-outline-variant/60 hidden sm:block" />

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors relative active:scale-95"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      notifications
                    </span>
                    <span className="text-sm font-semibold text-on-surface">
                      Telemetry Alerts ({unreadAlerts.length})
                    </span>
                  </div>
                  <Link
                    href="/alerts"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-label-sm text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg border text-xs transition-colors ${
                        alert.severity === "critical"
                          ? "bg-error-container/20 border-error/40 text-error"
                          : alert.severity === "warning"
                          ? "bg-amber-50 border-amber-200 text-amber-900"
                          : "bg-surface-container-low border-outline-variant/40 text-on-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{alert.title}</span>
                        <span className="text-[10px] text-outline font-normal">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-on-surface-variant line-clamp-2">
                        {alert.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-outline-variant/60" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-bold text-xs shadow-2xs">
              OP
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-body-sm text-on-surface font-semibold leading-tight">
                MVP Demo Operator
              </span>
              <span className="text-label-sm text-outline">Academic Lead</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-outline animate-in slide-in-from-bottom-3 fade-in duration-200">
          <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
            info
          </span>
          <p className="text-xs font-medium leading-relaxed flex-1">
            {toastMessage}
          </p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-outline-variant hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
