"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTelemetry } from "../context/TelemetryContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { alerts, mobileMenuOpen, setMobileMenuOpen } = useTelemetry();

  const unacknowledgedCount = alerts.filter(
    (a) => !a.acknowledged && (a.severity === "critical" || a.severity === "warning")
  ).length;

  const navItems = [
    {
      label: "Dashboard",
      icon: "dashboard",
      href: "/",
    },
    {
      label: "Live Monitoring",
      icon: "sensors",
      href: "/live-monitoring",
    },
    {
      label: "Predictions",
      icon: "psychology",
      href: "/predictions",
    },
    {
      label: "Alerts",
      icon: "warning",
      href: "/alerts",
      badge: unacknowledgedCount > 0 ? unacknowledgedCount : null,
      badgeColor: "bg-error text-on-error",
    },
    {
      label: "Storage Units",
      icon: "ac_unit",
      href: "/inventory",
    },
    {
      label: "Reports",
      icon: "assessment",
      href: "/reports",
    },
    {
      label: "Settings",
      icon: "settings",
      href: "/settings",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 flex flex-col justify-between p-4 z-50 bg-surface-container-lowest border-r border-outline-variant shadow-sm transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Brand & Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform overflow-hidden p-1.5">
                <Image
                  src="/logo.svg"
                  alt="FrostGuard AI Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-headline-sm font-semibold text-primary tracking-tight">
                  FrostGuard AI
                </div>
                <div className="text-label-sm text-outline">
                  Cold-Chain Telemetry MVP
                </div>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Mode Pill Indicator */}
          <div className="px-3 py-1.5 rounded-lg bg-surface-container-low flex items-center gap-2 border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-label-sm text-on-surface-variant font-medium">
              Simulated Sensor Feed • Demo Mode
            </span>
          </div>

          {/* Primary Navigation */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 active:scale-[0.99] ${
                    isActive
                      ? "bg-surface-container text-primary font-semibold border-l-4 border-primary"
                      : "text-on-surface-variant hover:text-on-surface font-normal hover:bg-surface-container-low"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-label-sm font-bold ${
                        item.badgeColor || "bg-error text-on-error"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Utility Links */}
        <div className="border-t border-outline-variant/60 pt-4 flex flex-col gap-1">
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface text-sm hover:bg-surface-container-low transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">
              monitor_heart
            </span>
            <span>System Health</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:text-on-surface text-sm hover:bg-surface-container-low transition-colors duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            <span>Documentation</span>
          </a>
          <div className="mt-2 px-3 py-2 bg-surface-container-low rounded-lg text-on-surface-variant text-label-sm flex items-center justify-between">
            <span>Firmware v2.4-ble-sim</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          </div>
        </div>
      </aside>
    </>
  );
}
